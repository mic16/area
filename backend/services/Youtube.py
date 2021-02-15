from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger

import youtubeApi

@Service()
class Youtube():
    def __init__(self):
        pass

    @Action('When the connected user have a new subscriber')
    def onSubscribe(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            newSubscibers = youtubeApi.getLastSubscriber(area.getUser())
            if (len(newSubscibers) == 0):
                return
            for subscriber in newSubscibers:
                area.newReaction()
                area.ret(subscriber)
        return trig.setAction(func)

    @Action('When the connected user like a video')
    def onLike(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            newLike = youtubeApi.getLastLikedVideo(area.getUser())
            if (len(newLike) == 0):
                return
            for like in newLike:
                area.newReaction()
                area.ret(like)
        return trig.setAction(func)