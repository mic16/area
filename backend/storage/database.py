from rejson import Client, Path
from User import User
import secrets
from Area import Area
from AreaManager import AreaManager

areaManager = AreaManager()

class DataBase:

    def __init__(self):
        self.redis = Client(host='redis', port=6379, decode_responses=True)
    
    def load(self):
        if areas := self.redis.jsonget('area_list'):
            for id in areas:
                areaJson = self.redis.jsonget('area.%s' % id)
                user = self.constructUser(areaJson.get('user'))
                if user:
                    area = Area(areaJson, user, areaJson.get('uuid'))
                    if not area.isErrored():
                        areaManager.append(area)
    
    def getRedis(self):
        return (self.redis)

    def userExist(self, mail):
        res = self.redis.jsonget("user.%s"%mail)
        if (res == None):
            return (False)
        else:
            return (True)

    def getUser(self, mail):
        return (self.redis.jsonget("user.%s"%mail))

    def constructUser(self, mail):
        json = self.getUser(mail)
        if json:
            return User(mail, self.redis)
        return None

    def createUser(self, mail, password):
        if (self.userExist(mail)):
            return (False)
        self.redis.jsonset("user.%s"%mail, ".", {"mail": mail, "password" : password})
        return (True)

    def deleteUser(self, mail):
        if (self.userExist(mail)):
            self.redis.jsondel("user.%s"%mail)
            return (True)
        return (False)
    
    def updateUser(self, mail, json):
        user = self.getuser(mail)
        if (user == None):
            return (False)
        else:
            self.redis.jsonset("user.%s"%mail, ".",{**user, **json})
            return (True)
    
    def createArea(self, mail, uuid, json):
        key = '%s.%s' % (mail, uuid)
        json['user'] = mail
        json['uuid'] = uuid
        if self.redis.jsonget("area_list") == None:
            self.redis.jsonset("area_list", ".", [])
        if not self.redis.jsonget("area.%s" % key) is None:
            return False
        self.redis.jsonset("area.%s" % key, ".", json)
        self.redis.jsonarrappend("area_list", ".", key)
        return True
    
    def updateArea(self, mail, uuid, json):
        key = '%s.%s' % (mail, uuid)
        json['user'] = mail
        json['uuid'] = uuid
        area = self.redis.jsonget("area.%s" % key)
        if area:
            self.redis.jsonset("area.%s" % key, ".", {**area, **json})
            return True
        return False
    
    def deleteArea(self, mail, uuid):
        key = '%s.%s' % (mail, uuid)
        if self.redis.jsonget("area.%s" % key):
            self.redis.jsondel("area.%s" % key, ".")
            area = self.redis.jsonget("area.%s" % key)
            if area:
                filtered = [i for i in area if i != key]
                self.redis.jsonset("area_list", ".", area)
            return True
        return False