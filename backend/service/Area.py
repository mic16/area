import uuid

class Area():
    def __init__(self, user, action, reaction, config):
        assert hasattr(action, '__service__'), 'Expected action method to be annotated as an Action'
        assert hasattr(reaction, '__service__'), 'Expected reaction method to be annotated as a Reaction'
        self.user = user
        self.action = action
        self.reaction = reaction
        self.uuid = uuid.uuid4().hex
        self.actionConfig = config.get('action')
        self.reactionConfig = config.get('reaction')

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