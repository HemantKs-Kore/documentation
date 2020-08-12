class CrawlerConstants(object):
    STATUS_QUEUED = "queued"
    STATUS_RUNNING = "running"
    STATUS_FAILED = "failed"
    STATUS_SUCCESS = "success"
    STATUS_VALIDATION = "validation"
    CRAWL_ID_DB_KEY = "jobId"
    RESOURCE_TYPE = "webdomain"
    SLEEP_BETWEEN_RETRIES = 1  # give one second gap between retries
    MAX_RETRIES = 2
    TIMEOUT = 10
    MAX_RESPONSE_SIZE = 12 * 1024 * 1024
    URL_VALIDATION_MSG = "Invalid URL received for crawling, check scheme and hostname"
    URL_VALIDATION_ERR_CODE = 450
    UNORTHODOX_SITEMAP_PATHS = {
        'sitemap.xml',
        'sitemap.xml.gz',
        'sitemap_index.xml',
        'sitemap-index.xml',
        'sitemap_index.xml.gz',
        'sitemap-index.xml.gz',
        '.sitemap.xml',
        'sitemap',
        'admin/config/search/xmlsitemap',
        'sitemap/sitemap-index.xml',
    }
