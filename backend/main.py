import sys
import builtins
sys.path.append('./tools/')
import logger

# Add subpath
sys.path.append('./service/')
sys.path.append('./types/')
sys.path.append('./storage/')
sys.path.append('./API/')
sys.path.append('./models/')

# Imports
from markupsafe import escape
from rejson import Client, Path
from app import app, data, areaManager
from flask import request
import authentification
import time
from TokenManager import TokenManager
from Area import Area
from didyoumean import DidYouMean
import OAuthManager

import twitterApi
import githubApi
import youtubeApi
import gmailApi
import googleConnect
import imgurApi


# Import Services
sys.path.append('./services/')
import Service
import Twitter
import Github
import Youtube
import Gmail
import Imgur

import events

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
    if not Service.serviceExists(serviceName):
        if potentialServiceName := DidYouMean(serviceName, Service.listServices()):
            return {"error": "Service '%s' doesn't exists, did you mean '%s' ?" % (serviceName, potentialServiceName)}
        return {"error": "Service '%s' doesn't exists" % (serviceName)}
    if potentialActionName := DidYouMean(actionName, Service.listActions(serviceName)):
        return {"error": "Action '%s' from service '%s' doesn't exists, did you mean '%s' ?" %  (actionName, serviceName, potentialActionName)}
    return {"error": "Action '%s' from service '%s' doesn't exists" % (actionName, serviceName)}

@app.route('/services/<string:serviceName>')
def serviceInfos(serviceName):
    infos = Service.getServiceInfos(serviceName)
    if infos:
        return {'result': infos}
    
    if potentialServiceName := DidYouMean(serviceName, Service.listServices()):
        return {"error": "Service '%s' doesn't exists, did you mean '%s' ?" % (serviceName, potentialServiceName)}
    return {"error": "Service '%s' doesn't exists" % (serviceName)}

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
                        areaManager.remove(uuid)
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

@app.route('/oauth/list')
def oauthList():
    return {'result': OAuthManager.listServices()}

@app.route('/oauth/links', methods = [ 'POST' ])
def oauthLinks():
    json = request.get_json()
    if json is None:
        return {"error": "Expected json body, got nothing"}
    if token := json.get('token'):
        if mail := tokenManager.getTokenUser(token):
            if user := data.constructUser(mail):
                return {'result': OAuthManager.userLinks(user)}
    return {'error': 'Invalid Token'}

@app.route('/oauth/login/<string:manager>', methods = [ 'POST' ])
def oauthLogin(manager):
    if oauth := OAuthManager.getManager(manager):
        return {"result": oauth[0]()}
    return {"error": "Unknown oauth service '%s'" % manager}

@app.route('/oauth/callback/<string:manager>', methods = [ 'POST' ])
def oauthCallback(manager):
    if oauth := OAuthManager.getManager(manager):
        return oauth[1]()
    return {"error": "Unknown oauth service '%s'" % manager}


print('started')