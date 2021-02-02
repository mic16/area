from flask import Flask
from database import DataBase
import os

app = Flask("AREA")
app.secret_key = "development key"
data = DataBase()
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'