import re
from collections import OrderedDict

import lxml.etree
from lxml.etree import XMLParser

from search.crawler import utils
from search.crawler.RequestClient import RequestClient
from search.crawler.sitemap.AbstractSMParser import AbstractSitemapParser

request_client = RequestClient()

class XMLSitempaPageParser(object):
    def __init__(self, url, recursion_depth):
        self._recusion_depth = recursion_depth
        self._url = url

    def fetch_sitemaps(self, tree):
        sitemap_url = utils.html_unescape_strip(self._url)
        if sitemap_url:
            return [sitemap_url]

class XMLSitemapIndexParser(object):
    def __init__(self, url, recursion_depth):
        self._recursion_depth = recursion_depth
        self._sitemaps_in_index_url = list()
        self._url = url

    def fetch_sitemaps(self, tree):
        try:
            nps = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            # index file should not have another index file in it.That's a protocol
            for node in tree.xpath('//sitemap:loc//text()', namespaces=nps):
                sitemap_url = utils.html_unescape_strip(node)
                if sitemap_url:
                    self._sitemaps_in_index_url.append(sitemap_url)
        except Exception as e:
            print('Error while fetching sitemaps from sitemap index {} '.format(e))

        for sub_sitemap_url in self._sitemaps_in_index_url:
            pass  # todo this is to fetch all pages in sitemap url
        return self._sitemaps_in_index_url  # todo return this as of now


class RobotSitemapParser(AbstractSitemapParser):
    def __init__(self, url, recursion_depth):
        super().__init__(url, recursion_depth)
        if not utils.is_valid_url(url):
            print('Not a valid url for parsing sitemap: {}'.format(url))

    def fetch_sitemaps(self, data):
        sitemap_urls_dict = OrderedDict()
        data_by_lines = data.splitlines()
        for line in data_by_lines:
            line = line.strip().lower()
            if line.startswith('site'):
                sitemap_match = re.search(r'^site-?map:\s*(.+?)$', line, flags=re.IGNORECASE)
                if sitemap_match:
                    sitemap_url = sitemap_match.group(1)
                    if utils.is_valid_url(sitemap_url):
                        sitemap_urls_dict[sitemap_url] = True
                    else:
                        print('Invalid sitemap url- {}'.format(sitemap_url))

        pages_from_sitemaps = list()
        # sitemap url can be a sitemap xml or sitemap index xml
        for sitemap_url in sitemap_urls_dict:
            sitemap_parser = SitemapGateway(
                url=sitemap_url, recursion_depth=self._recursion_depth
            )
            extracted_pages = sitemap_parser.fetch_sitemaps()
            pages_from_sitemaps.extend(extracted_pages)
        return pages_from_sitemaps


class XMLSitemapParser(AbstractSitemapParser):
    def __init__(self, url, recursion_depth):
        super().__init__(url, recursion_depth)

    def fetch_sitemaps(self, data):
        try:
            xml_parser = XMLParser(ns_clean=True, encoding='utf-8', recover=True)
            xml = bytes(bytearray(data, encoding='utf-8'))
            tree = lxml.etree.fromstring(text=xml, parser=xml_parser)
            if tree.tag.endswith('sitemapindex'):  # sitemap index with sitemap links
                parser = XMLSitemapIndexParser(self._url, self._recursion_depth)
                return parser.fetch_sitemaps(tree)
            elif tree.tag.endswith('urlset'):  # sitemap with page links
                parser = XMLSitempaPageParser(self._url, self._recursion_depth)
                return parser.fetch_sitemaps(tree)
            else:
                return list()
        except Exception as e:
            print('Error while parsing XML- {}'.format(e))

class SitemapGateway(object):
    __MAX_RECURSION_DEPTH = 10

    def __init__(self, url, recursion_depth):
        if recursion_depth > self.__MAX_RECURSION_DEPTH:
            print('Recursion depth exceeded')
        self._url = url
        self._recursion_depth = recursion_depth

    def fetch_sitemaps(self):
        print('Fetching content from url- {}'.format(self._url))
        response = request_client.get(self._url)
        if 200 <= response.status_code < 300:
            trimmed_response_content = request_client.get_trimmed_response_data(response)
            response_content = utils.ungzip_response_content(self._url, response, trimmed_response_content)
            parser = ''  # todo
            if response_content:
                if response_content[:20].strip().startswith('<'):
                    parser = XMLSitemapParser(self._url, response_content)
                elif self._url.endswith('/robots.txt'):
                    parser = RobotSitemapParser(self._url, self._recursion_depth)

                    # plain text sitemap parser (saw this possibility in lib)
                sitemaps = parser.fetch_sitemaps(response_content)
                return sitemaps
            else:
                print('No sitemaps found through URL- {}'.format(self._url))
        else:
            print('No sitemaps found through URL- {}'.format(self._url))
        return list()
