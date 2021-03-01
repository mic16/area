from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs
import githubApi

@Service(oauth='Github')
class Github():
    def __init__(self):
        pass

    @Action('When the connected user star a Repo')
    @Field('match', FTYPE.STRING, 'String that should be matched in name or description of the repo')
    def onStar(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            stars = githubApi.getLastStar(area.getUser(), fields.getString('url'))
            if stars == None:
                return
            for star in stars:

                if (fields.getString('match') != '' and not fields.getString('match') in area.ret(star['name']) and not area.ret(star['description'])):
                    continue

                area.newReaction()
                area.ret(star["name"])
                area.ret(star["description"])
                area.ret(star["starNb"])

        return trig.setAction(func)

    @Action('When a user follow the connected user')
    @Field('match', FTYPE.STRING, 'String that should be matched in the new follower user bio')
    def onFolow(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            followers = githubApi.getNewFollower(area.getUser(), fields.getString('url'))
            if (followers == None):
                return
            for follower in followers:

                if (fields.getString('match') != '' and not fields.getString('match') in area.ret(follower['bio'])):
                    continue
                
                area.newReaction()
                area.ret(follower["name"])
                area.ret(follower["bio"])
                area.ret(Imgs([follower["avatarUrl"]]))
        return trig.setAction(func)