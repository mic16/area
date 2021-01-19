from markupsafe import escape
from flask import Flask, request
import sqlite3
import Twitter
import Facebook
import Service

app = Flask("AREA")


database_connection = sqlite3.connect("dataBase/data.db", check_same_thread=False)
database = database_connection.cursor()

def init_database():
    database.execute("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT)")

init_database()
Service.setup(app)


token = []

class User:
    def __init__(self, user_tuple):
        self.id = user_tuple[0]
        self.Username = user_tuple[1]
        self.Password = user_tuple[2]


def get_user(name):
    database.execute("SELECT * FROM Users WHERE Username = ?", (name,))
    user = database.fetchone()
    if (user != None):
        return (User(user))
    else:
        return (None)

def create_user():
    database.execute("INSERT INTO Users(Username, Password) VALUES (?, ?)", ()) #TODO

@app.route("/login", methods=['POST'])
def login():
    user = get_user(request.form['username'])
    if (user == None) :
        return ({"status": False, "message": "user not exist"})
    elif (user.Password == request.form['password']):
        return ({"status": True, "message": "user connected"})
    else :
        return ({"status": False, "message": "bad password"})

@app.route("/register", methods=['POST'])
def register():
    user = get_user(get_user(request.form['username']))
    if (user != None):
        return ({"status": False, "message": "user already exist"})
    else:


    pass

@app.route("/logout", methods=['POST'])
def logout():
    pass