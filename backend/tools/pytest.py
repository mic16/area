import ast
import inspect
import colors
import traceback

__ERRCOLOR__ = colors.RED
__SUCCOLOR__ = colors.GREEN

successed = 0
errored = 0
errors = []


def Run(*args):
    def decorator(f):
        global errored
        global successed
        try:
            f(*args)
            successed += 1
            print(__SUCCOLOR__+'V', end='', flush=True)
        except Exception as e:
            errored += 1
            print(__ERRCOLOR__+'X', end='', flush=True)
            errors.append((traceback.format_exc(), f, args))
        return f
    return decorator

def diagnostic():
    print(colors.LIGHT_GRAY, end='\n\n')
    print(colors.LIGHT_GRAY+'='*50)
    for trace in errors:
        print(colors.LIGHT_CYAN + '%s: %s' % (trace[1].__name__, trace[2]))
        for line in trace[0].splitlines():
            print(colors.RED + '   ' + line)
        print()
    print(colors.LIGHT_GRAY+'Result'.center(50,'='))
    print('total: %d' % (successed + errored))
    print('successed: %d' % successed)
    print('errored: %d' % errored)
