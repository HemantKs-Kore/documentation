import abc
import datetime
from decimal import Decimal
from typing import Optional, Iterator

SITEMAP_PAGE_DEFAULT_PRIORITY = Decimal('0.5')


class SitemapData(object):
    # lets try to reduce memory usage for data objects
    __slots__ = [
        '__url',
        '__priority',
        '__last_modified'
    ]

    def __init__(self, url: str, priority: Decimal = SITEMAP_PAGE_DEFAULT_PRIORITY,
                 last_modified: Optional[datetime.datetime] = None):
        self.__url = url
        self.__priority = priority
        self.__last_modified = last_modified

    @property
    def url(self) -> str:
        """
        Return page URL.
        """
        return self.__url

    @property
    def priority(self) -> Decimal:
        """
        Return priority of this URL relative to other URLs on your site.
        """
        return self.__priority

    @property
    def last_modified(self) -> Optional[datetime.datetime]:
        """
        Return date of last modification of the URL.
        """
        return self.__last_modified


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
