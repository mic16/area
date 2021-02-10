from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger

@Service()
class Twitter():
    def __init__(self):
        pass

    @Action('When a user tweet something')
    @Field('match', FTYPE.STRING, 'String that should be matched')
    @Field('with image', FTYPE.BOOLEAN, 'If the post should contain an image')
    def onTweet(self, fields):

        trig = Trigger(types=[str])
        if fields.getBool('with image') == True:
            trig.addType(int)

        def func(area, fields):
            if fields.getBool('with image') == True:
                area.ret(666)
            area.ret('Hello')

        return trig.setAction(func)

    @Reaction(
        'Post a new tweet',
        int,
    )
    def tweet(self, area, fields):
        print(area.get(str), area.getUser().getMail())
