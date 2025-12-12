file = open("AoC 2025/day9.dat", "r")
lines = file.readlines()
positions = []

for line in lines:
    line = line.strip()
    nums = line.split(",")

    positions.append([int(nums[0]), int(nums[1])])

max_area = 0
 
for i in range(len(positions)):
    for j in range(i + 1, len(positions)):
        x1 = positions[i][0]
        y1 = positions[i][1]

        x2 = positions[j][0]
        y2 = positions[j][1]

        width = abs(x2 - x1) + 1
        length = abs(y2 - y1) + 1
        area = width * length

        if area > max_area:
            max_area = area

print(max_area)