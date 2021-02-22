from Service import Service, services
from Action import Action
from Reaction import Reaction
from pytest import *

@Service()
class stubService:

    @Action('desc')
    def stubAction():
        pass

    @Reaction('desc', str)
    def stubReaction():
        pass

@Run()
def test_service():
    assert type(services.get('StubService')) is dict, 'Service StubService should have been created'
    assert type(services['StubService'].get('actions')) is dict, "Service should have a dict 'actions'"
    assert type(services['StubService'].get('reactions')) is dict, "Service should have a dict 'reactions'"
    assert type(services['StubService']['actions'].get('StubAction')) is dict, "Service should have an action named 'StubAction'"
    assert type(services['StubService']['reactions'].get('StubReaction')) is dict, "Service should have an action named 'StubReaction'"