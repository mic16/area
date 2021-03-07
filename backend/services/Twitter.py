from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs

import safeformat
import _
import twitterApi

@Service(oauth='Twitter')
class Twitter():
    def __init__(self):
        pass

    @Action('When I like a tweet')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('with image', FTYPE.BOOLEAN, 'If the post should contain an image')
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

    @Action('When I tweet')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('with image', FTYPE.BOOLEAN, 'If the post should contain an image')
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
    @Field('message', FTYPE.STRING, 'format string of your message (%s will be replaced by the message)')
    def tweet(self, area, fields):
        fmtStr = fields.getString('message', '%s') or '%s'
        txt = safeformat.format(fmtStr, *area.get(str))
        if len(txt) > 280:
            txt = txt[0:279]
        if area.get(Imgs) != None and len(area.get(Imgs)) >= 1:
            twitterApi.newTweetImages(area.getUser(), txt, (area.get(Imgs)[0]).getImages())
        else :
            twitterApi.newTweet(area.getUser(), txt)

    @Reaction(
        'Send a direct message',
        str,
    )
    @Field('userId', FTYPE.STRING, 'screen name of the targeted user')
    @Field('message', FTYPE.STRING, 'format string of your message (%s will be replaced by the message)')
    def directMessage(self, area, fields):
        fmtStr = fields.getString('message', '%s') or '%s'
        twitterApi.sendDirectMessage(area.getUser(), safeformat.format(fmtStr, *area.get(str)), fields.getString('userId'))