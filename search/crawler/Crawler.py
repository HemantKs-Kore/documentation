import re

from search.crawler import utils
from search.crawler.RequestClient import RequestClient

#
# from usp.tree import sitemap_tree_for_homepage

URL_REGEX = re.compile(r'^https?://[^\s/$.?#].[^\s]*$', re.IGNORECASE)
request_client = RequestClient()


class Crawler(object):
    def __init__(self, url):
        self.url = url
        self.homepage_url = None

    @staticmethod
    def ungzip_response_content(url, response):
        raw_data = response.raw_data()
        if utils.is_gzipped_response(url, response):
            raw_data = utils.un_gzip(raw_data)
        if raw_data:
            raw_data = raw_data.decode('utf-8-sig', errors='replace')
        return raw_data

    def fetch_sitemaps(self, url, recursion_depth=0):
        response = request_client.get(url)
        if 200 <= response.status_code < 300:
            response_content = self.ungzip_response_content(url, response)
            if response_content:
                if response_content[:20].strip().startswith('<'):
                    pass  # xml parser
                else:
                    if url.endswith('/robots.txt'):
                        pass  # robot parser
                    else:
                        pass
                        # plain text sitemap parser (saw this possibility in lib)
            else:
                print('No sitemaps found through URL- {}'.format(url))
        else:
            print('No sitemaps found through URL- {}'.format(url))

    def crawl(self):
        if not utils.is_valid_url(self.url):
            return None

        homepage_url = self.get_homepage_of_url(self.url)
        homepage_url = homepage_url + '/' if not homepage_url.endswith('/') else homepage_url
        robots_url = homepage_url + 'robots.txt'
        sitemaps = self.fetch_sitemaps(url=robots_url)
        a = 1


if __name__ == '__main__':
    domain = 'http://www.online.citibank.co.in/citi-nri/faqs-with-answers.htm'
    # domain = 'https://www.online.citibank.co.in'
    c = Crawler(domain)
    c.crawl()
