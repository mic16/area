def diffFirstSecond(source, after, compare=None):
    firstIndex = -1 
    for i in source:
        if firstIndex != -1:
            break
        for j in range(len(after)):
            if (compare and compare(i, after[j])) or (not compare and i == after[j]):
                firstIndex = j
                break
    if firstIndex == -1:
        return after
    return after[0:firstIndex]