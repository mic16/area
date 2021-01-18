import sys
from markupsafe import escape
from flask import Flask
from rejson import Client, Path

redis = Client(host='localhost', port=6379, decode_responses=True)

sys.path.append('./services/')
import Twitter
import Facebook
import Service

app = Flask("AREA")

@app.route('/')
def index():
    return 'Index'

Service.setup(app, redis)