from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs

import youtubeApi

@Service()
class Youtube():
    def __init__(self):
        pass

    @Action('When the connected user have a new subscriber')
    def onSubscribe(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            newSubscibers = youtubeApi.getLastSubscriber(area.getUser())
            if (newSubscibers == None):
                return
            for subscriber in newSubscibers:
                area.newReaction()
                area.ret(subscriber['subscriberSnippet']['title'])
                area.ret(subscriber['subscriberSnippet']['description'])
                area.ret(Imgs([subscriber['subscriberSnippet']['thumbnails']['high']['url']]))
        return trig.setAction(func)

    @Action('When the connected user like a video')
    def onLike(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            newLike = youtubeApi.getLastLikedVideo(area.getUser())
            if (newLike == None):
                return
            for like in newLike:
                area.newReaction()
                area.ret(like['snippet']['title'])
                area.ret(like['snippet']['title']['description'])
                area.ret(Imgs([like['snippet']['standard']['url']]))
        return trig.setAction(func)

    @Reaction(
        'Send a comment on a vidéo',
        str,
    )
    @Field('videoId', 'string', 'videoId of the youtube video')
    def direct_message(self, area, fields):
        youtubeApi.sendNewComment(area.getUser(), fields.get(str)['userId'], area.get(str)[0])