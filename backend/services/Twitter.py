from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
import twitterApi

@Service()
class Twitter():
    def __init__(self):
        pass

    @Action('When a user tweet something')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('with image', FTYPE.BOOLEAN, 'If the post should contain an image')
    def onTweet(self, fields):

        trig = Trigger(types=[str])
        if fields.getBool('with image') == True:
            trig.addType(int)

        def func(area, fields):
            fav = twitterApi.getLastLike(area.getUser())
            if (fav == None):
                return
            if fields.getBool('with image') == True:
                if 'media' in fav.entities:
                    for image in fav.entities['media']:
                        area.ret(image)
            area.ret(fav.text)

        return trig.setAction(func)

    @Action('When a new element appear in the user Timeline')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('with image', FTYPE.BOOLEAN, 'If the post should contain an image')
    def onTweetTimeline(self, fields):
        trig = Trigger(types=[str])
        if fields.getBool('with image') == True:
            trig.addType(int)

        def func(area, fields):
            fav = twitterApi.getLastTweetTimeline(area.getUser())
            if (fav == None):
                return
            if fields.getBool('with image') == True:
                if 'media' in fav.entities:
                    for image in fav.entities['media']:
                        area.ret(image)
            area.ret(fav.text)

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
    def direct_message(self, area, fields):
        twitterApi.sendDirectMessage(area.getUser(), area.get(str)[0], fields.get(str)['userId'])