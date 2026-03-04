count = 0; 

for i in range(1, 346000):
    if i % 2 == 1:
        count += i*i

print(count)