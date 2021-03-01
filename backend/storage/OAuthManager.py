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

def listServices():
    return [*services]

def userLinks(user):
    data = {}
    for serviceName, oauth in services.items():
        data[serviceName] = oauth[2](user)
    return data

def getManager(manager):
    return services.get(manager)