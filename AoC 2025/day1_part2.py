file = open("AoC 2025/day1.snippet", "r")
lines = file.readlines()

num_zeros = 0
starting_rotation = 50

for line in lines:
    line = line.strip()
    direction = line[0:1]
    distance  = int(line[1:])
    new_rotation = 0

    if direction == 'R':
        distance *= -1

    new_rotation = (starting_rotation + distance) % 100
    
    num_zeros += abs((distance + starting_rotation) // 100)

    if new_rotation == 0:
        num_zeros += 1

    starting_rotation = new_rotation

    print("New Step")
    print("Starting rotation: " + str(starting_rotation) + "\nNew Roation: " + str(new_rotation) + "\nDistance: " + str(distance))
    print(" ")
print("Num Zeros: " + str(num_zeros))
