import uuid
import Service

class Area():
    def __init__(self, json):
        self.errored = False
        self.uuid = uuid.uuid4().hex

        actionJson = json.get('action')
        reactionJson = json.get('reaction')

        # if not actionJson or not actionJson is dict
        # or not reactionJson or not reactionJson is dict:
        #     self.errored = True
        #     return


        
        
        


    def isErrored(self):
        return self.errored

    def getUUID(self):
        return self.uuid        

    def getUser(self):
        return self.user

    def trigger(self):
        out = (self.action(self.service, self, self.actionConfig))
        if out is not None and len(out) > 0:
            inputs = self.reaction.__service__['inputs']
            paramsOrdered = []
            if len(inputs) > 0:
                params = {}
                for var in out:
                    typeName = type(var).__name__
                    paramType = params.get(typeName,  [])
                    paramType.append(var)
                    params[typeName] = paramType

                if not params.get(inputs[0].__name__):
                    return

                for vartype in inputs:
                    var = params.get(vartype.__name__)
                    if var:
                        paramsOrdered.append(var)
                
            self.reaction(self, self.service, self.reactionConfig, *paramsOrdered)