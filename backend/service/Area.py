import uuid
import Service
import _
from Config import Config
from TokenManager import TokenManager
import time
from User import User
from didyoumean import DidYouMean

tokenManager = TokenManager()

class Area():
    def __init__(self, json, user, fuuid=None):
        self.errored = False
        self.errormessage = None
        self.uuid = fuuid or uuid.uuid4().hex
        self.returns = {}
        self.lastTrigger = 0

        self.user = user

        if not type(json) is dict:
            return self.error("Expected json, got '%s'" % json)
        
        if not type(user) is User:
            return self.error('Missing user')

        actionJson = json.get('action')
        reactionJson = json.get('reaction')

        if not type(actionJson) is dict:            
            return self.error("Wrongly formatted Action, expected JSON, got '%s'" % actionJson)
            
        if not type(reactionJson) is dict:
            return self.error("Wrongly formatted Reaction, expected JSON, got '%s'" % reactionJson)

        actionService = actionJson.get('service')
        actionName = actionJson.get('name')
        self.actionConfig = actionJson.get('config', {})

        reactionService = reactionJson.get('service')
        reactionName = reactionJson.get('name')
        self.reactionConfig = reactionJson.get('config', {})

        if not type(actionService) is str:
            return self.error("Expected action service to be a string, got '%s'" % actionService)

        if not type(actionName) is str:
            return self.error("Expected action name to be a string, got '%s'" % actionName)

        if not type(self.actionConfig) is dict:
            return self.error("Expected action config to be a JSON, got '%s'" % self.actionConfig)
            
        if not type(reactionService) is str:
            return self.error("Expected reaction service to be a string, got '%s'" % reactionService)

        if not type(reactionName) is str:
            return self.error("Expected reaction name to be a string, got '%s'" % reactionName)

        if not type(self.reactionConfig) is dict:
            return self.error("Expected reaction config to be a JSON, got '%s'" % self.reactionConfig)

        actionInfos, self.actionInstance = Service.getAction(actionService, actionName)
        reactionInfos, self.reactionInstance = Service.getReaction(reactionService, reactionName)

        if not actionInfos:
            if not Service.serviceExists(actionService):
                if potentialServiceName := DidYouMean(actionService, Service.listServices()):
                    return self.error("Service '%s' doesn't exists, did you mean '%s' ?" % (actionService, potentialServiceName))
                return self.error("Service '%s' doesn't exists" % (actionService))
            if potentialActionName := DidYouMean(actionName, Service.listActions(actionService)):
                return self.error("Action '%s' from service '%s' doesn't exists, did you mean '%s' ?" %  (actionName, actionService, potentialActionName))
            return self.error("Action '%s' from service '%s' doesn't exists" % (actionName, actionService))
            
        if not reactionInfos:
            if not Service.serviceExists(actionService):
                if potentialServiceName := DidYouMean(reactionService, Service.listServices()):
                    return self.error("Service '%s' doesn't exists, did you mean '%s' ?" % (reactionService, potentialServiceName))
                return self.error("Service '%s' doesn't exists" % (reactionService))
            if potentialReactionName := DidYouMean(reactionName, Service.listActions(reactionService)):
                return self.error("Action '%s' from service '%s' doesn't exists, did you mean '%s' ?" %  (reactionName, reactionService, potentialReactionName))
            return self.error("Action '%s' from service '%s' doesn't exists" % (reactionName, reactionService))

        self.actionConfig = Config(self.actionConfig)
        self.reactionConfig = Config(self.reactionConfig)

        self.action = actionInfos['method'](self.actionInstance, self.actionConfig)
        self.reaction = reactionInfos['method']

        if not Service.isReactionCompatibleWithAction(reactionInfos, self.action):
            return self.error('Action %s.%s and Reaction %s.%s are incompatible with their configuration' % (actionService, actionName, reactionService, reactionName))
        
    def error(self, message=None):
        self.errored = True
        self.errormessage = message
    
    def getErrorMessage(self):
        return self.errormessage
        

    def get(self, type):
        return self.returns.get(type)
    
    def ret(self, *values):
        for value in values:
            ttype = type(value)
            array = self.returns.get(ttype) or []
            array.append(value)
            self.returns[ttype] = array

    def isErrored(self):
        return self.errored

    def getUUID(self):
        return self.uuid        

    def getUser(self):
        return self.user

    def trigger(self):
        if (time.time() - self.lastTrigger)>= 60:
            self.returns = {}
            actionEx = self.action.getAction()
            actionEx(self, self.actionConfig)
            inputs = self.reaction.__service__['inputs']
            if not inputs or inputs in self.returns:
                self.reaction(self.reactionInstance, self, self.reactionConfig)
            self.lastTrigger = time.time()