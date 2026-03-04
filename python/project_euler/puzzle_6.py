import math

def find_natural_squares():
    sum = 0

    for i in range(1, 101):
        sum += i

    return math.pow(sum, 2)

def find_sum_squares():
    sum = 0

    for i in range(1, 101):
        sum += math.pow(i, 2)
    return sum

difference = find_sum_squares() - find_natural_squares()
print(difference)