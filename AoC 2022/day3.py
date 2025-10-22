file = open("day3.txt", "r")
lines = file.readlines()

alphabet ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

total = 0

for line in lines:
    line = line.strip()
    rucksack = line

    first_half = rucksack[:len(rucksack) // 2]
    second_half = rucksack[len(rucksack) // 2:]

    print(rucksack)

    for letter in first_half:
        if letter in second_half:
            print(letter)
            total += alphabet.index(letter) + 1
            break
    
# print(total)

counter = 0
for line in line: 
    if counter % 3 == 0:
        

r1 = "vJrwpWtwJgWrhcsFMMfFFhFp"
r2 = "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL"
r3 = "PmmdzqPrVvPwwTWBwg"

for letter in r1:
    if letter in r2 and letter in r3:
        print("Found it! " + letter)
        break