from markupsafe import escape
from flask import Flask
import sqlite3
import Twitter
import Facebook
import Service

DATABASE = 'dataBase/data.db'

def get_db():
    db = getattr(Flask, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(Flask, '_database', None)
    if db is not None:
        db.close()

app = Flask("AREA")
Service.setup(app)
