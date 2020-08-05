import logging
import traceback
import json
import requests

from share import constants
from share.config.ConfigManager import ConfigManager

config_manager = ConfigManager()
remote_config = config_manager.load_config('remote_config')
debug_logger = logging.getLogger('debug')


def notify_bot_status(kt_id, status, additional_payload=None):
    try:
        if additional_payload is None:
            additional_payload = dict()

        payload = {constants.CRAWL_ID_DB_KEY: kt_id, "status": status}
        if isinstance(additional_payload, dict):
            payload.update(additional_payload)

        headers = {"Content-Type": "application/json"}
        payload = json.dumps(payload)
        host_url = ''  # todo
        resp = requests.post(host_url, data=payload, headers=headers, verify=remote_config.get('ENV_SSL_VERIFY', False))
        if resp.status_code == 200:
            debug_logger.info("status update notified to platform for kt_id: {}, status: {}".format(kt_id, status))
        else:
            debug_logger.critical(
                "error while status update notification: {}, kt_id: {}".format(resp.status_code, kt_id))

    except:
        debug_logger.error(traceback.format_exc())
        debug_logger.error("Exception while sending status update notification for : ".format(kt_id))
