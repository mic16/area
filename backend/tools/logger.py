import colors
import sys
import builtins

INFO=0
WARNING=1
ERROR=2
DEBUG=3

__logger__ = 'AREA'

__print__ = print

def log(*args, level=DEBUG, end='\n', flush=False):
    message = ' '.join([str(i) for i in args])
    color = colors.LIGHT_WHITE
    prefix = ''
    if level == INFO:
        color = colors.LIGHT_CYAN
        prefix = '[INFO]'
    elif level == WARNING:
        color = colors.BROWN
        prefix = '[WARN]'
    elif level == ERROR:
        color = colors.RED
        prefix = '[ERROR]'
    elif level == DEBUG:
        color = colors.LIGHT_PURPLE
        prefix = '[DEBUG]'
    coloredMessage = '%s[%s]%s %s' % (color, __logger__, prefix, message)
    __print__(coloredMessage, file=sys.stderr, end=end, flush=flush)

builtins.print = log