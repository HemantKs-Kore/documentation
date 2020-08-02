import abc
from decimal import Decimal

SITEMAP_PAGE_DEFAULT_PRIORITY = Decimal('0.5')


class SitemapData(object):
    # lets try to reduce memory usage for data objects
    __slots__ = [
        '_sitemap_url',
        '_pages_in_sitemap',
    ]

    def __init__(self, sitemap_url, pages_in_sitemap):
        self._sitemap_url = sitemap_url
        self._pages_in_sitemap = pages_in_sitemap

    @property
    def sitemap_url(self):
        return self._sitemap_url

    @property
    def pages_in_sitemaps(self):
        return self._pages_in_sitemap

    def sitemap_pages(self):
        for page in self._pages_in_sitemap:
            yield page


class AbstractSitemapParser(object, metaclass=abc.ABCMeta):
    def __init__(self, url: str, recursion_depth):
        self._url = url
        self._recursion_depth = recursion_depth

    @property
    def url(self) -> str:
        return self._url
    #
    # @abc.abstractmethod
    # def pages(self) -> Iterator[SitemapData]:
    #     pass
