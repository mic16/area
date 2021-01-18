import sys
from markupsafe import escape
from flask import Flask


sys.path.append('./services/')
import Twitter
import Facebook
import Service

app = Flask("AREA")
Service.setup(app)
