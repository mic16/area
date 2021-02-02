import uuid
import Service
import _
from Config import Config
from TokenManager import TokenManager
import time

tokenManager = TokenManager()

class Area():
    def __init__(self, json, user, fuuid=None):
        self.errored = False
        self.uuid = fuuid or uuid.uuid4().hex
        self.returns = {}
        self.lastTrigger = 0

        self.user = user

        actionJson = json.get('action')
        reactionJson = json.get('reaction')

        if not type(actionJson) is dict or not type(reactionJson) is dict:
            self.errored = True
            return

        actionService = actionJson.get('service')
        actionName = actionJson.get('name')
        self.actionConfig = actionJson.get('config', {})

        reactionService = reactionJson.get('service')
        reactionName = reactionJson.get('name')
        self.reactionConfig = reactionJson.get('config', {})

        if not type(actionService) is str or not type(actionName) is str or not type(self.actionConfig) is dict:
            self.errored = True
            return

        if not type(reactionService) is str or not type(reactionName) is str or not type(self.reactionConfig) is dict:
            self.errored = True
            return

        actionInfos, self.actionInstance = Service.getAction(actionService, actionName)
        reactionInfos, self.reactionInstance = Service.getReaction(reactionService, reactionName)

        if not actionInfos or not reactionInfos:
            self.errored = True
            return
        

        self.actionConfig = Config(self.actionConfig)
        self.reactionConfig = Config(self.reactionConfig)

        self.action = actionInfos['method'](self.actionInstance, self.actionConfig)
        self.reaction = reactionInfos['method']
        
        
        

    def get(self, type):
        return self.returns.get(type)
    
    def ret(self, value):
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