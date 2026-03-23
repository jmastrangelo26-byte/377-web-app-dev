from sys import argv
import random, tkinter as tk

root = tk.Tk()
root.title("Diceware Password Generator")
root.geometry("400x400")

tk.Label(root, text="Number of Words").grid(row=0, column=0, padx=5, pady=5, sticky=tk.E)
entry1 = tk.Entry(root)
entry1.grid(row=0, column=1, padx=5, pady=5, sticky=tk.W)  


if len(argv) == 3:
    length = int(argv[1])

    includeNumber = "0" in argv[2]
    includeLower = "a" in argv[2]
    includeUpper = "A" in argv[2]
    includeSpecial = "!" in argv[2]
elif len(argv) == 1:
    length = int(input("Minimum Input Length: "))
    include_number = input("Digits required? [Y/N]: ").upper()[0] == "Y"
    include_lower = input("Requires lower case? [Y/N]: ").upper()[0] == "Y"
    include_upper = input("Requires upper case? [Y/N]: ").upper()[0] == "Y"
    include_special = input("Requires a special character? [Y/N]: ").upper()[0] == "Y"
else:
    print("Expected usage: python password_generator.py [length] [options]")
    print("where pattern contains one or more of the following: Aa0!")
    exit()

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
