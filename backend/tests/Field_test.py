from Field import Field
from pytest import *

@Field('name', str, 'desc')
def stub():
    pass

@Run()
def test_action():
    assert hasattr(stub, '__fields__'),  'Function with the decorator @Field should have a __fields__ attribute'
    assert stub.__fields__[0]['name'] == 'name', "Field name should be 'name'"
    assert stub.__fields__[0]['description'] == 'desc', "Field description should be 'desc'"
    assert stub.__fields__[0]['type'] == str, "Field type should be 'str'"
