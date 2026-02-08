number = 1

inner_count = 0

while True:
    inner_count = 0
    for i in range(1, 21):
        if number % i == 0:
            inner_count += 1

            if inner_count == 20:
                print(number)
                break
        else:
            break
    number += 1

