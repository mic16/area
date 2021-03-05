from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs

import _
import youtubeApi

@Service(oauth='Google')
class Youtube():
    def __init__(self):
        pass

    @Action('When the connected user gets a new subscriber')
    def onSubscribe(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            newSubscibers = youtubeApi.getLastSubscriber(area.getUser(), area)
            if (newSubscibers == None):
                return
            for subscriber in newSubscibers:
                area.newReaction()
                area.ret(_.get(subscriber, 'title'))
                area.ret(_.get(subscriber, 'description'))
                area.ret(Imgs([_.get(subscriber, 'url')]))
        return trig.setAction(func)

    @Action('When the connected user likes a video')
    def onLike(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            newLike = youtubeApi.getLastLikedVideo(area.getUser(), area)
            if (newLike == None):
                return
            for like in newLike:
                area.newReaction()
                area.ret(_.get(like, 'title'))
                area.ret(_.get(like, 'description'))
                area.ret(Imgs([_.get(like, 'url')]))
        return trig.setAction(func)

    @Reaction(
        'Send a comment on a video',
        str,
    )
    @Field('videoId', FTYPE.STRING, 'VideoId of the youtube video')
    def sendCommentOnVideo(self, area, fields):
        youtubeApi.sendNewComment(area.getUser(), fields.getString('videoId'), area.get(str)[0])