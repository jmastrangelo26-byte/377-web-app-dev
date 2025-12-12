file = open("day5.dat", "r")
lines = file.readlines()
lines = [line.strip() for line in lines]

blank_index = lines.index('')
range_lines = lines[:blank_index]
ids = lines[blank_index + 1:]
refined_ranges = []

total = 0

for line in range_lines:
    start, end = line.split("-")
    refined_ranges.append([int(start), int(end)])

for id in ids:
    num = int(id)
    for refined_range in refined_ranges:
        if num >= refined_range[0] and num <= refined_range[1]:
            print(num)
            total += 1
            break

print(total)


