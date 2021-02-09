import inspect

intances = {}

def singleton():
    def decorator(f):
        assert inspect.isclass(f), 'Expected a class'
        def instance(*args):
            ref = intances.get(type(f))
            if ref:
                return ref
            ref = f(*args)
            intances[type(f)] = ref
            return ref
        return instance
    return decorator