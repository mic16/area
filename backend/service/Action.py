import inspect

def Action(desc, returnTypes):
    def decorator(func):
        assert inspect.isfunction(func), 'Action should be applied to a method'
        assert type(returnTypes) == list, 'Expected a list of return types'
        assert len(returnTypes) > 0, 'Expect at least one return type'

        func.__service__ = {
            'type': 'action',
            'description': desc,
            'outputs': returnTypes
        }

        return func
    return decorator