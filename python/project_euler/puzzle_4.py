def convert_to_string(number):
    string_number = str(number)

    reversed_string = string_number[::-1]

    if reversed_string == string_number:
        return True
    return False

palindrome = 0
total = 0
for i in range(100, 1000):

    for j in range(100, 1000):
        total = i * j
        if convert_to_string(total):

            if total > palindrome:
                palindrome = total

print(palindrome)
