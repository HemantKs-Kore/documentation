import time
from http import HTTPStatus

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

SLEEP_BETWEEN_RETRIES = 1  # give one second gap between retries
MAX_RETRIES = 2
TIMEOUT = 10
MAX_RESPONSE_SIZE = 10 * 1024 * 1024


class RequestClient(object):
    def __init__(self, max_response_size=MAX_RESPONSE_SIZE,
                 max_retries=MAX_RETRIES, timeout=TIMEOUT, sleep_limit=SLEEP_BETWEEN_RETRIES):
        self._max_response_size = max_response_size
        self._max_retries = max_retries
        self._timeout = timeout
        self._sleep_between_retries = sleep_limit

    def get(self, url):
        for retry in range(0, self._max_retries):
            response = requests.get(url, timeout=self._timeout)

            if response.status_code in RETRYABLE_HTTP_STATUS_CODES:
                time.sleep(self._sleep_between_retries)
                continue
            else:
                return response

    def get_trimmed_response_data(self, response):
        if self._max_response_size:
            data = response.content[:self._max_response_size]
        else:
            data = response.content
        return data
