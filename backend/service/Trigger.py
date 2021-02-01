class Trigger():
    def __init__(self, func=None, types=[]):
        self.types = types.copy()
        self.action = func
    
    def addType(self, type):
        self.types.append(type)
        return self
    
    def getTypes(self):
        return self.types
    
    def setAction(self, func):
        self.action = func
        return self

    def getAction(self):
        return self.action    