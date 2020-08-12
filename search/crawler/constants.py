class CrawlerConstants(object):
    STATUS_QUEUED = "queued"
    STATUS_RUNNING = "running"
    STATUS_FAILED = "failed"
    STATUS_SUCCESS = "success"
    CRAWL_ID_DB_KEY = "crawlId"
    RESOURCE_TYPE = "domain"
    SLEEP_BETWEEN_RETRIES = 1  # give one second gap between retries
    MAX_RETRIES = 2
    TIMEOUT = 10
    MAX_RESPONSE_SIZE = 12 * 1024 * 1024
