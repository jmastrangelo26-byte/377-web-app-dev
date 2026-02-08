total = 0
current_sum = 0
prev_digit = 1
curr_digit = 2

sum = 0


while sum <= 4000000:    
    sum = 0
    sum = prev_digit + curr_digit
    
    prev_digit = curr_digit
    curr_digit = sum

    if sum > 4000000:
        break
    
    if sum % 2 == 0:
        total += sum

    
    
   

    
    
    print(sum)


print('total', total + 2)




