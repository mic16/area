import inspect

def Reaction(desc, inputTypes):
    def decorator(func):
        assert inspect.isfunction(func), 'Reaction should be applied to a method'
        assert type(inputTypes) == list, 'Expected a list of input types'

        func.__service__ = {
            'type': 'reaction',
            'description': desc,
            'inputs': inputTypes
        }

        return func
    return decorator