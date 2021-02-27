import hashlib
from flask import request
from app import app, data
from TokenManager import TokenManager

@app.route('/login', methods = ["POST"])
def login():
    req_data = request.get_json()
    if req_data is None:
        return {"error": "Expected json body, got nothing"}
    if (req_data.get("mail") != None and req_data.get("password") != None):
        user = data.getUser(req_data.get("mail"))
        if (user == None):
             return {"error": "Invalid Mail or Password"}
        if (user["password"] == hashlib.sha256(req_data.get("password").encode()).hexdigest()):
            tokenManager = TokenManager()
            token = tokenManager.generateNewToken(req_data.get("mail"))
            print('User %s logged in' % req_data.get("mail"))
            return {"result": token}
        else:
            return {"error": "bad password"}
    else:
        return {"error": "login need a mail and a password"}

@app.route('/register', methods = ["POST"])
def register():
    req_data = request.get_json()
    if req_data is None:
        return {"error": "Expected json body, got nothing"}
    if (req_data.get("mail") != None and req_data.get("password") != None):
        if (data.createUser(req_data.get("mail"), hashlib.sha256(req_data.get("password").encode()).hexdigest())):
            tokenManager = TokenManager()
            token = tokenManager.generateNewToken(req_data.get("mail"))
            print('User %s registered' % req_data.get("mail"))
            return {"result": token}
        else:
            return {"error": "user already exist"}
    else:
        return {"error": "register need a mail and a password"}

@app.route('/logout', methods = ["POST"])
def logout():
    req_data = request.get_json()
    if req_data is None:
        return {"error": "Expected json body, got nothing"}
    if (req_data.get("token") != None):
        tokenManager = TokenManager()
        if (tokenManager.deleteTokenUser(req_data.get("token"))):
            print('User %s logged out' % req_data.get("mail"))
            return {"result": "you are disconnected"}
        return {"error": "you are not connected"}
    return {"error": "logout need a token"}
