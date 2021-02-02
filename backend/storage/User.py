class User:
    def __init__(self, mail, redis):
        self.redis = redis
        self.mail = mail
    
    def getMail(self):
        return self.get('mail')

    def get(self, field):
        return self.redis.jsonget('user.%s'  % self.mail, '.%s' % (field or ''))

    def set(self, field, value):
        self.redis.jsonset('user.%s'  % self.mail, '.%s' % (field or ''), value)