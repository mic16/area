from User import User
from Area import Area
from pytest import *
from pyassert import *

from Action import Action
from Reaction import Reaction
from Service import Service
from Trigger import Trigger

action_counter = 0
reaction_counter = 0


@Service()
class foobar():
    def __init__(self):
        pass

    @Action('')
    def foo(self, fields):
        def func(area, fields):
            global action_counter
            action_counter += 1
            area.ret('foobar')
        return Trigger(func, types=[str])

    @Reaction('', str)
    def bar(self, area, fields):
        global reaction_counter
        reaction_counter += 1

_valid_json = {
    'action':  {
        'service': 'Foobar',
        'name': 'Foo',
    },
    'reaction': {
        'service': 'Foobar',
        'name': 'Bar',
    },
}

user = User('foobar', None)

@Run({'action': {}, 'reaction': {}}, user)
@Run({'action': {'service': 'foo'}, 'reaction': {'service': 'bar'}}, user)
@Run({}, int)
@Run({}, {})
@Run(1, None)
@Run(None, None)
@Run({}, None)
def invalid_json(json, user):

    area = Area(json, user)

    assert area.isErrored(), "Area should have been flagged as errored"

@Run(_valid_json, user)
def valid_json(json, user):

    area = Area(json, user)

    assert not area.isErrored(), "Area should not have been flagged as errored"

@Run()
def single_return_type_value():
    area = Area(_valid_json, user)

    assert not area.isErrored(), "Area should not have been flagged as errored"

    area.ret(1)
    area.ret(2)
    area.ret(3)

    assert area.get(int) == [1,2,3], "Area should stack value of the same type in an array"

@Run()
def multiple_return_type_value():
    area = Area(_valid_json, user)

    assert not area.isErrored(), "Area should not have been flagged as errored"

    area.ret(1)
    area.ret(2)
    area.ret(3)

    area.ret('str')
    area.ret('str2')

    assert area.get(int) == [1,2,3], "Area should stack value of the same type in an array"
    assert area.get(str) == ['str','str2'], "Area should stack value of the same type in an array"

@Run()
def multiple_return_at_once():
    area = Area(_valid_json, user)

    assert not area.isErrored(), "Area should not have been flagged as errored"

    area.ret(1,2,3)
    area.ret('str', 'str2')
    area.ret(4,'5',6.0)

    assert area.get(int) == [1,2,3,4], "Area should stack value of the same type in an array"
    assert area.get(str) == ['str','str2','5'], "Area should stack value of the same type in an array"
    assert area.get(float) == [6.0], "Area should stack value of the same type in an array"

@Run()
def should_be_errored():
    area = Area(_valid_json, user)

    assert not area.isErrored(), "Area should not have been flagged as errored"

    area.error('foobar')

    assert area.isErrored(), "Area should be errored when 'error' is called"
    assert area.getErrorMessage() == 'foobar', "Area error message should be set when calling 'error'"

@Run()
def should_generate_hex_uuid():
    area = Area(_valid_json, user)
    area2 = Area(_valid_json, user)

    uuid = area.getUUID()

    assert uuid != None, "Area should generate a new uuid when created"
    assert area.getUUID() != area2.getUUID(), "Area UUID should always be unique"

@Run()
def manually_set_uuid():

    area = Area(_valid_json, user, fuuid='foobar')

    assert area.getUUID() == 'foobar', "Area uuid should accept a manually defined uuid"

@Run()
def return_user():

    area = Area(_valid_json, user)

    assert area.getUser() is user, "Area getUser() should return the user given at construction"

@Run()
def trigger_should_be_called_once():
    global action_counter
    global reaction_counter

    area = Area(_valid_json, user)

    area.trigger()

    assert action_counter == 1 and reaction_counter == 1, "Action and Reaction should have been called"
    area.trigger()
    assert action_counter == 1 and reaction_counter == 1, "Action and Reaction should have only been called once, in less than Xs"