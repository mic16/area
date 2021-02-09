class FTYPE():
    INT = 'int'
    ARRAY = 'array'
    FLOAT = 'float'
    STRING = 'string'
    BOOLEAN = 'boolean'

def Field(name, type, desc):
    def decorator(func):
        func.__fields__ = hasattr(func, '__fields__') and func.__fields__ or []
        func.__fields__.append({'name': name, 'type': type, 'description': desc})
        return func
    return decorator