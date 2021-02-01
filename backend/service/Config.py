import _
class Config():
    def __init__(self, conf):
        self.conf = conf
    
    def getString(self, path, default=None):
        value = _.get(self.conf, path, default)
        if type(value) is str:
            return value
        return default

    def getBool(self, path, default=False):
        value = _.get(self.conf, path, default)
        if type(value) is bool:
            return value
        return default

    def getInt(self, path, default=0):
        value = _.get(self.conf, path, default)
        if type(value) is int:
            return value
        return default

    def getFloat(self, path, default=0):
        value = _.get(self.conf, path, default)
        if type(value) is float:
            return value
        return default

    def getArray(self, path, default=[]):
        value = _.get(self.conf, path, default)
        if type(value) is list:
            return value
        return default

    def get(self, path, default=None):
        return _.get(self.conf, path, default)
