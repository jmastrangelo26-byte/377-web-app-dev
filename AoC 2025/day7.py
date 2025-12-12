file = open("AoC 2025/day7.dat", "r")
lines = file.readlines()

last_indices = set()
splits = 0
first = True
for line in lines:
    line = line.strip()
    current = list(line)

    if first:
        last_indices.add(current.index('S'))
        first = False
    else:
        indices = set()
        for i in last_indices:
            if current[i] == "^":
                splits += 1
                indices.add(i-1)
                indices.add(i+1)
            else: 
                indices.add(i)
            last_indices = indices
print(splits)