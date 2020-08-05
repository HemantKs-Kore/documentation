import logging
from share.config.ConfigManager import ConfigManager
from concurrent_log_handler import ConcurrentRotatingFileHandler

log_conf = ConfigManager().load_config('log')

LOG_FILE_PATHS = {
    'server': log_conf.get('SERVER_LOG'),
    'debug': log_conf.get('DEBUG_LOG'),
    'default': log_conf.get('DEBUG_LOG')
}

LOG_FORMATTER = {
    "server": "[%(asctime)s] %(message)s",
    "default": "[%(asctime)s] p%(process)s %(levelname)s - %(message)s {%(pathname)s:%(lineno)d}",
}

LOG_LEVELS = {
    "server": log_conf.get('SERVER_LOG_LEVEL'),
    "debug": log_conf.get('DEBUG_LOG_LEVEL'),
    "default": logging.INFO
}


def initiate_logger(file_path, logger_name):
    logger = logging.getLogger(logger_name)
    formatter = logging.Formatter(LOG_FORMATTER.get(logger_name, LOG_FORMATTER.get('default')))
    log_level = LOG_LEVELS.get(logger_name, LOG_LEVELS.get('default'))
    rotating_file_handler = ConcurrentRotatingFileHandler(file_path, 'a', 1024 * 1024 * 20, 10)
    rotating_file_handler.setFormatter(formatter)
    logger.setLevel(log_level)
    logger.addHandler(rotating_file_handler)
    logger.propagate = False


def setup_logger(logger_list):
    for logger_name in logger_list:
        initiate_logger(LOG_FILE_PATHS.get(logger_name, LOG_FILE_PATHS.get('default')), logger_name)
        log_handle = logging.getLogger(logger_name)
        log_handle.info('{} logger initialized'.format(logger_name))


if __name__ == '__main__':
    setup_logger(['server'])
    pass
