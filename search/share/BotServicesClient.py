import json
import logging
import traceback

import requests
from crawler.constants import CrawlerConstants as crawl_constants
from share.config.ConfigManager import ConfigManager

config_manager = ConfigManager()
remote_config = config_manager.load_config('remote_config')
crawler_config = config_manager.load_config('crawler')
debug_logger = logging.getLogger('debug')
api_key = crawler_config.get('API_KEY')


def notify_bot_status(crawl_id, status, additional_payload=None):
    try:
        if additional_payload is None:
            additional_payload = dict()

        payload = {crawl_constants.CRAWL_ID_DB_KEY: crawl_id, "status": status}
        if isinstance(additional_payload, dict):
            payload.update(additional_payload)

        headers = {"Content-Type": "application/json",
                   "apikey": api_key
                   }
        payload = json.dumps(payload)
        host_url = crawler_config.get('HOST_URL') + crawler_config.get('STATUS_ENDPOINT').replace('<jobId>', crawl_id)
        resp = requests.post(host_url, data=payload, headers=headers, verify=remote_config.get('ENV_SSL_VERIFY', False))
        if resp.status_code == 200:
            debug_logger.info(
                "status update notified to platform for host url: {}, job_id: {}, status: {}".format(host_url, crawl_id,
                                                                                                     status))
        else:
            debug_logger.critical(
                "error while status update notification with host url: {}, status-code: {}, job_id: {}, status: {}".format(
                    host_url,
                    resp.status_code,
                    crawl_id, status))

    except:
        debug_logger.error(traceback.format_exc())
        debug_logger.error("Exception while sending status update notification for : ".format(crawl_id))
