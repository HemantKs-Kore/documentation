"""A Mongo client to communicate with db across the project """
import datetime
import logging
import traceback
import uuid

from crawler.constants import CrawlerConstants as crawler_constants
from pymongo import MongoClient
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
        page_data[crawler_constants.CRAWL_ID_DB_KEY] = crawl_id
        page_data['_id'] = 'pg-' + str(uuid.uuid4())
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
        try:
            self.crawl_queue_db.update_many(
                {'status': crawler_constants.STATUS_RUNNING, 'resourceType': crawler_constants.RESOURCE_TYPE}, {
                    '$set': {'status': crawler_constants.STATUS_QUEUED,
                             'lastModified': datetime.datetime.utcnow()}})
            debug_logger.info('Crawl logs: reset unfinished requests to Queued')
        except:
            debug_logger.error(traceback.format_exc())

    def get_domain_data_from_db(self, domain_id):
        try:
            record = self.domain_db.find_one({'_id': domain_id})
            return record
        except:
            debug_logger.error(traceback.format_exc())
            return dict()

    def _put_train_task_in_queue(self, request_obj):  # testing purpose
        crawl_id = request_obj[crawler_constants.CRAWL_ID_DB_KEY]
        try:
            query = {crawler_constants.CRAWL_ID_DB_KEY: crawl_id, 'status': crawler_constants.STATUS_QUEUED,
                     'resourceType': crawler_constants.RESOURCE_TYPE}
            crawl_payload = {crawler_constants.CRAWL_ID_DB_KEY: crawl_id, 'resourceType': request_obj['resourceType'],
                             'payload': request_obj,
                            '_id': request_obj['_id'],
                             'url': request_obj['url'],
                             'resourceId': request_obj['resourceId'],
                             'status': crawler_constants.STATUS_QUEUED,
                             'searchIndexId': request_obj['searchIndexId'],
                             'streamId': request_obj['streamId'],
                             'startedOn': datetime.datetime.utcnow(), 'lastModified': datetime.datetime.utcnow()}
            updated_record = self.crawl_queue_db.find_one_and_update(query, {'$set': crawl_payload}, upsert=True,
                                                                     full_response=True, return_document=True)
            return True
        except Exception:
            debug_logger.error("FAILED to enqueue crawl request for {}: {}".format(crawl_id, traceback.format_exc()))
            return False


if __name__ == '__main__':
    db = DBManager()
    db._put_train_task_in_queue({
        crawler_constants.CRAWL_ID_DB_KEY: 'ct123',
        'resourceType': crawler_constants.RESOURCE_TYPE,
        'url': 'https://www.online.citibank.co.in/',
        '_id': 'job-123',
        'resourceId': 'r12',
        'searchIndexId': 's-2121',
         'streamId': 'sss'

    })
    db._put_train_task_in_queue({
        crawler_constants.CRAWL_ID_DB_KEY: 'ct124',
        'resourceType': crawler_constants.RESOURCE_TYPE,
        'url': 'https://en.wikipedia.org/wiki/Main_Page/',
        '_id': 'job-113',
        'resourceId': 'r132',
        'searchIndexId' : 's-121',
        'streamId': 'sss'

    })
    db._put_train_task_in_queue({
        crawler_constants.CRAWL_ID_DB_KEY: 'ct125',
        'resourceType': crawler_constants.RESOURCE_TYPE,
        'url': 'https://en.wikipedia.org/wiki/Main_Page/',
        '_id': 'job-114',
        'resourceId': 'r132',
        'searchIndexId' : 's-121',
        'streamId': 'sss'

    })
