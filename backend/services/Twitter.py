from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs
import twitterApi

@Service(oauth='Twitter')
class Twitter():
    def __init__(self):
        pass

    @Action('When the user likes something')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('With image', FTYPE.BOOLEAN, 'If the post should contain an image')
    def onLike(self, fields):

        trig = Trigger(types=[str])
        if fields.getBool('with image', False) == True:
            trig.addType(Imgs)

        def func(area, fields):
            favs = twitterApi.getLastLike(area.getUser(), area)
            if (favs == None):
                return
            for fav in favs:

                if (fields.getBool('with image', False) == True and not 'media' in fav.get('entities', '')):
                    continue
                if (fields.getString('match', '') != '' and not fields.getString('match', '') in fav.get('text', '')):
                    continue
                
                area.newReaction()
                if fields.getBool('with image', False) == True:
                    area.ret(Imgs([_.get(fav, "entities.media.media_url")]))
                area.ret(fav.get('text'))


        return trig.setAction(func)

    @Action('When the user tweets something')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('wWth image', FTYPE.BOOLEAN, 'If the post should contain an image')
    def onTweet(self, fields):
        trig = Trigger(types=[str])
        if fields.getBool('with image', False) == True:
            trig.addType(Imgs)

        def func(area, fields):
            tweets = twitterApi.getLastTweetUser(area.getUser(), area)
            if (tweets == None):
                return
            for tweet in tweets:

                if (fields.getBool('with image', False) == True and not 'media' in tweet.get('entities', '')):
                    continue
                if (fields.getString('match', '') != '' and not fields.getString('match', '') in tweet.get('text', '')):
                    continue

                area.newReaction()
                if fields.getBool('with image', False) == True:
                    area.ret(Imgs([_.get(tweet, "entities.media.media_url")]))
                area.ret(tweet.get('text'))

        return trig.setAction(func)

    @Reaction(
        'Post a new tweet',
        str,
    )
    def tweet(self, area, fields):
        txt = area.get(str)[0]
        if len(txt) > 280:
            txt = txt[0:279]
        if len(area.get(Imgs)) >= 1:
            twitterApi.newTweetImages(area.getUser(), txt, area.get(Imgs)[0])
        else :
            twitterApi.newTweet(area.getUser(), txt)

    @Reaction(
        'Send a direct message',
        str,
    )
    @Field('userId', FTYPE.STRING, 'UserId of the targeted user')
    def directMessage(self, area, fields):
        twitterApi.sendDirectMessage(area.getUser(), area.get(str)[0], fields.getString('userId'))