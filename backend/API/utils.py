def diffFirstSecond(source, after):
    firstIndex = -1 
    for i in source:
        if firstIndex != -1:
            break
        for j in range(len(after)):
            if i == after[j]:
                firstIndex = j
                break
    if firstIndex == -1:
        return after
    return after[0:firstIndex]