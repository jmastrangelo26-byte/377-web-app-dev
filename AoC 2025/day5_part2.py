file = open("AoC 2025/day5.dat", "r")
lines = file.readlines()

prev_ranges = [] 
fresh_count = 0 
start = 0
end = 0 


def is_fresh(i):
    fresh = True
    for range in prev_ranges:
        if i >= range[0] and i <= range[1]:
            fresh = False
        
    return fresh

for line in lines:
    line = line.strip()

    current_range = line.split("-")
    start = int(current_range[0])
    end = int(current_range[1])

    # If both start and end are fresh, then end-start is fresh

    for i in range(start, end + 1):
        if (is_fresh(i) == True):
            fresh_count += 1
    
    prev_ranges.append((start, end))
    print("Processed line " + str(i) + "\n")

print(fresh_count)
    
