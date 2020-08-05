""" FaqServer serves knowledge graph content"""

import importlib
import logging
import os

from flask import Flask
from share.config.ConfigManager import ConfigManager
from share.log.log_config import setup_logger
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.wsgi import WSGIContainer

loggers = ["server", "debug"]


def init_routes(app):
    """this method loads all the routes defined in routes folder."""
    files = os.listdir("./share/routes")
    for item in files:
        if item.endswith(".py"):
            name, ext = item.split('.')
            if ext == "py":
                print(os.getcwd())
                spec = importlib.util.spec_from_file_location(name, './share/routes/' + item)
                route = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(route)
                route.init(app)


if __name__ == "__main__":
    setup_logger(loggers)
    config_manager = ConfigManager()
    debug_logger = logging.getLogger('debug')

    app = Flask(__name__)
    init_routes(app)

    server_conf = config_manager.load_config(key='server')
    ssl_conf = config_manager.load_config(key='ssl')
    debug_logger.info("Logging is set up.")
    print("==" * 15, "SearchAssistant Server Started", "==" * 15)

    if ssl_conf.get('FAQ_SSL', False):
        http_server = HTTPServer(WSGIContainer(app), ssl_options={
            "certfile": ssl_conf.get('FAQ_SSL_CERT'),
            "keyfile": ssl_conf.get('FAQ_SSL_KEY')
        })
    else:
        http_server = HTTPServer(WSGIContainer(app))

    http_server.bind(server_conf.get('PORT'))
    http_server.start(server_conf.get("FORKS"))
    IOLoop.current().start()
