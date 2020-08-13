import logging
import re
import time
import traceback
import urllib.robotparser

from crawler import utils
from crawler.RequestClient import RequestClient
from crawler.constants import CrawlerConstants as crawl_constants
from crawler.scrapers.LinkScraper import LinkScraper
from crawler.scrapers.ScrapyPageScraper import PageScraper
from crawler.sitemap.SitemapParser import SitemapGateway, SitemapData
from scrapy.crawler import CrawlerProcess
from share.BotServicesClient import notify_bot_status
from share.config.ConfigManager import ConfigManager

debug_logger = logging.getLogger('debug')
request_client = RequestClient()
config_manager = ConfigManager()
link_scraper = LinkScraper()
robot_parser = urllib.robotparser.RobotFileParser()
crawl_config = config_manager.load_config('crawler')
CRAWL_LIMIT = crawl_config.get('URL_CRAWL_LIMIT')
CRAWL_ONLY_SUB_DOMAINS = crawl_config.get('CRAWL_ONLY_SUB_DOMAINS', True)


class Crawler(object):
    def __init__(self, url):
        self.url = url
        self.homepage_url = utils.get_homepage_of_url(url) + '/'
        self.robots_url = self.homepage_url + 'robots.txt'
        self.robot_parse_status = self.set_robot_parser()
        self.is_sub_domain = self.is_url_same_as_homepage()

    def is_url_same_as_homepage(self):
        return self.url.rstrip('/') != self.homepage_url.rstrip('/')

    def set_robot_parser(self):
        try:
            robot_parser.set_url(self.robots_url)
            robot_parser.read()
            return True
        except Exception:
            debug_logger.error(traceback.format_exc())
            return False

    @staticmethod
    def filter_urls_by_robots(url_list, user_agent='*'):
        filtered_urls = list()
        for url in url_list:
            try:
                if robot_parser.can_fetch(user_agent, url):
                    filtered_urls.append(url)
            except Exception:
                debug_logger.warning(traceback.format_exc())
        return filtered_urls

    @staticmethod
    def filter_urls_from_sitemap(domain_url, sitemap_data, crawl_only_sub_domain, is_sub_domain):

        valid_page_urls = list()
        if crawl_only_sub_domain and is_sub_domain:
            valid_sitemaps = list()
            for sitemap_fetched in sitemap_data:
                page_urls = list(
                    filter(lambda page: page.url.startswith(domain_url), sitemap_fetched.pages_in_sitemaps))
                page_urls = [page.url for page in page_urls]
                if page_urls:
                    valid_page_urls.extend(page_urls)
                    valid_sitemaps.append(sitemap_fetched.sitemap_url)
            # valid_page_urls = [domain_url] + valid_page_urls if domain_url not in valid_page_urls else valid_page_urls

        else:
            valid_page_urls = [page.url for sitemap_fetched in sitemap_data for page in
                               sitemap_fetched.pages_in_sitemaps]
            valid_sitemaps = [sitemap_fetched.sitemap_url for sitemap_fetched in sitemap_data if len(sitemap_fetched.pages_in_sitemaps) > 0]
        valid_page_urls = valid_page_urls[: CRAWL_LIMIT]
        return valid_page_urls, valid_sitemaps

    def get_crawl_settings(self, user_agent='*'):
        settings = {'LOG_LEVEL': "WARNING", 'ITEM_PIPELINES': {'crawler.scrapers.ScrapyPageScraper.MongoPipeline': 100}}
        if self.robot_parse_status and robot_parser.crawl_delay(useragent=user_agent):
            settings['DOWNLOAD_DELAY'] = robot_parser.crawl_delay(useragent=user_agent)
        else:
            settings['DOWNLOAD_DELAY'] = 1  # seconds, #todo: need to change later
        settings['DOWNLOAD_TIMEOUT'] = 10  # seconds
        settings['DOWNLOAD_MAXSIZE'] = 12 * 1024 * 1024  # 12 MB
        settings['USER_AGENT'] = user_agent
        return settings

    @staticmethod
    def notify_validation_status(crawl_id, sitemaps_fetched, url_check=True):
        status = crawl_constants.STATUS_VALIDATION
        payload = dict()
        payload['url_validation'] = url_check
        payload['sitemaps'] = sitemaps_fetched
        notify_bot_status(crawl_id, status, additional_payload=payload)

    def fetch_sitemaps_from_conventions(self, fetched_url_set, sitemaps_fetched):
        debug_logger.info('Trying to fetch sitemaps which are not present in robots.txt')
        for url_path in crawl_constants.UNORTHODOX_SITEMAP_PATHS:
            unorthodox_sitemap_url = self.homepage_url + url_path
            if unorthodox_sitemap_url not in fetched_url_set:
                sitemap_parser = SitemapGateway(url=unorthodox_sitemap_url, recursion_depth=0)
                sitemap_data = sitemap_parser.fetch_sitemaps()
                if isinstance(sitemap_data, SitemapData):
                    sitemaps_fetched.append(sitemap_data)
                    fetched_url_set.add(sitemap_data.sitemap_url)
                elif isinstance(sitemap_data, list):  # if result is from a sitemap index
                    for data in sitemap_data:
                        if isinstance(data, SitemapData):
                            sitemaps_fetched.append(data)
                            fetched_url_set.add(data.sitemap_url)

    def crawl(self, args):
        try:
            url = args.get('url')
            crawl_id = args.get('crawlId')
            if not utils.is_valid_url(url):
                return {'status_code': crawl_constants.URL_VALIDATION_ERR_CODE,
                        'status_msg': crawl_constants.URL_VALIDATION_MSG}

            user_agent = args.get('userAgent', '*')
            debug_logger.info('Homepage of input url- {}'.format(self.homepage_url))
            print('Fetching sitemaps ...')
            sitemap_parser = SitemapGateway(url=self.robots_url, recursion_depth=0)
            sitemaps_fetched = sitemap_parser.fetch_sitemaps()
            fetched_url_set = {i.sitemap_url for i in sitemaps_fetched if isinstance(i, SitemapData)}
            if not fetched_url_set:  # fetch sitemaps from other conventions if not found one
                self.fetch_sitemaps_from_conventions(fetched_url_set, sitemaps_fetched)

            debug_logger.info('Total sitemaps found- {}'.format(len(sitemaps_fetched)))
            filtered_page_urls, filtered_sitemaps = self.filter_urls_from_sitemap(url, sitemaps_fetched,
                                                                                  CRAWL_ONLY_SUB_DOMAINS,
                                                                                  self.is_sub_domain)
            self.notify_validation_status(crawl_id, filtered_sitemaps)

            if not filtered_page_urls or (len(filtered_page_urls) == 1 and filtered_page_urls[0] == url):
                filtered_page_urls = link_scraper.scrape_urls(page_url=url)
            if self.robot_parse_status:
                filtered_page_urls = self.filter_urls_by_robots(filtered_page_urls, user_agent=user_agent)

            if len(filtered_page_urls):
                status_msg = 'No links found to scrape after following Robots.txt'
                debug_logger.warning(status_msg)
                return {'status_msg': status_msg, 'status_code': 400}

            crawl_settings = self.get_crawl_settings(user_agent=user_agent)
            start_time = time.time()
            process = CrawlerProcess(settings=crawl_settings)
            args['start_urls'] = filtered_page_urls
            print('Initiated scraping for {} pages...'.format(len(filtered_page_urls)))
            process.crawl(PageScraper, args)
            process.start()
            print('time taken for scraping page data - {} sec'.format((time.time() - start_time) * 1000))
            debug_logger.info('Completed scraping process...')
            return {'status_msg': 'Crawling successful', 'status_code': 200}
        except Exception as exception_msg:
            debug_logger.error(traceback.format_exc())
            status_msg = str(exception_msg) if str(exception_msg) else "Crawling failed"
            return {'status_msg': status_msg, 'status_code': 400}


if __name__ == '__main__':
    # __domain = 'http://www.online.citibank.co.in/citi-nri/faqs-with-answers.htm'
    # __domain = 'https://en.wikipedia.org/wiki/Main_Page'
    # __domain = 'https://www.semicolonworld.com/'
    # __domain = 'https://www.propstream.com/'
    __domain = 'https://www.xml-sitemaps.com//'
    __domain = 'https://www.cars24.com/'
    __domain = 'https://in.bookmyshow.com/'
    from share.log.log_config import setup_logger

    setup_logger(['debug'])
    c = Crawler(__domain)
    c.crawl({'url': __domain, 'crawlId': 'prop',
             'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'})
    # c.crawl({'url': __domain, 'crawlId': 'with_headers'})
