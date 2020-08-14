import json
import logging
import os
import sys
import time
import traceback

sys.path.append(str(os.getcwd()))

from crawler.Crawler import Crawler
from crawler.constants import CrawlerConstants as crawl_constants
from share.BotServicesClient import notify_bot_status
from share.db.DBManager import DBManager
from share.log.log_config import setup_logger

loggers = ["debug", "server"]
setup_logger(loggers)
db_manager = DBManager()
debug_logger = logging.getLogger('debug')
server_logger = logging.getLogger('server')


def is_valid_request(request_payload):
    if not request_payload.get(crawl_constants.RESOURCE_ID_DB_KEY, False):
        return False
    elif not request_payload.get(crawl_constants.SEARCH_INDEX_DB_KEY, False):
        return False
    elif not request_payload.get(crawl_constants.STREAM_ID_DB_KEY, False):
        return False
    elif not request_payload.get(crawl_constants.RESOURCE_TYPE_DB_KEY, False):
        return False
    return True


def build_args(request_payload):
    args = dict()
    args['crawlId'] = request_payload['_id']
    args[crawl_constants.RESOURCE_ID_DB_KEY] = request_payload[crawl_constants.RESOURCE_ID_DB_KEY]
    args[crawl_constants.STREAM_ID_DB_KEY] = request_payload[crawl_constants.STREAM_ID_DB_KEY]
    args[crawl_constants.SEARCH_INDEX_DB_KEY] = request_payload[crawl_constants.SEARCH_INDEX_DB_KEY]
    domain_data = db_manager.get_domain_data_from_db(args[crawl_constants.RESOURCE_ID_DB_KEY])
    args[crawl_constants.DOMAIN_URL_DB_KEY] = domain_data[crawl_constants.DOMAIN_URL_DB_KEY]
    return args


def queue_listener():
    while True:
        training_task = db_manager.get_training_task()
        crawl_response = dict()
        if training_task:
            crawl_id = training_task['_id']
            notify_bot_status(crawl_id, crawl_constants.STATUS_RUNNING)
            training_failed = 0
            try:
                if not is_valid_request(training_task):
                    raise Exception('invalid request payload')
                request_payload = build_args(training_task)
                server_logger.info(json.dumps({"CRAWL_Request": request_payload}))
                debug_logger.info(json.dumps({"CRAWL_Request": request_payload}))
                crawler = Crawler(request_payload.get('url'))
                crawl_response = crawler.crawl(request_payload)
                if crawl_response['status_code'] != 200:
                    training_failed = 1
            except Exception as e:
                training_failed = 1
                crawl_response[crawl_constants.CRAWL_ID_DB_KEY] = crawl_id
                crawl_response['status_code'] = 400
                crawl_response['status_msg'] = str(e) if str(e) else 'Crawling Failed'
                debug_logger.error(traceback.format_exc())

            if training_failed:
                db_manager.update_training_task(training_task['_id'], crawl_constants.STATUS_FAILED)
                server_logger.info(
                    json.dumps(
                        {'CRAWL_Response': {'status': crawl_constants.STATUS_FAILED, 'payload': crawl_response}}))
                notify_bot_status(crawl_id, crawl_constants.STATUS_FAILED, additional_payload=crawl_response)
            else:
                db_manager.update_training_task(training_task['_id'], crawl_constants.STATUS_SUCCESS)
                server_logger.info(
                    json.dumps(
                        {'CRAWL_Response': {'status': crawl_constants.STATUS_SUCCESS, 'payload': crawl_response}}))
                notify_bot_status(crawl_id, crawl_constants.STATUS_SUCCESS, additional_payload=crawl_response)

        else:
            time.sleep(0.5)  # to reduce cpu load if queue is empty


if __name__ == '__main__':
    db_manager.reset_in_progress_tasks()
    print('-' * 32, 'CrawlerJob Started', '-' * 32)
    queue_listener()
