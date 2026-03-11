import random

random_words = {} 

file = open("/Users/jamesmastrangelo/Documents/WebAppDev/377-web-app-dev/python/diceware_password_generator/words.txt", "r")
lines = file.readlines()

def roll_die():
    roll = ""
    
    for i in range(5):
        roll = roll + str(random.randint(1,6))
    return str(roll)


for i in range(5):
    roll = roll_die()
    print(roll)
        
    for line in lines:
        line = line.strip()

        split_line = line.split()

        if split_line[1] == roll:
            random_words.update({roll: split_line[1]})
            print(split_line[1])




