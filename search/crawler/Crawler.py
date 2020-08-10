import logging
import re
import time
import traceback
import urllib.robotparser

from scrapy.crawler import CrawlerProcess

from crawler import utils
from crawler.RequestClient import RequestClient
from crawler.scrapers.LinkScraper import LinkScraper
from crawler.scrapers.ScrapyPageScraper import PageScraper
from crawler.sitemap.SitemapParser import SitemapGateway, SitemapData
from share.config.ConfigManager import ConfigManager

debug_logger = logging.getLogger('debug')
request_client = RequestClient()
config_manager = ConfigManager()
link_scraper = LinkScraper()
robot_parser = urllib.robotparser.RobotFileParser()
crawl_config = config_manager.load_config('crawler')
CRAWL_LIMIT = crawl_config.get('URL_CRAWL_LIMIT')
URL_REGEX = re.compile(r'^https?://[^\s/$.?#].[^\s]*$', re.IGNORECASE)
UNORTHODOX_SITEMAP_PATHS = {
    'sitemap.xml',
    'sitemap.xml.gz',
    'sitemap_index.xml',
    'sitemap-index.xml',
    'sitemap_index.xml.gz',
    'sitemap-index.xml.gz',
    '.sitemap.xml',
    'sitemap',
    'admin/config/search/xmlsitemap',
    'sitemap/sitemap-index.xml',
}


class Crawler(object):
    def __init__(self, url):
        if not utils.is_valid_url(url):
            raise Exception('Invalid URL received for crawling')
        self.homepage_url = utils.get_homepage_of_url(url) + '/'
        self.robots_url = self.homepage_url + 'robots.txt'
        self.robot_parse_status = self.set_robot_parser()

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
    def filter_urls_from_sitemap(domain_url, sitemap_data, crawl_sub_domain=True):

        valid_page_urls = list()
        if crawl_sub_domain:
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
            valid_sitemaps = [sitemap_fetched.sitemap_url for sitemap_fetched in sitemap_data]
        valid_page_urls = valid_page_urls[: CRAWL_LIMIT]
        return valid_page_urls, valid_sitemaps

    def get_crawl_settings(self, user_agent='*'):
        settings = {'LOG_LEVEL': "WARNING", 'ITEM_PIPELINES': {'crawler.scrapers.ScrapyPageScraper.MongoPipeline': 100}}
        if self.robot_parse_status and robot_parser.crawl_delay(useragent=user_agent):
            settings['DOWNLOAD_DELAY'] = robot_parser.crawl_delay(useragent=user_agent)
        settings['DOWNLOAD_TIMEOUT'] = 10  # seconds
        settings['DOWNLOAD_MAXSIZE'] = 10 * 1024 * 1024  # 10 MB
        settings['USER_AGENT'] = user_agent
        return settings

    def crawl(self, args):
        try:
            url = args.get('url')
            user_agent = args.get('userAgent', '*')
            debug_logger.info('Homepage of input url- {}'.format(self.homepage_url))
            sitemap_parser = SitemapGateway(url=self.robots_url, recursion_depth=0)
            sitemaps_fetched = sitemap_parser.fetch_sitemaps()
            fetched_url_set = {i.sitemap_url for i in sitemaps_fetched if isinstance(i, SitemapData)}

            if not fetched_url_set:  # fetch sitemaps from other conventions if not found one
                debug_logger.info('Trying to fetch sitemaps which are not present in robots.txt')
                for url_path in UNORTHODOX_SITEMAP_PATHS:
                    unorthodox_sitemap_url = self.homepage_url + url_path
                    if unorthodox_sitemap_url not in fetched_url_set:
                        sitemap_parser = SitemapGateway(url=unorthodox_sitemap_url, recursion_depth=0)
                        sitemap_data = sitemap_parser.fetch_sitemaps()
                        if isinstance(sitemap_data, SitemapData):
                            sitemaps_fetched.append(sitemap_data)

            debug_logger.info('Total sitemaps found- {}'.format(len(sitemaps_fetched)))
            filtered_page_urls, filtered_sitemaps = self.filter_urls_from_sitemap(url, sitemaps_fetched,
                                                                                  crawl_config.get('INGEST_SUB_DOMAIN',
                                                                                                   True))
            if not filtered_page_urls or (len(filtered_page_urls) == 1 and filtered_page_urls[0] == url):
                filtered_page_urls = link_scraper.scrape_urls(page_url=url)
            if self.robot_parse_status:
                filtered_page_urls = self.filter_urls_by_robots(filtered_page_urls, user_agent=user_agent)

            crawl_settings = self.get_crawl_settings(user_agent=user_agent)
            start_time = time.time()
            process = CrawlerProcess(settings=crawl_settings)
            args['start_urls'] = filtered_page_urls
            print('Initiated scraping for {} pages...'.format(len(filtered_page_urls)))
            process.crawl(PageScraper, args)
            process.start()
            print('time taken for scraping page data - {} sec'.format((time.time() - start_time) * 1000))
            return {'status_msg': 'Crawling successful', 'status_code': 200}
        except Exception as exception_msg:
            debug_logger.error(traceback.format_exc())
            status_msg = str(exception_msg) if str(exception_msg) else "Crawling failed"
            return {'status_msg': status_msg, 'status_code': 200}


if __name__ == '__main__':
    __domain = 'http://www.online.citibank.co.in/citi-nri/faqs-with-answers.htm'
    # __domain = 'https://en.wikipedia.org/wiki/Main_Page'
    # __domain = 'https://www.semicolonworld.com/'
    __domain = 'https://www.xml-sitemaps.com//'
    from share.log.log_config import setup_logger

    setup_logger(['debug'])
    c = Crawler(__domain)
    c.crawl({'url': __domain, 'crawlId': 'with_headers', 'userAgent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'})
    # c.crawl({'url': __domain, 'crawlId': 'with_headers'})
