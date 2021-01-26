from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field

@Service()
class Twitter():
    def __init__(self):
        pass

    @Action(
        'When a user tweet something',
        [str],
    )
    @Field('match', 'string', 'String that should be matched')
    def onTweet(self, area, fields):
        pass

    @Reaction(
        'Post a new tweet',
        [str],
    )
    def tweet(self, area, fields, texts):
        print(' '.join(texts))
