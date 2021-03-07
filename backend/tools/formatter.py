def format(format, *str):
    fmt = format
    for i in str:
        fmt = fmt.replace('%s', i, 1)
    return fmt