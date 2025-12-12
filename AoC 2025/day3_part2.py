file = open("day3.snippet", "r")
lines = file.readlines()

total = 0 


for line in lines:
    starting_index = -1
    
    maxes = ''

    line = line.strip()
    numbers = [int(x) for x in line]
    
    for j in range(12, 0, -1):
        
        max = 0
        for i in range(starting_index + 1, len(numbers) - j + 1):
            element = numbers[i]

            if element > max:
                max = element
                starting_index = i

        maxes += str(max)
        
    total += int(maxes)
    
print(total)