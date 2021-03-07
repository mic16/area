def format(formatString, *str):
    fmt = formatString
    for i in str:
        fmt = fmt.replace('%s', i, 1)
    return fmt