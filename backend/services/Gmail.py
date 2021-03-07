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

    @Action('When I receives a mail')
    def onMail(self, fields):
        trig = Trigger(types=[str])
        def func(area, fields):
            mails = gmailApi.getLastMail(area.getUser(), area)
            if (mails == None):
                return
            for mail in mails:
                area.newReaction()
                area.ret(mail.get('snippet'))
        return trig.setAction(func)

    @Reaction(
        'Send a mail',
        str,
    )
    @Field('mailAdresse', FTYPE.STRING, 'Email adress of the targeted user')
    @Field('object', FTYPE.STRING, 'Subject of the mail')
    @Field('message', FTYPE.STRING, 'format string of your message (%s will be replaced by the message)')
    def sendMail(self, area, fields):
        fmtStr = fields.get('message', '%s') or '%s'
        gmailApi.sendMail(area.getUser(), fmtStr % area.get(str)[0], fields.getString('mailAdresse'), fields.getString('object'))