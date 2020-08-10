# Findly
### Prerequisite
- Python3.6
- Pycharm community edition (for development)

### Installation Steps
- Clone the repository <br />
  `git clone https://github.com/Koredotcom/Findly.git`
- Create a virtual environment
- Install the requirements <br />
  `pip install -r requirements.txt`
- Update a config file, if there are any config changes <br />
  `edit share/config/config.json`
- cd search/
- Start server <br />
  `python start_server.py` <br />
  `python crawler/CrawlerJob.py`

### Developer Guidelines
- Reset fields with default values in config which contain authorization details while pushing your code
- Follow PEP-8 convention while writing code
- Code should be merged to developement or production branch only after pull request is approved
- Naming convention for commit is as follows : "[NLP-xxxx]: commit message"
