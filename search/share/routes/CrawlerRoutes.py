import json
import sys

sys.path.extend(['../'])
from share.db.DBManager import DBManager
from share import errors
from share import constants

from flask import request, make_response

db_manager = DBManager()


def init(app):
    """define all the routes related to faq in this method"""

    @app.route("/findly/crawl", methods=['POST'])
    @app.route("/findly/crawl/<url_id>", methods=['POST'])
    def crawl(url_id=None):
        if 'crawlId' not in request.json:
            print('crawl Id missing in the request payload')
            return make_response(json.dumps(errors.crawl_id_missing), errors.crawl_id_missing.get('statusCode'))

        status = db_manager.put_train_task_in_queue(request.json)
        if status:
            interim_result = {constants.CRAWL_ID_DB_KEY: request.json.get(constants.CRAWL_ID_DB_KEY),
                              "status": constants.STATUS_QUEUED}
            response = make_response(json.dumps(interim_result), 200)
        else:
            interim_result = {constants.CRAWL_ID_DB_KEY: request.json.get(constants.CRAWL_ID_DB_KEY),
                              "status": constants.STATUS_FAILED}
            response = make_response(json.dumps(interim_result), 500)
        response.headers['Content-Type'] = 'application/json'
        return response
