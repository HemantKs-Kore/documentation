"""A Mongo client to communicate with db across the project """
import datetime
import logging
import traceback

from pymongo import MongoClient

from crawler.constants import CrawlerConstants as crawler_constants
from share.config.ConfigManager import ConfigManager

debug_logger = logging.getLogger('debug')

config_manager = ConfigManager()


class Singleton(object):
    """
    Singleton interface:
    http://www.python.org/download/releases/2.2.3/descrintro/#__new__
    """

    def __new__(cls, *args, **kwds):
        it = cls.__dict__.get("__it__")
        if it is not None:
            return it
        cls.__it__ = it = object.__new__(cls)
        it.init(*args, **kwds)
        return it

    def init(self, *args, **kwds):
        pass


class DBManager(Singleton):
    """ Mongo opearation manager"""

    def __init__(self):
        conf = config_manager.load_config(key='db')
        client = MongoClient(conf.get('MONGO_URI'))
        database = client[conf.get('DB_NAME')]
        self.pages_db = database[conf.get('COLLECTION_PAGES')]
        self.domain_db = database[conf.get('COLLECTION_DOMAIN')]
        self.crawl_queue_db = database[conf.get('COLLECTION_CRAWLER_QUEUE')]

    def insert_page_data_in_db(self, crawl_id, page_data):
        page_data['createdOn'] = datetime.datetime.utcnow()
        page_data['crawlId'] = crawl_id
        self.pages_db.insert(page_data)
        return True

    def get_training_task(self):
        try:
            updated_record = self.crawl_queue_db.find_one_and_update(
                {'status': crawler_constants.STATUS_QUEUED, 'resourceType': crawler_constants.RESOURCE_TYPE}, {
                    '$set': {'status': crawler_constants.STATUS_RUNNING, 'lastModified': datetime.datetime.utcnow()}})
            return updated_record
        except:
            debug_logger.error(traceback.format_exc())
            return False

    def update_training_task(self, document_id, status):
        try:
            updated_record = self.crawl_queue_db.find_one_and_update({'_id': document_id}, {
                '$set': {'status': status, 'lastModified': datetime.datetime.utcnow()}})
            return updated_record
        except:
            debug_logger.error(traceback.format_exc())
            return False

    def reset_in_progress_tasks(self):
        while True:
            try:
                self.crawl_queue_db.update_many(
                    {'status': crawler_constants.STATUS_RUNNING, 'resourceType': crawler_constants.RESOURCE_TYPE}, {
                        '$set': {'status': crawler_constants.STATUS_QUEUED, 'lastModified': datetime.datetime.utcnow()}})
                break
            except:
                debug_logger.error(traceback.format_exc())
        debug_logger.info('Crawl logs: reset unfinished requests to Failed')
