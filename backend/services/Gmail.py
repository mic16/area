from Action import Action
from Service import Service
from Reaction import Reaction
from Field import Field, FTYPE
from Trigger import Trigger
import gmailApi

@Service(oauth='Google')
class Gmail():
    def __init__(self):
        pass

    @Action('When the user receive a mail')
    def onMail(self, fields):
        trig = Trigger(types=[str])
        def func(area, fields):
            mails = gmailApi.getLastMail(area.getUser(), area)
            if (mails == None):
                return
            for mail in mails:
                area.newReaction()
                area.ret(mail['snippet'])
        return trig.setAction(func)

    @Reaction(
        'Send a mail',
        str,
    )
    @Field('mailAdresse', 'string', 'Mail Adresse of the target user')
    @Field('object', 'string', 'object of the mail')
    def sendMail(self, area, fields):
        gmailApi.sendMail(area.getUser(), area.get(str)[0], fields.get(str)['mailAdresse'], fields.get(str)['object'])