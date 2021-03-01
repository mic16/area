from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs
import twitterApi

@Service()
class Twitter(oauth='Twitter'):
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

                if (fields.getBool('with image') == True and not 'media' in fav["entities"]):
                    continue
                if (fields.getString('match') != '' and not fields.getString('match') in fav.text):
                    continue
                
                area.newReaction()
                if fields.getBool('with image') == True:
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

                if (fields.getBool('with image') == True and not 'media' in tweet["entities"]):
                    continue
                if (fields.getString('match') != '' and not fields.getString('match') in tweet.text):
                    continue

                area.newReaction()
                if fields.getBool('with image') == True:
                    area.ret(Imgs([tweet["entities"]['media']['media_url']]))
                area.ret(tweet.text)

        return trig.setAction(func)      

    @Reaction(
        'Post a new tweet',
        str,
    )
    def tweet(self, area, fields):
        txt = area.get(str)[0]
        if len(txt) > 280:
            txt = txt[0:279]
        twitterApi.newTweet(area.getUser(), txt)

    @Reaction(
        'Send a direct message',
        str,
    )
    @Field('userId', 'string', 'userId of the target user')
    def directMessage(self, area, fields):
        twitterApi.sendDirectMessage(area.getUser(), area.get(str)[0], fields.get(str)['userId'])