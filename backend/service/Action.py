import inspect

def Action(desc):
    def decorator(func):
        assert inspect.isfunction(func), 'Action should be applied to a method'

        func.__service__ = {
            'type': 'action',
            'description': desc,
        }

        return func
    return decorator