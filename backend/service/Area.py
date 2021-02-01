import uuid
import Service
from app import data
import _
from Config import Config

class Area():
    def __init__(self, json):
        self.errored = False
        self.uuid = uuid.uuid4().hex
        self.returns = {}

        token = json.get('token')

        if not type(token) is str:
            self.errored = True
            return

        self.user = data.getTokenUser(token)

        if not self.user:
            self.errored = True
            return

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

        if not type(actionService) is str or not type(actionName) is str or not type(actionConfig) is dict:
            self.errored = True
            return

        if not type(reactionService) is str or not type(reactionName) is str or not type(reactionConfig) is dict:
            self.errored = True
            return

        actionfunc, self.actionInstance = Service.getAction(actionService, actionName)
        reactionfunc, self.reactionInstance = Service.getReaction(reactionService, reactionName)

        if not actionfunc or not reactionfunc:
            self.errored = True
            return

        self.action = actionfunc(actionInstance, actionConfig)
        self.reaction = reactionfunc
        self.actionConfig = Config(self.actionConfig)
        self.reactionConfig = Config(self.reactionConfig)
        
        
        

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
        self.returns = []
        actionEx = self.action.getAction()
        actionEx(self.actionInstance, self, self.actionConfig)
        inputs = self.reaction.__service__['inputs']
        if not inputs or inputs in self.returns:
            self.reaction(self.reactionInstance, self, self.reactionConfig)
                