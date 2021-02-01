from flask import Flask
from database import DataBase

app = Flask("AREA")
app.secret_key = "development key"
data = DataBase()