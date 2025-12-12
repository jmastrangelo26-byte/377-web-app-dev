file = open("day4.txt", "r")
lines = file.readlines()

total = 0

for line in lines:
    line = line.strip()
    series = line


    divided_string = line.split(",")

    first_half = divided_string[0]
    second_half = divided_string[1]

    divided_first_half = first_half.split("-")
    x1 = int(divided_first_half[0])
    y1 = int(divided_first_half[1])

    divided_second_half = second_half.split("-")
    x2 = int(divided_second_half[0])
    y2 = int(divided_second_half[1])

    if (x2 >= x1 and x2 <= y1) or (y2 >= x1 and y2 <= y1):
        total += 1
        print(line)
print(total)

