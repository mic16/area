from Reaction import Reaction
from pytest import *

@Reaction('foobar', int)
def stub():
    pass

@Run()
def test_reaction():
    assert hasattr(stub, '__service__'),  'Function with the decorator @Reaction should have a __service__ attribute'
    assert stub.__service__['type'] == 'reaction', 'Service type should be typed as a reaction'
    assert stub.__service__['description'] == 'foobar', "Service description should be 'foobar'"
    assert stub.__service__['inputs'] == int, "Service input type should be 'int'"
    