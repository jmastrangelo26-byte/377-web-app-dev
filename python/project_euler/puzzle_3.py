import math 

def is_prime(number):
    for i in range(2, round(math.sqrt(number))):
        if number % i == 0:
            return False
    return True

number = 600851475143
max = 0
i = 2

while i < math.sqrt(number):
    if number % i == 0 and is_prime(i):
        max = i
    i += 1

print(max)