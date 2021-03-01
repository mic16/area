import inspect
import string
import math
import time
from Config import Config

services = {}

def Service(oauth=None):
    def decorator(clazz):
        assert inspect.isclass(clazz), 'Service must be applied to a class'
        className = clazz.__name__[0].upper() + clazz.__name__[1:]
        service = {"actions": {}, "reactions": {}, 'instance': clazz(), 'oauth': oauth}
        methods = inspect.getmembers(clazz, predicate=inspect.isfunction)
        for name, method in methods:
            if hasattr(method, '__service__'):
                methodName = name[0].upper() + name[1:]
                info = method.__service__
                if info['type'] == 'action':
                    service['actions'][methodName] = {
                        'method': method,
                        'description': info['description'],
                        'fields': hasattr(method, '__fields__') and method.__fields__ or []
                    }
                else:
                    service['reactions'][methodName] = {
                        'method': method,
                        'inputs': info['inputs'],
                        'description': info['description'],
                        'fields': hasattr(method, '__fields__') and method.__fields__ or []
                    }

        services[className] = service
        return clazz
    return decorator


def serviceExists(serviceName):
    return serviceName in services

def listServices():
    names = []
    for name in services:
        names.append(name)
    return names

def listActions(serviceName):
    service = services.get(serviceName)
    if service:
        return [*service['actions']]
    return []
    
def listReactions(serviceName):
    service = services.get(serviceName)
    if service:
        return [*service['reactions']]
    return []

def getServiceInfos(serviceName, withFields=True):
    service = services.get(serviceName)
    if service:
        result = {'actions': [], 'reactions': []}
        for name, infos in service['actions'].items():
            action = {
                'name': name,
                'description': infos['description'],
            }
            if withFields:
                action['fields'] = infos['fields']
            result['actions'].append(action)
        for name, infos in service['reactions'].items():
            reaction = {
                'name': name,
                'description': infos['description'],
            }
            if withFields:
                reaction['fields'] = infos['fields']
            result['reactions'].append(reaction)
        return result
    return None

def isReactionCompatibleWithAction(reaction, action):
    inputs = reaction['inputs']
    outputs = action.getTypes()

    if not inputs:
        return True

    return inputs in outputs

def getAction(serviceName, actionName):
    service = services.get(serviceName)
    if service:
        action = service['actions'].get(actionName)
        return action, service['instance']
    return None, None

def getReaction(serviceName, reactionName):
    service = services.get(serviceName)
    if service:
        reaction = service['reactions'].get(reactionName)
        return reaction, service['instance']
    return None, None
        
def listCompatibleReactions(serviceName, actionName, config={}):
    actionInfo, serviceInstance = getAction(serviceName, actionName)
    
    if not actionInfo:
        return None

    trigger = actionInfo['method'](serviceInstance, Config(config))

    compatibleReactions = {}

    for serviceName, serviceInfos in services.items():
        reactions = []
        for reactionName, reactionInfo in serviceInfos['reactions'].items():
            if isReactionCompatibleWithAction(reactionInfo, trigger):
                reactions.append({
                    'name': reactionName,
                    'description': reactionInfo['description'],
                    'fields': reactionInfo['fields']
                })
        if len(reactions) > 0:
            compatibleReactions[serviceName] = reactions

    return compatibleReactions
    
def getOAuth(serviceName):
    if service := services.get(serviceName):
        return service.get('oauth')
    return None