def calculate_fuel(mass):
    fuel = mass // 3 - 2
    return fuel

def part1():
    total_fuel = 0

    file = open("AoC 2019/day1-snippet.txt", "r")
    for line in file:
        mass = int(line)
        fuel = calculate_fuel(mass)
        total_fuel += fuel

    file.close()
    return total_fuel

print(part1())