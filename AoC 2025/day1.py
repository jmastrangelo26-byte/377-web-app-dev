file = open("day1.dat", "r")
lines = file.readlines()

num_zeros = 0
starting_rotation = 50

for line in lines:
    line = line.strip()
    direction = line[0:1]
    sequence = int(line[1:])
    new_rotation = 0
    
    if direction == "L":
        new_rotation = (starting_rotation - sequence) % 100
        starting_rotation = new_rotation
        
        if new_rotation == 0:
            num_zeros += 1
       
    if line[0] == "R":
        desired_rotation = sequence
        new_rotation = (starting_rotation + sequence) % 100
        starting_rotation = new_rotation
        
        if new_rotation == 0:
            num_zeros += 1

print(num_zeros)




    