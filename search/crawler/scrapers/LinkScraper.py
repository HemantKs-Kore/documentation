import logging

from scrapy.http import HtmlResponse
from scrapy.linkextractors import LinkExtractor

from crawler import utils
from crawler.RequestClient import RequestClient
from share.config.ConfigManager import ConfigManager

config_manager = ConfigManager()

crawl_config = config_manager.load_config('crawler')
CRAWL_LIMIT = crawl_config.get('URL_CRAWL_LIMIT')
debug_logger = logging.getLogger('debug')
request_client = RequestClient()


class LinkScraper(object):
    def __init__(self):
        pass

    def scrape_urls(self, page_url):
        response = request_client.get(page_url)
        content_type = response.headers.get('content-type', '')
        if 'text/html' in content_type:
            page_text = response.text
            response = HtmlResponse(url=page_url, body=page_text, encoding='utf-8')
            hostname = utils.get_hostname(page_url)
            debug_logger.info('Identified hostname of url- {} as hostname- {}'.format(page_url, hostname))
            allowed_domains = [hostname] if hostname else list()
            link_extractor = LinkExtractor(unique=True, allow_domains=allowed_domains)
            extracted_links = link_extractor.extract_links(response)
            sub_urls = [link.url for link in extracted_links]
            return sub_urls[:CRAWL_LIMIT]
        else:
            debug_logger.warning('Invalid response content type - {}'.format(content_type))
            return list()
