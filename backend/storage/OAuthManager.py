from app import app
import inspect

services = {}

def addManager(name, loginFunc, callbackFunc, isConnectedFunc):
    assert inspect.isfunction(loginFunc), "Expected loginFunc to be a function"
    assert inspect.isfunction(callbackFunc), "Expected callbackFunc to be a function"
    assert inspect.isfunction(isConnectedFunc), "Expected isConnectedFunc to be a function"

    services[name] = (loginFunc, callbackFunc, isConnectedFunc)

def isConnected(manager, user):
    if oauth := services.get(manager):
        return oauth[2](user)
    return False

@app.route('/oauth/list')
def oauthList():
    return {'result': [*services]}

@app.route('/oauth/links', methods = [ 'POST' ])
def oauthLinks():
    data = {}
    json = request.get_json()
    if json is None:
        return {"error": "Expected json body, got nothing"}
    if token := json.get('token'):
        if mail := tokenManager.getTokenUser(token):
            if user := data.constructUser(mail):
                for serviceName, oauth in services.items():
                    data[serviceName] = oauth[2](user)
                return {'result': data}
    return {'error': 'Invalid Token'}

@app.route('/oauth/login/<string:manager>')
def oauthLogin(manager):
    if oauth := services.get(manager):
        oauth[0]()
        return {'result': True}
    return {"error": "Unkonwn oauth service '%s'" % manager}

@app.route('/oauth/callback/<string:manager>', methods = [ 'POST' ])
def oauthCallback(manager):
    if oauth := services.get(manager):
        oauth[1]()
        return {'result': True}
    return {"error": "Unkonwn oauth service '%s'" % manager}
