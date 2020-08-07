import logging
import re
import traceback
from collections import OrderedDict
from decimal import Decimal

import lxml.etree
from lxml.etree import XMLParser

from crawler import utils
from crawler.RequestClient import RequestClient
from crawler.sitemap.AbstractSMParser import AbstractSitemapParser, SitemapData

debug_logger = logging.getLogger('debug')
request_client = RequestClient()


class PageData(object):
    __slots__ = [
        'url',
        'last_modified',
        'change_frequency',
        'priority'
    ]

    def __init__(self):
        self.url = None
        self.last_modified = None
        self.change_frequency = None
        self.priority = None


class XMLSitemapPageParser(object):
    def __init__(self, url, recursion_depth):
        self._recursion_depth = recursion_depth
        self._url = url

    def fetch_sitemaps(self, tree):
        sitemap_url = utils.html_unescape_strip(self._url)
        pages = list()
        try:
            for xml_node in tree.xpath('//sitemap:url',
                                       namespaces={'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}):
                node_children = xml_node.getchildren()
                url_present = False
                current_page = PageData()
                for child in node_children:
                    current_child_text = utils.html_unescape_strip(child.text)
                    if current_child_text:
                        if child.tag == '{http://www.sitemaps.org/schemas/sitemap/0.9}loc':
                            url_present = True
                            current_page.url = current_child_text
                        elif child.tag == '{http://www.sitemaps.org/schemas/sitemap/0.9}changefreq':
                            current_page.change_frequency = current_child_text.lower()
                        elif child.tag == '{http://www.sitemaps.org/schemas/sitemap/0.9}priority':
                            current_page.priority = Decimal(current_child_text)
                if url_present:
                    pages.append(current_page)
        except Exception:
            debug_logger.error(traceback.format_exc())
            return []

        sitemap_data = SitemapData(sitemap_url=sitemap_url, pages_in_sitemap=pages)
        return [sitemap_data]


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
        except Exception:
            debug_logger.error('Error while fetching sitemaps from sitemap index {} '.format(traceback.format_exc()))

        sub_sitemaps = list()
        for sub_sitemap_url in self._sitemaps_in_index_url:
            try:
                sitemap_parser = SitemapGateway(url=sub_sitemap_url, recursion_depth=self._recursion_depth + 1)
                fetched_sitemaps = sitemap_parser.fetch_sitemaps()
                sub_sitemaps.extend(fetched_sitemaps)
            except Exception as e:
                debug_logger.error(
                    'Error while parsing sitemap files from sitemap index- {}'.format(traceback.format_exc()))
        return sub_sitemaps


class RobotSitemapParser(AbstractSitemapParser):
    def __init__(self, url, recursion_depth):
        super().__init__(url, recursion_depth)
        if not utils.is_valid_url(url):
            debug_logger.warning('Not a valid url for parsing sitemap: {}'.format(url))

    def fetch_sitemaps(self, data):
        try:
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
                            debug_logger.warning('Invalid sitemap url- {}'.format(sitemap_url))

            pages_from_sitemaps = list()
            # sitemap url can be a sitemap xml or sitemap index xml
            for sitemap_url in sitemap_urls_dict:
                sitemap_parser = SitemapGateway(
                    url=sitemap_url, recursion_depth=self._recursion_depth
                )
                extracted_pages = sitemap_parser.fetch_sitemaps()
                pages_from_sitemaps.extend(extracted_pages)
            return pages_from_sitemaps
        except Exception:
            debug_logger.error(traceback.format_exc())
            return list()


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
                parser = XMLSitemapPageParser(self._url, self._recursion_depth)
                return parser.fetch_sitemaps(tree)
            else:
                return list()
        except Exception:
            debug_logger.error('Error while parsing XML- {}'.format(traceback.format_exc()))


class SitemapGateway(object):
    __MAX_RECURSION_DEPTH = 10

    def __init__(self, url, recursion_depth):
        if recursion_depth > self.__MAX_RECURSION_DEPTH:
            debug_logger.warning('Recursion depth exceeded')
            raise Exception('recursion depth exceeded')
        self._url = url
        self._recursion_depth = recursion_depth

    def fetch_sitemaps(self):
        debug_logger.info('Fetching content from url- {}'.format(self._url))
        response = request_client.get(self._url)
        if 200 <= response.status_code < 300:
            trimmed_response_content = request_client.get_trimmed_response_data(response)
            response_content = utils.ungzip_response_content(self._url, response, trimmed_response_content)
            if response_content:
                if response_content[:20].strip().startswith('<'):
                    parser = XMLSitemapParser(self._url, self._recursion_depth)
                elif self._url.endswith('/robots.txt'):
                    parser = RobotSitemapParser(self._url, self._recursion_depth)
                else:
                    return None
                sitemaps = parser.fetch_sitemaps(response_content)
                return sitemaps
            else:
                debug_logger.info('No sitemaps found through URL- {}'.format(self._url))
        else:
            debug_logger.info('No sitemaps found through URL- {}'.format(self._url))
        return list()
