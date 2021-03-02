from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
from Imgs import Imgs
import imgurApi
import _

@Service(oauth='Imgur')
class Imgur():
    def __init__(self):
        pass

    @Action('When the user posts something')
    @Field('match', FTYPE.STRING, 'String that should be matched with the title or description')
    def onPost(self, fields):

        trig = Trigger(types=[str, Imgs])

        def func(area, fields):
            imgs = imgurApi.getLastPost(area.getUser(), area)
            if (imgs == None):
                return
            for img in imgs:

                if (fields.getString('match', '') != '' and not fields.getString('match', '') in _.get(img, 'album.title', '') and not fields.getString('match', '') in _.get(img, 'album.description', '')):
                    continue

                area.newReaction()
                area.ret(_.get(img, 'album.title'))
                area.ret(_.get(img, 'album.description'))
                area.ret(Imgs(img.get('imgs')))

        return trig.setAction(func)

    @Action('When the user favs a post')
    @Field('match', FTYPE.STRING, 'String that should be matched with the title or description')
    def onFav(self, fields):

        trig = Trigger(types=[str])

        def func(area, fields):
            imgs = imgurApi.getLastFav(area.getUser(), area)
            if (imgs == None):
                return
            for img in imgs:

                if (fields.getString('match', '') != '' and not fields.getString('match', '') in _.get(img, 'album.title', '') and not fields.getString('match', '') in _.get(img, 'album.description', '')):
                    continue

                area.newReaction()
                area.ret(_.get(img, 'album.title'))
                area.ret(_.get(img, 'album.description'))
                area.ret(Imgs(img.get('imgs')))

        return trig.setAction(func)

    @Reaction(
        'Make a post',
        Imgs,
    )
    def createPost(self, area, fields):
        title = ''
        description = ''
        if len(area.get(str)) >= 1:
            title = area.get(str)[0]
        if len(area.get(str)) >= 2:
            description = area.get(str)[1]
        imgurApi.createPost(area.getUser(), area.get(Imgs)[0].getImages(), title, description)