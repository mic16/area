from flask import Flask
from database import DataBase
from AreaManager import AreaManager

app = Flask("AREA")
app.secret_key = "development key"
data = DataBase()
areaManager = AreaManager()
areaManager.start()