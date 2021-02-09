
def assertEqual(a, b):
    if a != b:
        raise Exception("Expected value to be equal %s" % b)