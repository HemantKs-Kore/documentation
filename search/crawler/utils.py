import gzip
import logging
import traceback
from html import unescape
from urllib.parse import urlparse, urlunparse, unquote_plus

debug_logger = logging.getLogger('debug')


def is_valid_url(url: str) -> bool:
    """Parse url to verify url scheme, Accept only http or https urls
    :return: bool
    """
    if not url:
        debug_logger.error('!!! Undefined URL - {}'.format(url))
        return False
    else:
        debug_logger.info('Validating the URL scheme for url- {}'.format(url))
        try:
            uri = urlparse(url)
            _ = urlunparse(uri)
            if not (uri.scheme and uri.scheme.lower() in ['http', 'https']):
                debug_logger.warning('Invalid scheme for URL - {}'.format(url))
                return False
            if not uri.hostname:
                debug_logger.warning('Undefined host for URL - {}'.format(url))
                return False
        except Exception as e:
            debug_logger.error("Cannot parse URL {}: {}".format(url, e))
            return False
        return True


def get_homepage_of_url(url: str) -> str:
    """
    Retrieve homepage of URL if input url is not homepage URL
    :return str: homepage of url
    """
    if not url:
        debug_logger.info('URL is empty, while retrieving homepage URL.')
        raise Exception('Empty URL variable')
    try:
        parsed_uri = urlparse(url)
        uri = (parsed_uri.scheme, parsed_uri.netloc, '/', '', '', '')
        homepage_url = urlunparse(uri)
        return homepage_url.rstrip('/')
    except Exception:
        debug_logger.error('Unable to get homepage of URL {}: {}'.format(url, traceback.format_exc()))
        raise Exception('Invalid URL, unable to get homepage')


def get_hostname(url: str):
    if not url:
        return None
    try:
        parsed_uri = urlparse(url)
        return parsed_uri.hostname
    except Exception as e:
        debug_logger.error('Unable to get hostname of URL {}: {}'.format(url, e))
        return None


def is_gzipped_response(url: str, response) -> bool:
    """
    Return True if Response looks like it's gzipped.
    """
    uri = urlparse(url)
    url_path = unquote_plus(uri.path)
    content_type = response.headers.get('content-type', '') or ''
    if url_path.lower().endswith('.gz') or 'gzip' in content_type.lower():
        return True
    else:
        return False


def un_gzip(data):
    """
    un gzip response content
    :param data:
    :return:
    """
    try:
        data = gzip.decompress(data)
    except Exception as ex:
        debug_logger.error("Unable to gunzip data: {}".format(ex))
        data = None
    return data


def ungzip_response_content(url, response, data):
    if is_gzipped_response(url, response):
        data = un_gzip(data)
    if data:
        data = data.decode('utf-8-sig', errors='replace')
    return data


def html_unescape_strip(string):
    """
    decode html entities in a string
    :return: Stripped string with HTML entities decoded; None if parameter string was empty or None.
    """
    if string:
        unescaped_string = unescape(string)
        unescaped_string = unescaped_string.strip()
        if unescaped_string:
            return unescaped_string
    return None
