from rejson import Client, Path
from User import User

class DataBase:

    def __init__(self):
        self.redis = Client(host='redis', port=6379, decode_responses=True)
    
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
            return User(json)
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