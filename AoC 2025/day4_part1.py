file = open("day4.dat", "r")
lines = file.readlines()

grid = []

total = 0

for line in lines:
    row = [x for x in line.strip()]
    grid.append(row)
    
for y in range(len(grid)):
    for x in range(len(grid[y])):
        surrounding_rolls = 0 

        if grid[y][x] == "@":

            # top left
            if y > 0 and x > 0 and grid[y - 1][x - 1] == "@":
                surrounding_rolls += 1

            # top
            if y > 0 and grid[y - 1][x] == "@":
                surrounding_rolls += 1

            # top right  
            if y > 0 and x < len(grid[y]) - 1 and grid[y - 1][x + 1] == "@":
                surrounding_rolls += 1

            # left  
            if x > 0 and grid[y][x - 1] == "@":
                surrounding_rolls += 1

            # right
            if x < len(grid[y]) - 1 and grid[y][x + 1] == "@":
                surrounding_rolls += 1

            # bottom left
            if y < len(grid) - 1 and x > 0 and grid[y + 1][x - 1] == "@":
                surrounding_rolls += 1

            # bottom
            if y < len(grid) - 1 and grid[y + 1][x] == "@":
                surrounding_rolls += 1

            # bottom right
            if y < len(grid) - 1 and x < len(grid[y]) - 1 and grid[y + 1][x + 1] == "@":
                surrounding_rolls += 1

            if surrounding_rolls < 4:
                total += 1

print(total)