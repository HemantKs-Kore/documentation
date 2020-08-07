import logging
import re
import time
import traceback
import urllib.robotparser

from scrapy.crawler import CrawlerProcess

from crawler import utils
from crawler.RequestClient import RequestClient
from crawler.scrapers.LinkScraper import LinkScraper
from crawler.scrapers.ScrapyPageScraper import MySpider
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

    def crawl(self, args):
        try:
            url = args.get('url')
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

            filtered_page_urls = self.filter_urls_by_robots(filtered_page_urls)

            start_time = time.time()
            process = CrawlerProcess({'LOG_LEVEL': 'WARNING',
                                      'ITEM_PIPELINES': {'crawler.scrapers.WebPageScraper.MongoPipeline': 100}
                                      })
            args['start_urls'] = filtered_page_urls
            process.crawl(MySpider, args)
            process.start()
            print('time taken for scraping page data - {} sec'.format((time.time() - start_time) * 1000))
            return {'status_msg': 'Crawling successful', 'status_code': 200}
        except Exception as exception_msg:
            debug_logger.error(traceback.format_exc())
            status_msg = exception_msg if exception_msg else "Crawling failed"
            return {'status_msg': status_msg, 'status_code': 200}


if __name__ == '__main__':
    __domain = 'http://www.online.citibank.co.in/citi-nri/faqs-with-answers.htm'
    # __domain = 'http://www.online.citibank.co.in/citi-nri/'
    # domain = 'https://www.semicolonworld.com/'
    # domain = 'https://www.xml-sitemaps.com//'
    # domain = 'https://docs.scrapy.org/'
    __domain = 'https://aws.amazon.com/faqs/'
    from share.log.log_config import setup_logger

    setup_logger(['debug'])
    c = Crawler()
    c.crawl({'url': __domain})
    # filtered_page_urls = ['https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_headers', 'https://www.online.citibank.co.in/special-offers/home/index.html', 'https://www.online.citibank.co.in/portal/newgendp/cards/citi-rewards-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/static/compare-credit-cards.htm', 'https://www.online.citibank.co.in/portal/cards/MGM/MGM-Referal-Exist.html', 'https://www.online.citibank.co.in/portal/newgendp/cards/cash-back-credit-card.htm', 'https://www.online.citibank.co.in/portal/newgendp/cards/citi-premiermiles-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/fuel/popup/address-proof.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/citi-corporate-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/citibank-rewards-domestic-credit-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/cobranded-cards.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/creditcards_tc.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/finish-it.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/indianoil-titaniumcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/indianoil-platinumcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/rewards-home.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/clickanemi.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/citibank-additional-creditcard/citibank-add-on-credit-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/emi/loanurcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/emi/loanurcard-callback.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/popup/reward-points.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/shop-at-a-store.htm', 'https://www.online.citibank.co.in/citi-prestige/register-your-interest-direct.html', 'https://www.online.citibank.co.in/citi-prestige/terms.html', 'https://www.online.citibank.co.in/citi-prestige/the-experience.html', 'https://www.online.citibank.co.in/portal/newgen/cards/guardyourcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/rewards/cashback.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/travel-shield-secure/travel-shield-secure.htm', 'https://www.online.citibank.co.in/card-offers/credit-card-ahmedabad.htm', 'https://www.online.citibank.co.in/card-offers/credit-card-hyderabad.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/apply-now.htm', 'https://www.online.citibank.co.in/credit-cards/credit-card-apply-online.htm', 'https://www.online.citibank.co.in/citi-prestige/benefits-air-travel-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-at-a-glance-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-exclusive-access-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-luxury-travel-and-hotel-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-rewards-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-service-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/home_logged_off.html', 'https://www.online.citibank.co.in/credit-card/citi-prestige-credit-card.htm', 'https://www.online.citibank.co.in/credit-card/credit-card.htm', 'https://www.online.citibank.co.in/credit-card/products-services/samsung-pay/microsite/samsung-pay.htm', 'https://www.online.citibank.co.in/credit-card/citi-prestige/apply.htm', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/IOC-Outlets/Oct14/IndianOil-Outlets-Citibank.htm', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/Jan16/htm/MGM-ref/MGM-Referal-NTB.html', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/jun15/PremierMiles/PremierMiles-eSite.htm', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/Rewards/ewelcome-pack/Oct14/htm/rewards.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/CorporateCard/corporatecard-form.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/firstcitizencard.htm', 'https://www.online.citibank.co.in/portal/newgen/seo/cards/mediclaim-health-policy-callback.htm']
