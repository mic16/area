from singleton import singleton
import secrets

@singleton()
class TokenManager():
    def __init__(self):
        self.tokens = {}
        self.users = {}

    def generateNewToken(self, mail):
        token = secrets.token_hex(16)
        oldToken = self.users.get(mail)
        if oldToken:
            self.tokens.pop(oldToken)
        self.tokens[token] = mail
        self.users[mail] = token
        return token

    def deleteUserToken(self, mail):
        token = self.users.get(mail)
        if token:
            self.tokens.pop(token)
            self.users.pop(mail)
            return True
        return False
    
    def deleteTokenUser(self, token):
        mail = self.tokens.get(token)
        if mail:
            self.users.pop(mail)
            self.tokens.pop(token)
            return True
        return False

    def getUserToken(self, mail):
        return self.users.get(mail)
    
    def getTokenUser(self, token):
        return self.tokens.get(token)