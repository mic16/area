from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
import githubApi

@Service()
class Github():
    def __init__(self):
        pass

    @Action('When a user star a selected Repo')
    @Field('url', FTYPE.STRING, 'url of the repository')
    def onStar(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            stars = githubApi.getLastStar(area.getUser(), fields.getString('url'))
            if stars == None:
                return
            for star in stars:
                area.newReaction()
                area.ret(star["user"]["name"])

        return trig.setAction(func)

    @Action('When a user follow the connected user')
    def onFolow(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            followers = githubApi.getNewFollower(area.getUser(), fields.getString('url'))
            if (followers == None):
                return
            for follower in followers:
                area.newReaction()
                area.ret(follower["name"])
        return trig.setAction(func)