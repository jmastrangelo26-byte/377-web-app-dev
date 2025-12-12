file = open("day2.dat", "r")
ranges = file.readlines()[0].split(',')

total = 0 

for the_range in ranges:

    start, end = (int(x) for x in the_range.split('-'))

    for n in range(start, end + 1):
        number = str(n)

        length = len(number)

        for l in range(1, length):
            if length % l == 0:
                chunks = [number[i:i+l] for i in range(0, len(number), l)]
                if len(set(chunks)) == 1:
                    total += n
                    break

print('Part 2: ' + str(total))


