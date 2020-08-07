"""A Mongo client to communicate with db across the project """
import datetime
import logging
import traceback

from pymongo import MongoClient

from share import constants
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
        page_data['crawl_id'] = crawl_id
        self.pages_db.insert(page_data)
        return True

    def insert_domain_data_in_db(self, search_index_id, domain_data):
        pass

    def put_train_task_in_queue(self, request_obj):
        crawl_id = request_obj["crawlId"]
        try:
            query = {'crawlId': crawl_id, 'status': constants.STATUS_QUEUED, 'resourceType': constants.RESOURCE_TYPE}
            crawl_payload = {'crawlId': crawl_id, 'resourceType': "domain", 'payload': request_obj,
                             'status': constants.STATUS_QUEUED,
                             'startedOn': datetime.datetime.utcnow(), 'lastModified': datetime.datetime.utcnow()}
            updated_record = self.crawl_queue_db.find_one_and_update(query, {'$set': crawl_payload}, upsert=True,
                                                                     full_response=True, return_document=True)
            return True
        except Exception:
            debug_logger.error("FAILED to enqueue crawl request for {}: {}".format(crawl_id, traceback.format_exc()))
            return False

    def get_training_task(self):
        try:
            updated_record = self.crawl_queue_db.find_one_and_update(
                {'status': constants.STATUS_QUEUED, 'resourceType': constants.RESOURCE_TYPE}, {
                    '$set': {'status': constants.STATUS_running, 'lastModified': datetime.datetime.utcnow()}})
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
                    {'status': constants.STATUS_running, 'resourceType': constants.RESOURCE_TYPE}, {
                        '$set': {'status': constants.STATUS_QUEUED, 'lastModified': datetime.datetime.utcnow()}})
                break
            except:
                debug_logger.error(traceback.format_exc())
        debug_logger.info('Crawl logs: reset unfinished requests to Failed')
