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
            newSubscibers = youtubeApi.getLastFollower(area.getUser())
            if (len(newSubscibers) == 0):
                return
            area.ret(newSubscibers)
        return trig.setAction(func)