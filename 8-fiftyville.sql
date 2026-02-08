-- This query tells me that there were three witnesses in the crime
SELECT id, description
FROM crime_scene_reports
WHERE month = 7
AND day = 28
AND year = 2023
AND street = 'Humphrey Street'
;

-- By reading all of the interviews, I can easily determine the relevant interviews which are from Ruth, Eugene, and Raymond
SELECT *
FROM interviews
WHERE day = 28
AND month = 7
AND year = 2023
;

-- The interview told me that the thief left the bakery within 10 minutes of the theft. I use this information to find possible license plates 
-- of the getaway vehicle 
SELECT *
FROM bakery_security_logs AS bakery
WHERE day = 28
AND month = 7
AND year = 2023
AND hour = 10
AND minute > 14 AND minute < 30
;

-- The interviews also told me where and how the thief withdrew money from an ATM. I use this information to find possible bank_account numbers
-- for the thief
SELECT *
FROM atm_transactions AS a
JOIN bank_accounts ON a.account_number = bank_accounts.account_number
JOIN people ON bank_accounts.person_id = people.id
WHERE day = 28
AND month = 7
AND year = 2023
AND atm_location = 'Leggett Street'
AND transaction_type = 'withdraw'
;

-- The interviews also told me the thief made a phone call that lasted less than a minute. I use this information to filter down possible phone numbers
-- of the thief 
SELECT *
FROM phone_calls
WHERE day = 28
AND month = 7
AND year = 2023
AND duration < 60
;

-- This query tells me the earliest flight that was taken out of Fiftyville.
SELECT *
FROM flights
WHERE day = 29
AND month = 7
AND year = 2023
AND origin_airport_id = 8
ORDER BY hour, minute
;

-- Finds out the destination of the airport that the thief took.
SELECT full_name, city
FROM airports
WHERE id = 4
;

-- Combines all the queries above to isolate the thief
SELECT *
FROM people
JOIN phone_calls ON phone_calls.caller = people.phone_number
JOIN bakery_security_logs b ON b.license_plate = people.license_plate
JOIN passengers ON passengers.passport_number = people.passport_number
JOIN flights ON passengers.flight_id = flights.id
JOIN bank_accounts ON bank_accounts.person_id = people.id
JOIN atm_transactions AS a ON a.account_number = bank_accounts.account_number

WHERE phone_calls.duration < 60
AND phone_calls.day > 27
AND phone_calls.day < 29 

AND b.day = 28 
AND b.month = 7
AND b.year = 2023

AND flights.id = 36
AND destination_airport_id = 4
AND flights.hour = 8

AND b.license_plate = people.license_plate
AND b.hour = 10
AND b.minute > 15 AND b.minute < 25

AND atm_location = 'Leggett Street'
AND transaction_type = 'withdraw'
;

-- Based off the receiver of the call made by the thief, we can plug the receiver's number in to find out their name
SELECT name
FROM people
WHERE phone_number = '(375) 555-8161'
;
-- Solved Puzzle: Bruce stole the duck, escaped to NYC, and then was picked up by his accomplice, Robin
