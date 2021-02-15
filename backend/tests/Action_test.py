from Action import Action
from pytest import *

@Action('foobar')
def stub():
    pass

@Run()
def test_action():
    assert hasattr(stub, '__service__'),  'Function with the decorator @Action should have a __service__ attribute'
    assert stub.__service__['type'] == 'action', 'Service type should be typed as an action'
    assert stub.__service__['description'] == 'foobar', "Service description should be 'foobar'"
