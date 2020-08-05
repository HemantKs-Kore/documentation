import itertools

import scrapy
from bs4 import BeautifulSoup
from scrapy.exceptions import DropItem
from scrapy.selector import Selector

from share.db.DBManager import DBManager

db_manager = DBManager()
counter = itertools.count().__next__
sections_xpath = '[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]'


class ScrapyItem(scrapy.Item):
    title = scrapy.Field()
    sections = scrapy.Field()
    url = scrapy.Field()
    body = scrapy.Field()
    image_urls = scrapy.Field()


class MongoPipeline(object):
    def __init__(self):
        pass

    def process_item(self, item, spider):
        if item['url'] and item['body']:
            # put in mongo
            pass
        else:
            raise DropItem('Missing information on item scraped from url- {}'.format(item['url']))
        return item


class MySpider(scrapy.Spider):
    name = 'sitemapspi'

    # custom_settings = {'LOG_LEVEL': 'WARNING',
    #                    'ITEM_PIPELINES': {'search.crawler.spiders.WebPageScraper.MongoPipeline': 100}
    #                    }

    def __init__(self, start_urls, *args, **kwargs):
        self.start_urls = start_urls
        super(MySpider, self).__init__(*args, **kwargs)

    def get_html_text_content(self, html_text):
        soup = BeautifulSoup(html_text, "html.parser")
        text_content = soup.get_text(separator="\n", strip=True)
        return text_content

    def parse(self, response):
        selector = Selector(response=response)
        data_item = ScrapyItem()
        title = selector.xpath('//title/text()').extract()[0]
        data_item['title'] = title
        sections = selector.xpath('//*' + sections_xpath + '/text()').extract()
        data_item['sections'] = sections
        body = self.get_html_text_content(response.text)
        data_item['body'] = body
        data_item['url'] = response.url
        image_urls = []
        for image in response.xpath('//img/@src').extract():
            image_urls.append(response.urljoin(image))
        data_item['image_urls'] = image_urls
        yield data_item
