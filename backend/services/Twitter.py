from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field
from Trigger import Trigger
import twitterApi

@Service()
class Twitter():
    def __init__(self):
        pass

    @Action('When the user like a tweet')
    @Field('match', 'string', 'String that should be matched')
    @Field('with image', 'bool', 'If the post should contain an image')
    def onLike(self, fields):
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
    @Field('match', 'string', 'String that should be matched')
    @Field('with image', 'bool', 'If the post should contain an image')
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
        str,
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