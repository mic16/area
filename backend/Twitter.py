from Service import Service, Action, Reaction

@Service()
class Twitter():
    def __init__(self):
        pass

    @Action('OnTweet', 'When a user tweet something')
    def onTweet(self, request):
        return request.args

    @Reaction('Tweet', 'Tweet something to a user')
    def tweet(self, request):
        return 'Tweet'
