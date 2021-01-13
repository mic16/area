from Service import Service, Action, Reaction

@Service()
class Facebook():
    def __init__(self):
        pass

    @Action('OnPost', 'When a user post something')
    def onTweet(self, request):
        return request.args

    @Action('Yeah', 'When a user post something')
    def onTweet3(self, request):
        return 'Yeah'

    @Reaction('CreatePost', 'Create a new post from the user')
    def tweet(self, request):
        return 'CreatePost'
