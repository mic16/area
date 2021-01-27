import sys
from markupsafe import escape
from rejson import Client, Path
from app import app, data
import Service
import authentification
import twitterApi

sys.path.append('./services/')
import Twitter
import Facebook

Service.setup(app, data.getRedis())