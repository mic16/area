import inspect
import os

doc2gen = {}

def uppercaseFirst(str):
    return str[0].upper() + str[1:]

def pushObject(f):
    if not '.' in f.__qualname__:
        doc2gen[f.__module__] = doc2gen.get(f.__module__) or {}
        mod = doc2gen[f.__module__]
        mod[f.__qualname__] = f

def Description(*args):
    def decorator(f):
        if inspect.isfunction(f):
            f.__desc__ = args
        elif inspect.isclass(f):
            f.__constructor__ = hasattr(f, '__constructor__') and f.__constructor__ or {'params': {}}
            f.__constructor__['desc'] = args
        f.__documented__ = True
        pushObject(f)
        return f
    return decorator

def Return(type, desc):
    def decorator(f):
        if inspect.isfunction(f):
            f.__return__ = (type, desc)
        f.__documented__ = True
        pushObject(f)
        return f
    return decorator

def Param(name, desc):
    def decorator(f):
        if inspect.isfunction(f):
            f.__params__ = hasattr(f, '__params__') and f.__params__ or {}
            f.__params__[name] = desc
        elif inspect.isclass(f):
            f.__constructor__ = hasattr(f, '__constructor__') and f.__constructor__ or {'params': {}}
            f.__constructor__['params'][name] = desc
        f.__documented__ = True
        pushObject(f)
        return f
    return decorator

def ExtractParams(method):
    params = {}
    sig = inspect.signature(method)
    for name, param in sig.parameters.items():
        if param.annotation != inspect._empty:
            params[name] = param.annotation.__name__
        else:
            params[name] = 'Var'
    return params

def genArguments(handle, args, types={}):
    handle.write('#### Arguments')
    handle.write('| Argument | Type | Description | ')
    handle.write('| -------- | ---- | ----------- |')
    for argname in types:
        if argname != 'self':
            type = types.get(argname)
            desc = args.get(argname) or ''
            handle.write('| `%s` | `%s` | `%s` ' % (argname, type, desc))

def genClassDoc(handle, obj):
    parents = inspect.getmro(obj)
    parent = parents[1]

    if parent != object:
        module = doc2gen.get(parent.__module__)
        canBeLinked = module and module.get(parent.__qualname__)
        if canBeLinked:
            handle.write('# %s <b>extends</b> [%s](../%s/%s.md)' % (obj.__name__, parent.__name__, uppercaseFirst(parent.__module__), parent.__name__))
        else:
            handle.write('# %s <b>extends</b> %s' % (obj.__name__, parent.__name__))
    else:
        handle.write('# %s' % (obj.__name__))

    if hasattr(obj, '__constructor__'):
        constructor = obj.__constructor__
        if constructor.get('desc'):
            handle.write('> %s' % '<br>'.join(constructor.get('desc')))
        handle.write('### Constructor')
        types = {}
        if hasattr(obj, '__init__'):
            types = ExtractParams(obj.__init__)
        if constructor.get('params'):
            genArguments(handle, constructor.get('params'), types)
    
    methods = inspect.getmembers(obj, predicate=inspect.isfunction)

    if len(methods) > 0:
        handle.write('\n<hr>\n')

    first = True
    for methodname, method in methods:
        if hasattr(method, '__documented__'):
            if not first:
                handle.write('\n<hr>\n')
            genFuncDoc(handle, method)
            first = False
        

def genFuncDoc(handle, method):
    if hasattr(method, '__documented__'):
        handle.write('### %s ' % method.__name__)
        if hasattr(method, '__desc__'):
            handle.write('> %s' % '<br>'.join(method.__desc__))
        if hasattr(method, '__params__'):
            genArguments(handle, method.__params__, ExtractParams(method))
        if hasattr(method, '__return__'):
            handle.write('#### Return')
            handle.write('| Type | Description                      |')
            handle.write('| ---- | -------------------------------- |')
            handle.write('| `%s` | `%s` |' % method.__return__)

def genStaticFunctions(handle, objects):
    handle.write('# Static Functions')
    first = True
    for qualname, obj in objects.items():
        if inspect.isfunction(obj):
            if not first:
                handle.write('\n<hr>\n')
            genFuncDoc(handle, obj)
            first = False

def CreateModule(name, objects):
    if name == '__main__':
        pass
    else:
        name = uppercaseFirst(name)
        try:
            os.mkdir('./Doc/%s' % (name))
        except FileExistsError:
            pass
        for qualname, obj in objects.items():
            if inspect.isclass(obj):
                handle = open('./Doc/%s/%s.md' % (name, obj.__name__), 'w')
                write = handle.write
                handle.write =  lambda x: write('%s\n' % x)
                genClassDoc(handle, obj)
                handle.close()

        handle = open('./Doc/%s/StaticFunctions.md' % (name), 'w')
        write = handle.write
        handle.write =  lambda x: write('%s\n' % x)
        genStaticFunctions(handle, objects)
        handle.close()

def ExportDoc():
    
    try:
        os.mkdir('./Doc')
    except FileExistsError:
        pass

    for name, obj in doc2gen.items():
        CreateModule(name, obj)
            