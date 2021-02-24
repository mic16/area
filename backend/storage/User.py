import _

class User:
    def __init__(self, mail, redis):
        self.redis = redis
        self.mail = mail

    def getMail(self):
        return self.get('mail')

    def get(self, field):
        return _.get(self.redis.jsonget('user.%s' % self.mail, '.'), field)

    def set(self, field, value):
        obj = self.redis.jsonget('user.%s' % self.mail, '.')
        obj = _.set(obj, field, value) or {}
        self.redis.jsonset('user.%s' % self.mail, '.', obj)
