from flask import Flask
from database import DataBase
from AreaManager import AreaManager
import os
from CORS import CORS

app = Flask("AREA")
app.secret_key = "development key"
data = DataBase()
areaManager = AreaManager()
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

CORS(app)