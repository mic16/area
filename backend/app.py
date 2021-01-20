from flask import Flask
from database import DataBase

app = Flask("AREA")
data = DataBase()