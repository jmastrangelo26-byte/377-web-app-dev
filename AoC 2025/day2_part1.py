file = open("day2.dat", "r")
ranges = file.readlines()[0].split(',')

total = 0 

for the_range in ranges:

    start, end = (int(x) for x in the_range.split('-'))

    for i in range(start, end + 1):
        nick = str(i)
        half = len(nick) // 2
        first = nick[:half]
        second = nick[half:]

        if first == second:
            total += i

print('Part 1: ' + str(total))


