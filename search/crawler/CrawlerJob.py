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
    if request_payload.get('url', False):
        return False
    elif request_payload.get('domainId', False):
        return False
    elif request_payload.get('searchIndexId', False):
        return False
    elif request_payload.get('streamId', False):
        return False
    return True


def queue_listener():
    while True:
        training_task = db_manager.get_training_task()
        crawl_response = dict()
        if training_task:
            if not is_valid_request(training_task):
                raise Exception('invalid request payload')
            crawl_id = str(training_task['_id'])
            notify_bot_status(crawl_id, crawl_constants.STATUS_RUNNING)
            training_failed = 0
            try:
                request_payload = training_task['payload']
                request_payload['crawlId'] = crawl_id
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
