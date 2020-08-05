import re
from collections import OrderedDict

from scrapy.crawler import CrawlerProcess

from crawler import utils
from crawler.RequestClient import RequestClient
from crawler.sitemap.SitemapParser import SitemapGateway, SitemapData
from crawler.spiders.WebPageScraper import MySpider
from share.config.ConfigManager import ConfigManager

request_client = RequestClient()
config_manager = ConfigManager()
crawl_config = config_manager.load_config('crawler')
CRAWL_LIMIT = crawl_config.get('CRAWL_LIMIT')
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
        self.url = url
        self.homepage_url = None

    def filter_urls_by_rules(self, page_urls, crawl_sub_domain=True, blacklist_rules=None, whitelist_rules=None):
        if crawl_sub_domain:
            page_urls = list(filter(lambda page: page.startswith(self.url), page_urls))
        else:
            page_urls = list(page_urls.keys())
        page_urls = page_urls[: CRAWL_LIMIT]
        return page_urls

    def crawl(self):
        if True:
            if not utils.is_valid_url(self.url):
                return None

            homepage_url = utils.get_homepage_of_url(self.url)
            homepage_url = homepage_url + '/' if not homepage_url.endswith('/') else homepage_url
            print('Input url- {}'.format(self.url))
            print('Homepage of input url- {}'.format(homepage_url))
            robots_url = homepage_url + 'robots.txt'
            sitemap_parser = SitemapGateway(url=robots_url, recursion_depth=0)
            sitemaps_fetched = sitemap_parser.fetch_sitemaps()
            fetched_url_set = {i.sitemap_url for i in sitemaps_fetched if isinstance(i, SitemapData)}

            for url_path in UNORTHODOX_SITEMAP_PATHS:
                unorthodox_sitemap_url = homepage_url + url_path
                if unorthodox_sitemap_url not in fetched_url_set:
                    sitemap_parser = SitemapGateway(url=unorthodox_sitemap_url, recursion_depth=0)
                    sitemap_data = sitemap_parser.fetch_sitemaps()
                    if isinstance(sitemap_data, SitemapData):
                        sitemaps_fetched.append(sitemap_data)

            print('Total sitemaps found- {}'.format(len(sitemaps_fetched)))
            page_urls = OrderedDict()
            page_urls[self.url] = True
            for sitemap in sitemaps_fetched:
                for page in sitemap.pages_in_sitemaps:
                    page_urls[page.url] = True

            if not page_urls:
                pass  # todo: scrape all urls in page and validate robots.txt

            filtered_page_urls = self.filter_urls_by_rules(page_urls, crawl_config.get('INGEST_SUB_DOMAIN', True))

        # filtered_page_urls = ['https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_headers', 'https://www.online.citibank.co.in/special-offers/home/index.html', 'https://www.online.citibank.co.in/portal/newgendp/cards/citi-rewards-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/static/compare-credit-cards.htm', 'https://www.online.citibank.co.in/portal/cards/MGM/MGM-Referal-Exist.html', 'https://www.online.citibank.co.in/portal/newgendp/cards/cash-back-credit-card.htm', 'https://www.online.citibank.co.in/portal/newgendp/cards/citi-premiermiles-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/fuel/popup/address-proof.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/citi-corporate-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/citibank-rewards-domestic-credit-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/cobranded-cards.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/creditcards_tc.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/finish-it.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/indianoil-titaniumcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/indianoil-platinumcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/rewards-home.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/clickanemi.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/citibank-additional-creditcard/citibank-add-on-credit-card.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/emi/loanurcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/emi/loanurcard-callback.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/popup/reward-points.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/shop-at-a-store.htm', 'https://www.online.citibank.co.in/citi-prestige/register-your-interest-direct.html', 'https://www.online.citibank.co.in/citi-prestige/terms.html', 'https://www.online.citibank.co.in/citi-prestige/the-experience.html', 'https://www.online.citibank.co.in/portal/newgen/cards/guardyourcard.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/rewards/cashback.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/travel-shield-secure/travel-shield-secure.htm', 'https://www.online.citibank.co.in/card-offers/credit-card-ahmedabad.htm', 'https://www.online.citibank.co.in/card-offers/credit-card-hyderabad.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/apply-now.htm', 'https://www.online.citibank.co.in/credit-cards/credit-card-apply-online.htm', 'https://www.online.citibank.co.in/citi-prestige/benefits-air-travel-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-at-a-glance-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-exclusive-access-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-luxury-travel-and-hotel-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-rewards-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/benefits-service-logged-off.html', 'https://www.online.citibank.co.in/citi-prestige/home_logged_off.html', 'https://www.online.citibank.co.in/credit-card/citi-prestige-credit-card.htm', 'https://www.online.citibank.co.in/credit-card/credit-card.htm', 'https://www.online.citibank.co.in/credit-card/products-services/samsung-pay/microsite/samsung-pay.htm', 'https://www.online.citibank.co.in/credit-card/citi-prestige/apply.htm', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/IOC-Outlets/Oct14/IndianOil-Outlets-Citibank.htm', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/Jan16/htm/MGM-ref/MGM-Referal-NTB.html', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/jun15/PremierMiles/PremierMiles-eSite.htm', 'https://www.online.citibank.co.in/Credit-Cards/Standalone/Rewards/ewelcome-pack/Oct14/htm/rewards.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/CorporateCard/corporatecard-form.htm', 'https://www.online.citibank.co.in/portal/newgen/cards/tab/firstcitizencard.htm', 'https://www.online.citibank.co.in/portal/newgen/seo/cards/mediclaim-health-policy-callback.htm']
        process = CrawlerProcess({'LOG_LEVEL': 'WARNING',
                                  'ITEM_PIPELINES': {'crawler.spiders.WebPageScraper.MongoPipeline': 100}
                                  })
        process.crawl(MySpider, start_urls=filtered_page_urls)
        process.start()


if __name__ == '__main__':
    domain = 'http://www.online.citibank.co.in/citi-nri/faqs-with-answers.htm'
    # domain = 'https://www.semicolonworld.com/'
    # domain = 'https://www.xml-sitemaps.com//'
    # domain = 'https://docs.scrapy.org/'
    domain = 'https://aws.amazon.com/faqs/'
    c = Crawler(domain)
    c.crawl()
