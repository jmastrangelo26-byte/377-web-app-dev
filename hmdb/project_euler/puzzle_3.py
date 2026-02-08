import math 


def is_prime(num):
    """Check if a number is prime."""
    if num <= 1:
        return False
    # Check for divisors up to the square root of the number
    for i in range(2, int(math.sqrt(num)) + 1):
        if num % i == 0:
            return False
    return True

def nth_prime(n):
    """Find the nth prime number."""
    if n <= 0:
        raise ValueError("n must be a positive integer (starting from 1st prime)")
    
    count = 0  # To count the number of primes found
    num = 1    # Starting number to check for primes
    while count < n:
        num += 1
        if is_prime(num):
            count += 1
    return num

def is_whole(n):
    if isinstance(n, int):
        return True
    if isinstance(n, float):
        return n.is_integer()
    return False

num = 600851475143
square = math.sqrt(600851475143)


new_num = num / 3
print(new_num)

while true:
    curr_num = num / nth_prime(num) 
    nth = is_whole 
