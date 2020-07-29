import gzip
from urllib.parse import urlparse, urlunparse, unquote_plus



def is_valid_url(url: str) -> bool:
    """Parse url to verify url scheme, Accept only http or https urls
    :return: bool
    """
    if not url:
        print('!!! Undefined URL - {}'.format(url))
        return False
    else:
        print('Validating the URL scheme ...')
        try:
            uri = urlparse(url)
            _ = urlunparse(uri)
            if not (uri.scheme and uri.scheme.lower() in ['http', 'https']):
                print('Invalid scheme for URL - {}'.format(url))
                return False
            if not uri.hostname:
                print('Undefined host for URL - {}'.format(url))
                return False
        except Exception as e:
            print("Cannot parse URL {}: {}".format(url, e))
            return False
        return True


def get_homepage_of_url(url: str) -> str:
    """
    Retrieve homepage of URL if input url is not homepage URL
    :return str: homepage of url
    """
    if not url:
        print('URL is empty, while retrieving homepage URL.')
    try:
        parsed_uri = urlparse(url)
        uri = (parsed_uri.scheme, parsed_uri.netloc, '/', '', '', '')
        homepage_url = urlunparse(uri)
        return homepage_url
    except Exception as e:
        print('Unable to get homepage of URL {}: {}'.format(url, e))
        return ''


def is_gzipped_response(url: str, response) -> bool:
    """
    Return True if Response looks like it's gzipped.
    """
    uri = urlparse(url)
    url_path = unquote_plus(uri.path)
    content_type = response.header('content-type') or ''
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
        print("Unable to gunzip data: {}".format(ex))
        data = None
    return data
