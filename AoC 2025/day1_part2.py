file = open("AoC 2025/day1.dat", "r")
lines = file.readlines()

num_crossings = 0
position = 50

for line in lines:
    line = line.strip()
    direction = line[0]
    distance = int(line[1:])

    if direction == 'L':
        step = -1
    else:
        step = 1

    for i in range(distance):
        position = (position + step) % 100
        if position == 0:
            num_crossings += 1

print('Total crossings: ' + str(num_crossings))
