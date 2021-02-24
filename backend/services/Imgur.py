from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
import Imgs
import imgurApi

@Service()
class Imgur():
    def __init__(self):
        pass

    @Action('When the user post something')
    def onPost(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            imgs = imgurApi.getLastPost(area.getUser())
            if (imgs == None):
                return
            for img in imgs:
                area.newReaction()
                area.ret(img['album']['title'])
                area.ret(img['album']['description'])
                area.ret(Imgs(img['imgs']))

        return trig.setAction(func)

    @Action('When the user fav a post')
    def onFav(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            imgs = imgurApi.getLastFav(area.getUser())
            if (imgs == None):
                return
            for img in imgs:
                area.newReaction()
                area.ret(img['album']['title'])
                area.ret(img['album']['description'])
                area.ret(img['imgs'])

        return trig.setAction(func)

    @Reaction(
        'make a post',
        Imgs,
    )
    def createPost(self, area, fields):
        title = ''
        description = ''
        if area.get(str)[0] != None:
            title = area.get(str)[0]
        if area.get(str)[1] != None:
            description = area.get(str)[1]
        imgurApi.createPost(area.getUser(), area.get(Imgs)[0].getImages(), title, description)