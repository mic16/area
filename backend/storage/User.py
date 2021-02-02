class User:
    def __init__(self, json):
        self.mail = json.get('mail')
    
    def getMail(self, name):
        return self.mail

    def getTwitterInfo(self):
        return self.twitter