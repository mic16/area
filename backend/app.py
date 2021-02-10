from flask import Flask
from database import DataBase
from AreaManager import AreaManager
import os

app = Flask("AREA")
app.secret_key = "development key"
data = DataBase()
areaManager = AreaManager()
areaManager.start()
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
