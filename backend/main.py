from markupsafe import escape
from flask import Flask
import Twitter
import Facebook
import Service

app = Flask("AREA")
Service.setup(app)
