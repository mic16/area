import re

pattern = re.compile('([^=]+)=(.*)')

def parse(querystring):
    options = {}
    if not querystring:
        return {}
    splitQuery = querystring.split('&')
    for opt in splitQuery:
        if match := pattern.fullmatch(opt):
            options[match.group(1)] = match.group(2)
    return options
