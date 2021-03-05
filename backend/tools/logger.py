import colors
import sys
import builtins
import time

INFO=0
WARNING=1
ERROR=2
DEBUG=3

__logger__ = 'AREA'

__print__ = print

logfile = open('/var/logs/%s.log' % (time.strftime("%d-%m-%Y")), 'w')
def log(*args, level=DEBUG, end='\n', flush=False, file=None):
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
    coloredMessage = '%s[%s][%s]%s %s' % (color, time.ctime(), __logger__, prefix, message)
    logfile.write('[%s][%s]%s %s\n' % (time.ctime(), __logger__, prefix, message))
    logfile.flush()
    __print__(coloredMessage, file=sys.stderr, end=end, flush=flush)

builtins.print = log