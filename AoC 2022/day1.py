file = open("day1.txt", "r")
lines = file.readlines()

max_1 = 0
max_1 = 0
current = 0

for line in lines:
    line = line.strip()
    if line == "":
        if current > max:
            max = current
        current = 0
    else:
        current += int(line)

print("Part 1: " + str(max))

