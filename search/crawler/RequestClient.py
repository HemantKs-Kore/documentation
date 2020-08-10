import time
from http import HTTPStatus
from crawler import constants
import requests

RETRYABLE_HTTP_STATUS_CODES = {
    HTTPStatus.BAD_REQUEST.value,
    HTTPStatus.REQUEST_TIMEOUT.value,
    HTTPStatus.TOO_MANY_REQUESTS.value,
    HTTPStatus.INTERNAL_SERVER_ERROR.value,
    HTTPStatus.BAD_GATEWAY.value,
    HTTPStatus.SERVICE_UNAVAILABLE.value,
    HTTPStatus.GATEWAY_TIMEOUT.value,
    509,
    598,
    499,
    520,
    521,
    522,
    523,
    524,
    525,
    526,
    527,
    530,
}



class RequestClient(object):
    def __init__(self, max_response_size=constants.MAX_RESPONSE_SIZE,
                 max_retries=constants.MAX_RETRIES, timeout=constants.TIMEOUT, sleep_limit=constants.SLEEP_BETWEEN_RETRIES):
        self._max_response_size = max_response_size
        self._max_retries = max_retries
        self._timeout = timeout
        self._sleep_between_retries = sleep_limit

    def get(self, url, user_agent=''):
        headers_mobile = {'User-Agent': user_agent}
        for retry in range(0, self._max_retries):
            response = requests.get(url, timeout=self._timeout, headers=headers_mobile)

            if response.status_code in RETRYABLE_HTTP_STATUS_CODES:
                time.sleep(self._sleep_between_retries)
                continue
            else:
                return response
        return response

    def get_trimmed_response_data(self, response):
        if self._max_response_size:
            data = response.content[:self._max_response_size]
        else:
            data = response.content
        return data
