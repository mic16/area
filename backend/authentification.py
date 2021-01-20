import hashlib
import secrets
from flask import request
from app import app, data

usersToken = []

@app.route('/login', methods = ["POST"])
def login():
    req_data = request.get_json()
    if (req_data.get("mail") != None and req_data.get("password") != None):
        user = data.getUser(req_data.get("mail"))
        if (user == None):
             return ({"error": "user not exist"})
        if (user["password"] == hashlib.sha256(req_data.get("password").encode()).hexdigest()):
            token = secrets.token_hex(16)
            usersToken.append((req_data.get("mail"), token))
            return ({"token": token})
        else:
            return ({"error": "bad password"})
    else:
        return ({"error": "login need a mail and a password"})

@app.route('/register', methods = ["POST"])
def register():
    req_data = request.get_json()
    if (req_data.get("mail") != None and req_data.get("password") != None):
        if (data.createUser(req_data.get("mail"), hashlib.sha256(req_data.get("password").encode()).hexdigest())):
            token = secrets.token_hex(16)
            usersToken.append((req_data.get("mail"), token))
            return ({"token": token})
        else:
            return ({"error": "user already exist"})
    else:
        return ({"error": "register need a mail and a password"})

@app.route('/logout', methods = ["POST"])
def logout():
    pass