import sys

# Add subpath
sys.path.append('./service/')
sys.path.append('./types/')
sys.path.append('./storage/')

# Imports
from markupsafe import escape
from rejson import Client, Path
from app import app, data
from flask import request
import authentification
import time
from Area import Area


# Import Services
sys.path.append('./services/')
import Service
import Twitter

@app.route('/services/')
def listServices():
    return {'result': Service.listServices()}

@app.route('/services/<string:serviceName>/<string:actionName>/compatTable')
def getServiceCompat(serviceName, actionName):
    compatList = Service.listCompatibleReactions(serviceName, actionName)
    if compatList is not None:
        return {'result': compatList}
    return {'error': 'Unkown action %s for service %s' % (actionName, serviceName)}

@app.route('/services/<string:serviceName>')
def serviceInfos(serviceName):
    print(serviceName)
    infos = Service.getServiceInfos(serviceName)
    if infos:
        return {'result': infos}
    return {'error': 'Unkown service %s' % serviceName}

@app.route('/about.json')
def aboutJSON():
    services = []
    for serviceName in Service.listServices():
        serviceInfos = Service.getServiceInfos(serviceName)
        services.append({
            'name': serviceName,
            'actions': serviceInfos['actions'],
            'reactions': serviceInfos['reactions']
        })
    result = {
        'client': {'host': request.remote_addr},
        'server': {
            'current_time': f'%d' % time.time(),
            'services': services
        },
    }
    return result