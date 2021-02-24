from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs
import twitterApi

@Service()
class Twitter():
    def __init__(self):
        pass

    @Action('When the user like something')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('with image', FTYPE.BOOLEAN, 'If the post should contain an image')
    def onLike(self, fields):

        trig = Trigger(types=[str])
        if fields.getBool('with image') == True:
            trig.addType(Imgs)

        def func(area, fields):
            favs = twitterApi.getLastLike(area.getUser())
            if (favs == None):
                return
            for fav in favs:
                area.newReaction()
                if fields.getBool('with image') == True:
                    if 'media' in fav["entities"]:
                        area.ret(Imgs([fav["entities"]['media']['media_url']]))
                area.ret(fav.text)

        return trig.setAction(func)

    @Action('When the user tweet something')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('with image', FTYPE.BOOLEAN, 'If the post should contain an image')
    def onTweet(self, fields):
        trig = Trigger(types=[str])
        if fields.getBool('with image') == True:
            trig.addType(Imgs)

        def func(area, fields):
            tweets = twitterApi.getLastTweetUser(area.getUser())
            if (tweets == None):
                return
            for tweet in tweets:
                area.newReaction()
                if fields.getBool('with image') == True:
                    if 'media' in tweet["entities"]:
                        area.ret(Imgs([tweet["entities"]['media']['media_url']]))
                area.ret(tweet['text'])

        return trig.setAction(func)      

    @Reaction(
        'Post a new tweet',
        int,
    )
    def tweet(self, area, fields):
        twitterApi.newTweet(area.getUser(), area.get(str)[0])

    @Reaction(
        'Send a direct message',
        str,
    )
    @Field('userId', 'string', 'userId of the target user')
    def directMessage(self, area, fields):
        twitterApi.sendDirectMessage(area.getUser(), area.get(str)[0], fields.get(str)['userId'])