file = open("day3.dat", "r")
lines = file.readlines()

total = 0 

for line in lines:
    biggest = 0
    second_biggest = 0
    max = 0

    line = line.strip()
    numbers = [int(x) for x in line]

    for i in range(len(numbers) - 1):
        element = numbers[i]

        if element > max:
            max = element
            starting_index = i

    biggest = max
    max = 0
    
    for i in range(starting_index + 1, len(numbers)):
        new_element = numbers[i]

        if new_element > max:
            max = new_element

    second_biggest = max
    
    # print(int(str(biggest) + str(second_biggest)))
    total += int(str(biggest) + str(second_biggest))
    
print(total)