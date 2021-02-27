def diffFirstSecond(l1, l2):
    tab = []
    for i in l1:
        a = False
        for j in l2:
            if i == j:
                a = True
        if not a:
            tab.append(i)
    return tab  