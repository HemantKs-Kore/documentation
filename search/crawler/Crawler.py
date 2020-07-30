import re

from search.crawler import utils
from search.crawler.RequestClient import RequestClient
from search.crawler.sitemap.SitemapParser import SitemapGateway

#
# from usp.tree import sitemap_tree_for_homepage

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
request_client = RequestClient()


class Crawler(object):
    def __init__(self, url):
        self.url = url
        self.homepage_url = None

    def crawl(self):
        if not utils.is_valid_url(self.url):
            return None

        homepage_url = utils.get_homepage_of_url(self.url)
        homepage_url = homepage_url + '/' if not homepage_url.endswith('/') else homepage_url
        print('Input url- {}'.format(self.url))
        print('Homepage of input url- {}'.format(homepage_url))
        robots_url = homepage_url + 'robots.txt'
        sitemap_parser = SitemapGateway(url=robots_url, recursion_depth=0)
        sitemaps_fetched = sitemap_parser.fetch_sitemaps()

        for url_path in UNORTHODOX_SITEMAP_PATHS:
            unorthodox_sitemap_url = homepage_url + url_path
            if unorthodox_sitemap_url not in sitemaps_fetched:
                sitemap_parser = SitemapGateway(url=unorthodox_sitemap_url, recursion_depth=0)
                sitemaps_fetched.extend(sitemap_parser.fetch_sitemaps())

        print('Total sitemaps found- {}'.format(len(sitemaps_fetched)))
        print(sitemaps_fetched)


if __name__ == '__main__':
    domain = 'http://www.online.citibank.co.in/citi-nri/faqs-with-answers.htm'
    domain = 'https://www.semicolonworld.com/'
    # domain = 'https://www.xml-sitemaps.com//'
    domain = 'https://www.hdfcbank.com/'
    c = Crawler(domain)
    c.crawl()
