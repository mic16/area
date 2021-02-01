import inspect

def Reaction(desc, inputType=None):
    def decorator(func):
        assert inspect.isfunction(func), 'Reaction should be applied to a method'
        assert type(inputType) == type, 'Expected a class'

        func.__service__ = {
            'type': 'reaction',
            'description': desc,
            'inputs': inputType
        }

        return func
    return decorator