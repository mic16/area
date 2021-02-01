import re
import functools

class Token():
    def __init__(self, value, type):
        self.value = value
        self.type = type
    
    def getType(self):
        return self.type

    def getValue(self):
        return self.value


class PathParser():
    @functools.cache
    def parse(self, path, constructMode=False):
        if type(path) is list:
            return path
        self.pathArray = []
        self.index = 0
        self.path = path
        while not self.eof():
            if self.curr() == '[':
                self.eat()
                self.pathArray.append(self.parseIndex())
            elif self.curr() == '.':
                self.eat()
                if self.eof():
                    self.unexpectedEOF()
                self.pathArray.append(self.parseLitteral())
            else:
                self.pathArray.append(self.parseLitteral())

        if not constructMode:
            return [token.getValue() for token in self.pathArray]
        return self.pathArray

    def curr(self):
        return self.path[self.index]

    def eat(self):
        char = self.path[self.index]
        self.index += 1
        return char

    def parseEscape(self):
        self.eat()

        if self.eof():
            self.unexpectedEOF()

        cases = {
            'r': '\r',
            'n': '\n',
            'a': '\a',
            'f': '\f',
            'b': '\b',
            '0': '\0',
            '\'': '\'',
            '"': '"',
            '\\': '\\',
            't': '\t',
            'v': '\v',
            '.': '.',
            '[': '[',
            ']': ']'
        }

        token = cases.get(self.eat())
        if token == None:
            raise Exception('%d: Invalid escape sequence \'\\%s\'' % (self.index, self.curr()))
        return token


    def parseIndex(self):
        token = None
        if self.curr() in '\'"':
            token = self.parseQuote(self.curr())
        elif self.curr().isnumeric() or self.curr() in '-+':
            token = self.parseNumber()
        else:
            token = ''
            while not self.eof() and not self.curr() == ']':
                char = self.eat()
                if char == '\\':
                    token += self.parseEscape()
                else:
                    token += char
            if self.eof():
                self.unexpectedEOF(']')
        
        if self.curr() != ']':
            self.invalidToken(']')
        self.eat()
        return Token(token, list)
    
    def parseNumber(self):
        sign =  ''
        intpart = ''
        decpart = ''
        if self.curr() == '-':
            sign = '-'
            self.eat()
        elif self.curr() == '+':
            self.eat()

        if self.eof():
            self.unexpectedEOF('number')
        
        if not self.curr().isnumeric():
            self.invalidToken('number')
        while not self.eof() and self.curr().isnumeric():
            intpart += self.eat()
        if self.curr() == '.':
            self.eat()
            if self.eof():
                self.unexpectedEOF('number')
            if not self.curr().isnumeric():
                self.invalidToken('number')
            while not self.eof() and self.curr().isnumeric():
                decpart += self.eat()
            return float(sign+intpart+'.'+decpart)
        else:
            return int(sign+intpart)

    def invalidToken(self, expected=None):
        if expected:
            raise Exception('%d: invalid token \'%s\', expected \'%s\'' % (self.index, self.curr(), str(expected)))
        raise Exception('%d: invalid token \'%s\'' % (self.index, self.curr()))
        

    def parseQuote(self, quote):
        self.eat()
        token = ''
        while not self.eof() and self.curr() != quote:
            char = self.eat()
            if char == '\\':
                token += self.parseEscape()
            else:
                token += char
        if self.eof():
            self.unexpectedEOF(quote)
        self.eat()
        return token

    def unexpectedEOF(self, expected=None):
        if expected:
            raise Exception('%d: unexpected token  \'%s\', expected \'%s\'' % (self.index, 'EOF', str(expected)))
        raise Exception('%d: unexpected token \'%s\'' % (self.index, 'eof'))

    def parseLitteral(self):
        token = ''
        while not self.eof() and not self.curr() in '.[]':
            char = self.eat()
            if char == '\\':
                token += self.parseEscape()
            else:
                token += char
        return Token(token, dict)

    def eof(self):
        return self.index >= len(self.path)
            
def get(obj, path, default=None):
    parser = PathParser()
    fobj = obj
    for p in parser.parse(path):
        if fobj is None:
            return default
        elif type(fobj) is dict:
            fobj = fobj.get(p)
        elif type(fobj) is list:
            if type(p) is int and p >= -len(fobj) and p < len(fobj):
                fobj = fobj[p]
            else:
                fobj = None
        elif type(fobj) is str:
            if type(p) is int and p >= -len(fobj) and p < len(fobj):
                fobj = fobj[p]
            else:
                fobj = None
        else:
            fobj = None
    return fobj

def has(obj, path):
    parser = PathParser()
    fobj = obj
    for p in parser.parse(path):
        if fobj is None:
            return default
        elif type(fobj) is dict:
            if p in [*fobj]:
                fobj = fobj.get(p)
            else:
                return False
        elif type(fobj) is list:
            if type(p) is int and p >= -len(fobj) and p < len(fobj):
                fobj = fobj[p]
            else:
                return False
        elif type(fobj) is str:
            if type(p) is int and p >= -len(fobj) and p < len(fobj):
                fobj = fobj[p]
            else:
                return False
        else:
            return False
    return True

def Is(obj, ttype, default=None):
    if type(ttype) is list:
        if type(obj) in ttype:
            return obj
        return default
    elif type(obj) is ttype:
        return obj
    return default