import random 
from sys import argv 

script, l, p = argv 

length = int(input("Minimum Input Length: "))
include_number = input("Digits required? [Y/N]: ").upper()[0] == "Y"
include_lower = input("Requires lower case? [Y/N]: ").upper()[0] == "Y"
include_upper = input("Requires upper case? [Y/N]: ").upper()[0] == "Y"
include_special = input("Requires a special character? [Y/N]: ").upper()[0] == "Y"

SPECIALS = "!@#$%^&*()_+[]:;,.?/"
password = []

if include_number:
    password.append(str(random.randint(0,9)))

if include_lower:
    password.append(chr(ord("a") + random.randint(0,25)))

if include_upper:
    password.append(chr(ord("A") + random.randint(0,25)))

if include_special:
    password.append(SPECIALS[random.randint(0, len(SPECIALS) - 1)])

while len(password) < length:

    choice = random.randint(1,4)

    if choice == 1 and include_number:
        password.append(str(random.randint(0,9)))

    if choice == 2 and include_upper:
        password.append(chr(ord("A") + random.randint(0,25)))

    if choice == 3 and include_lower:
        password.append(chr(ord("a") + random.randint(0,25)))

    if choice == 3 and include_lower:
        password.append(chr(ord("a") + random.randint(0,25)))

    if choice == 4 and include_special:
        password.append(SPECIALS[random.randint(0, len(SPECIALS) - 1)])
    

random.shuffle(password)
print("".join(password))
