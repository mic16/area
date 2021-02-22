import sys
import builtins
sys.path.append('./tools/')
import logger

# Add subpath
sys.path.append('./service/')
sys.path.append('./types/')
sys.path.append('./storage/')
sys.path.append('./API/')

# Imports
from markupsafe import escape
from rejson import Client, Path
from app import app, data, areaManager
from flask import request
import authentification
import time
from TokenManager import TokenManager
from Area import Area

import twitterApi
import githubApi
import youtubeApi


# Import Services
sys.path.append('./services/')
import Service
import Twitter
import Github

tokenManager = TokenManager()
data.load()

@app.route('/services/')
def listServices():
    return {'result': Service.listServices()}

@app.route('/services/<string:serviceName>/<string:actionName>', methods=['POST'])
def getServiceCompat(serviceName, actionName):
    compatList = Service.listCompatibleReactions(serviceName, actionName, request.json)
    if compatList is not None:
        return {'result': compatList}
    return {'error': 'Unkown action %s for service %s' % (actionName, serviceName)}

@app.route('/services/<string:serviceName>')
def serviceInfos(serviceName):
    infos = Service.getServiceInfos(serviceName)
    if infos:
        return {'result': infos}
    return {'error': 'Unkown service %s' % serviceName}

@app.route('/about.json')
def aboutJSON():
    services = []
    for serviceName in Service.listServices():
        serviceInfos = Service.getServiceInfos(serviceName, False)
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

@app.route('/area/create', methods=['POST'])
def createArea():
    json = request.get_json()
    if json is None:
        return {"error": "Expected json body, got nothing"}
    if token := json.get('token'):
        if mail := tokenManager.getTokenUser(token):
            if user := data.constructUser(mail):
                area = Area(json, user)
                if area.isErrored():
                    return {'error': area.getErrorMessage() or 'Missing or Wrongly formatted data'}
                
                if not data.createArea(mail, area.getUUID(), json):
                    return {'error': 'Area already exists'}
                
                areaManager.append(area)
                return {'result': area.getUUID()}
    return {'error': 'Invalid Token'}

@app.route('/area/delete', methods=['POST'])
def deleteArea():
    json = request.get_json()
    if json is None:
        return {'error': 'Expected json body, got nothing'}
    if token := json.get('token'):
        if mail := tokenManager.getTokenUser(token):
            if user := data.constructUser(mail):
                if uuid := json.get('uuid'):
                    if data.deleteArea(mail, uuid):
                        areaManager.remove(area.getUUID())
                        return {'result': "Area '%s' removed" % uuid}
                    return {'error': "Failed to delete area '%s' " % uuid}
                return {'error': 'Missing UUID'}
    return {'error': 'Invalid Token'}

@app.route('/area/list', methods=['POST'])
def listArea():
    json = request.get_json()
    if json is None:
        return {'error': 'Expected json body, got nothing'}
    if token := json.get('token'):
        if mail := tokenManager.getTokenUser(token):
            areas = data.listArea(mail)
            userAreas = []
            for area in areas:
                userAreas.append({
                    'action': area['action'],
                    'reaction': area['reaction'],
                    'uuid': area['uuid']
                })
            return {'result': userAreas}
    return {'error': 'Invalid Token'}