import sys
from markupsafe import escape
from flask import Flask
from rejson import Client, Path
import Service

redis = Client(host='redis', port=6379, decode_responses=True)

sys.path.append('./services/')
import Twitter
import Facebook

app = Flask("AREA")

@app.route('/')
def index():
    return 'Index'

Service.setup(app, redis)