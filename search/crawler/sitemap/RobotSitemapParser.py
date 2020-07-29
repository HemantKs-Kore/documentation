import re
from collections import OrderedDict

from search.crawler import utils
from search.crawler.sitemap.AbstractSMParser import AbstractSitemapParser


class RobotSitemapParser(AbstractSitemapParser):
    def fetch_sitemaps(self, data, recursion_depth=0):
        sitemap_urls = OrderedDict()
        data_by_lines = data.splitlines()
        for line in data_by_lines:
            line = line.strip().lower()
            if line.startswith('site'):
                sitemap_match = re.search(r'^site-?map:\s*(.+?)$', line, flags=re.IGNORECASE)
                if sitemap_match:
                    sitemap_url = sitemap_match.group(1)
                    if utils.is_valid_url(sitemap_url):
                        sitemap_urls[sitemap_url] = True


class RobotIndexSitemapParser(AbstractSitemapParser):
    pass


class XMLSiteMapParser(AbstractSitemapParser):
    pass


class XMLIndexSiteMapParser(object):
    pass
