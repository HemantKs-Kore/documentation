"""A Mongo client to communicate with db across the project """
import logging

from pymongo import MongoClient

from search.share.config.ConfigManager import ConfigManager

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

    def insert_page_data_in_db(self, search_index_id, page_data):
        pass

    def insert_domain_data_in_db(self, search_index_id, domain_data):
        pass
