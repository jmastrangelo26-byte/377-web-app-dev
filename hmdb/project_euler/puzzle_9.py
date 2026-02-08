for a in range(1, 1001):

    for b in range(1, 1001):

        c = 1000 - a - b
        if c > b and a*a + b*b == c*c:
            final_a = a
            final_b = b
            final_c = c

            break 
        

print(final_a, final_b, final_c)

print(final_a * final_b * final_c)