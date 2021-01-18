import inspect
from flask import request, abort, redirect, url_for
services = {}
redisClient = None

def Service():
    def decorator(clazz):
        assert inspect.isclass(clazz), 'Service must be applied to a class'
        service = services.get(clazz.__name__) or {"actions": {}, "reactions": []}
        service['instance'] = clazz()
        services[clazz.__name__] = service
        return clazz
    return decorator

def Action(name, desc):
    def decorator(func):
        assert inspect.isfunction(func), 'Action should be applied to a method'
        clazzname, methodname = func.__qualname__.split('.')
        service = services.get(clazzname) or {"actions": {}, "reactions": {}}
        service['actions'][name] = {"name": name,  "desc": desc, "method":func}
        services[clazzname] = service
        return func
    return decorator

def Reaction(name, desc):
    def decorator(func):
        assert inspect.isfunction(func), 'Action should be applied to a method'
        clazzname, methodname = func.__qualname__.split('.')
        service = services.get(clazzname) or {"actions": {}, "reactions": {}}
        service['reactions'][name] = {"name": name,  "desc": desc, "method":func}
        services[clazzname] = service
        return func
    return decorator

def servicePage(serviceName, action, page):
    service = services.get(serviceName)
    if service == None:
        abort(404)
    if action == "Action":
        route = service['actions'].get(page)
        if route == None:
            abort(404)
        return route['method'](service['instance'], request)
    elif action == "Reaction":
        route = service['reactions'].get(page)
        if route == None:
            abort(404)
        return route['method'](service['instance'], request)
    else:
        abort(404)

def setup(app, redis):
    for serviceName, service in services.items():
        service['instance'].redis = redis
    app.route("/<serviceName>/<action>/<path:page>")(servicePage)
        