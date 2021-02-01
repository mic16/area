import inspect
import time
import traceback
import sys
import colors

def timed():
    def decorator(f):
        def run(*args):
            start = time.process_time_ns()
            result = (f(*args))
            stop = time.process_time_ns()
            print('%s: %d ns' % (f.__qualname__, stop - start))
            return result
        return run
    return decorator

def __print_frame__(frame, padding=''):
    if frame:
        __print_frame__(frame.f_back, padding)
        fcode = frame.f_code
        file = open(fcode.co_filename, 'r')
        code = file.read().splitlines()
        file.close()

        if fcode.co_filename.endswith('debugger.py') and fcode.co_name == 'run':
            return
        print(padding*2 + colors.LIGHT_GRAY + 'File "%s", line %d, in %s' % (fcode.co_filename, fcode.co_firstlineno, fcode.co_name))

        for i in range(fcode.co_firstlineno-1, frame.f_lineno):
            color = colors.LIGHT_GREEN
            if i+1 == frame.f_lineno:
                color = colors.RED
            print(padding*3 + '%s%d: %s' % (color, i+1, code[i]))
        print(colors.LIGHT_GRAY)

        if frame.f_locals:
            locals = []
            maxnamelen = max([len(i) for i in frame.f_locals])
            for varname, value in frame.f_locals.items():
                locals.append('%s = %s' % (varname.ljust(maxnamelen), value))
            lens = max([len(i) for i in locals])
            print(padding*3 + colors.YELLOW + '+%s+' % 'Locals'.center(lens,'='))
            for local in locals:
                print(padding*3 + colors.YELLOW + '|%s|' % local.ljust(lens))
            print(padding*3 +'+%s+' % ('='*lens))
            print()

def trace():
    def decorator(f):
        def run(*args):
            try:
                result = (f(*args))
                return result
            except Exception as e:
                print('[%s]' % ' Exception Catched '.center(48, '='))
                traces = inspect.trace()
                padding = '    '
                print(padding + 'Traceback (most recent call last):')
                __print_frame__(traces[-1][0], padding)
                print(padding * 3 + '%sError: %s' % (colors.RED, e))
                print(colors.LIGHT_GRAY)

                print('[%s]' % ('='*48))
                sys.exit(84)
        return run
    return decorator


