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

    @Action('When I star a Repo')
    @Field('match', FTYPE.STRING, 'String that should be matched with the name or description of the repo')
    def onStar(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            stars = githubApi.getLastStar(area.getUser(), area)
            if stars == None:
                return
            for star in stars:

                if (fields.getString('match') != '' and not fields.getString('match', '') in star.get('name', '') and not fields.getString('match', '') in star.get('description', '')):
                    continue

                area.newReaction()
                area.ret(star.get('name'))
                area.ret(star.get('description'))
                area.ret(star.get('starNb'))

        return trig.setAction(func)

    @Action('When a user follows me')
    @Field('match', FTYPE.STRING, 'String that should be matched in the new follower\'s bio')
    def onFolow(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            followers = githubApi.getNewFollower(area.getUser(), area)
            if (followers == None):
                return
            for follower in followers:

                if (fields.getString('match', '') != '' and not fields.getString('match', '') in follower.get('bio', '')):
                    continue
                
                area.newReaction()
                area.ret(follower.get('name'))
                area.ret(follower.get('bio'))
                area.ret(Imgs([follower.get('avatarUrl')]))
        return trig.setAction(func)