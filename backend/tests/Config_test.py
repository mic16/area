from Config import Config
from pytest import *

@Run(int)
@Run(1)
@Run(1.0)
@Run('')
@Run([])
@Run('string')
@Run(None)
@Run(True)
def construct_config_fail(object):
    try:
        config = Config(object)
        assert False, "Construct a Config with '%s' should throw" % object
    except:
        pass

@Run({'a': 'b'})
@Run({})
def construct_success(object):

    try:
        config = Config(object)
    except:
        assert False, "Construct a Config with '%s' should not throw" % object

@Run('string', False)
@Run('bool', True)
@Run('true', True)
@Run('false', False)
@Run('array', False)
@Run('float', False)
@Run('int', False)
@Run('string', None, None)
@Run('bool', True, None)
@Run('true', True, None)
@Run('false', False, None)
@Run('array', None, None)
@Run('float', None, None)
@Run('int', None, None)
def get_bool(key, val, default=False):
    config = Config({
        'string': 'text',
        'bool': True,
        'true': True,
        'false': False,
        'array': [1,2,3],
        'float': 1.0,
        'int': 666,
    })

    assert config.getBool(key, default) == val, "getBool on key '%s' should return '%s'"  % (key, val)

@Run('string', 'text')
@Run('bool', None)
@Run('true', None)
@Run('false', None)
@Run('array', None)
@Run('float', None)
@Run('int', None)
@Run('string', 'text', '')
@Run('bool', '', '')
@Run('true', '', '')
@Run('false', '', '')
@Run('array', '', '')
@Run('float', '', '')
@Run('int', '', '')
def get_string(key, val, default=None):
    config = Config({
        'string': 'text',
        'bool': True,
        'true': True,
        'false': False,
        'array': [1,2,3],
        'float': 1.0,
        'int': 666,
    })

    assert config.getString(key,  default) == val, "getString on key '%s' should return '%s'"  % (key, val)

@Run('string', 0)
@Run('bool', 0)
@Run('true', 0)
@Run('false', 0)
@Run('array', 0)
@Run('float', 1.0)
@Run('int', 0)
@Run('string', None, None)
@Run('bool', None, None)
@Run('true', None, None)
@Run('false', None, None)
@Run('array', None, None)
@Run('float', 1.0, None)
@Run('int', None, None)
def get_float(key, val,  default=0):
    config = Config({
        'string': 'text',
        'bool': True,
        'true': True,
        'false': False,
        'array': [1,2,3],
        'float': 1.0,
        'int': 666,
    })

    assert config.getFloat(key, default) == val, "getFloat on key '%s' should return '%s'"  % (key, val)

@Run('string', 0)
@Run('bool', 0)
@Run('true', 0)
@Run('false', 0)
@Run('array', 0)
@Run('float', 0)
@Run('int', 666)
@Run('string', None, None)
@Run('bool', None, None)
@Run('true', None, None)
@Run('false', None, None)
@Run('array', None, None)
@Run('float', None, None)
@Run('int', 666)
def get_int(key, val, default=0):
    config = Config({
        'string': 'text',
        'bool': True,
        'true': True,
        'false': False,
        'array': [1,2,3],
        'float': 1.0,
        'int': 666,
    })

    assert config.getInt(key, default) == val, "getInt on key '%s' should return '%s'"  % (key, val)

@Run('string', [])
@Run('bool', [])
@Run('true', [])
@Run('false', [])
@Run('array', [1,2,3])
@Run('float', [])
@Run('int', [])
@Run('string', None, None)
@Run('bool', None, None)
@Run('true', None, None)
@Run('false', None, None)
@Run('array', [1,2,3])
@Run('float', None, None)
@Run('int', None, None)
def get_array(key, val, default=[]):
    config = Config({
        'string': 'text',
        'bool': True,
        'true': True,
        'false': False,
        'array': [1,2,3],
        'float': 1.0,
        'int': 666,
    })

    assert config.getArray(key, default) == val, "getArray on key '%s' should return '%s'"  % (key, val)