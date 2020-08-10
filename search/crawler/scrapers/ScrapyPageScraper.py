import itertools
import logging
import traceback

import scrapy
from scrapy import signals
from pydispatch import dispatcher
from bs4 import BeautifulSoup
from scrapy.exceptions import DropItem
from scrapy.selector import Selector

from share.db.DBManager import DBManager

debug_logger = logging.getLogger('debug')
db_manager = DBManager()
sections_xpath = '[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]'


class ScrapyItem(scrapy.Item):
    title = scrapy.Field()
    sections = scrapy.Field()
    url = scrapy.Field()
    body = scrapy.Field()
    imageUrl = scrapy.Field()
    domainId = scrapy.Field()
    searchIndexId = scrapy.Field()
    streamId = scrapy.Field()
    searchResultPreview = scrapy.Field()


class MongoPipeline(object):
    def __init__(self):
        pass

    def process_item(self, data_item, spider):
        if data_item['url'] and data_item['body']:
            try:
                data_item['sections'] = [section_text.strip() for section_text in data_item['sections'] if
                                         section_text.strip()]
                data_item['domainId'] = spider.domain_id
                data_item['searchIndexId'] = spider.search_index_id
                data_item['streamId'] = spider.stream_id
                data_item['searchResultPreview'] = ''
                db_manager.insert_page_data_in_db(spider.crawl_id, dict(data_item))
            except Exception:
                debug_logger.info('Error while inserting page in db: {}'.format(traceback.format_exc()))
        else:
            raise DropItem('Missing information on item scraped- {}'.format(dict(data_item)))
        return data_item


class PageScraper(scrapy.Spider):
    name = 'sitemapspi'

    # custom_settings = {'LOG_LEVEL': 'WARNING',
    #                    'ITEM_PIPELINES': {'search.crawler.scrapers.WebPageScraper.MongoPipeline': 100}
    #                    }

    def __init__(self, args):
        dispatcher.connect(self.spider_closed, signals.spider_closed)
        self.start_urls = args.get('start_urls', [])
        self.domain_id = args.get('domain_id')
        self.url = args.get('url')
        self.search_index_id = args.get('searchIndexId')
        self.stream_id = args.get('streamId')
        self.crawl_id = args.get('crawlId')
        self.allowed_page_counter = itertools.count().__next__
        self.skipped_page_counter = itertools.count().__next__
        debug_logger.info('Total number of urls to scrape- {}'.format(len(self.start_urls)))
        super(PageScraper, self).__init__()

    def get_html_text_content(self, html_text):
        soup = BeautifulSoup(html_text, "html.parser")
        soup = soup.find('body')
        text_content = soup.get_text(separator="\n", strip=True)
        return text_content

    def parse(self, response):
        try:
            response_headers = response.headers.to_unicode_dict()
            content_type = response_headers.get('content-type', '')
            if "text/html" in content_type:
                selector = Selector(response=response)
                data_item = ScrapyItem()
                title = selector.xpath('//title/text()').extract()
                data_item['title'] = title[0] if title else 'TITLE'
                sections = selector.xpath('//*' + sections_xpath + '/text()').extract()
                data_item['sections'] = sections
                body = self.get_html_text_content(response.text)
                data_item['body'] = body
                data_item['url'] = response.url
                image_urls = []
                for image in response.xpath('//img/@src').extract():
                    image_urls.append(response.urljoin(image))
                data_item['imageUrl'] = image_urls
                self.allowed_page_counter()
                yield data_item
            else:
                self.skipped_page_counter()
                debug_logger.info('skipping item - '.format(content_type))
        except:
            self.skipped_page_counter()
            debug_logger.error(traceback.format_exc())

    def spider_closed(self, spider):
        print('Number of pages scraped - {}'.format(self.allowed_page_counter()))
        print('Number of pages skipped - {}'.format(self.skipped_page_counter()))
        spider.logger.info('Spider closed: %s', spider.name)