file = open("day5.dat", "r")
lines = file.readlines()

stacks = [
    ['H', 'C', 'R'],
    ['B', 'J', 'H', 'L', 'S', 'F'],
    ['R', 'M', 'D', 'H', 'J', 'T', 'Q'],
    ['S', 'G', 'R', 'H', 'Z', 'B', 'J'],
    ['R', 'P', 'F', 'Z', 'T', 'D', 'C', 'B'],
    ['T', 'H', 'C', 'G'],
    ['S', 'N', 'V', 'Z', 'B', 'P', 'W', 'L'],
    ['R', 'J', 'Q', 'G', 'C'],
    ['L', 'D', 'T', 'R', 'H', 'P', 'F', 'S']
]

for line in lines:
    line = line.strip()
    word = line.split(' ')
    num_blocks = int(word[1])
    source = int(word[3]) - 1
    destination = int(word[5]) - 1
    
for i in range(num_blocks):
    block = stacks[source].pop()
    stacks[destination].append(block)

for i in range (len(stacks)):
    print(stacks[i][-1], end='')
print()