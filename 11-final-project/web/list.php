<!DOCTYPE html>
<html>


<script> 
    // makes a call to a page that will generate all events for a given date and renders them in a portion of the page
    function loadDateEvents(date){
        $.ajax({
            url: 'events.php?date=' + date,
            method: 'GET',
            success: function(response) {
                $('#events-field').html(response);
                window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
        });
            },
            error: function() {
                $('#events-field').html('Error loading events.');
            }
        });
    }
        

    function advanceMonth(currentMonth, currentYear) {
        let month = currentMonth;
        let year = currentYear;
        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
        document.getElementById('month').value = month;
        document.getElementById('year').value = year;
        
        // this submits the form which will cause the page to reload with the new month and year values and render a new calendar for the user
        document.forms[0].submit();
    }

    function retreatMonth(currentMonth, currentYear) {
        let month = currentMonth;
        let year = currentYear;
        month--;
        if (month < 1) {
            month = 12;
            year--;
        }
        document.getElementById('month').value = month;
        document.getElementById('year').value = year;
        document.forms[0].submit();

    }

</script>

<body>
    <div class="calendar-layout">
        <div class="container"> 
        
        <form method="post">
            <label for="month">Enter Month</label>
            <select id="month" name="month">
                <option value="">Select Month</option>
                <?php
                    for ($m = 1; $m <= 12; $m++) {
                        $monthName = date('F', mktime(0, 0, 0, $m, 10));
                        echo "<option value='$m'>$monthName</option>";
                    }
                ?>
            </select>
            <label for="year">Year</label>
            <select id="year" name="year">
                <option value="">Select Year</option>
                <?php
                    for ($y = 2000; $y <= 2100; $y++) {
                        echo "<option value='$y'>$y</option>";
                    }
                ?>
            </select>
            <button type="submit">Submit</button>
        </form>

    
<?php
    include_once("library.php");
    $connection = get_connection();


    print('<table>');
    print('<thead>');
    print('<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>');
    print('</thead>');
    print('<tbody>');
   
    // these next two variables retrieve user input for the date and year to load a desired calendar for the user
    $year = isset($_POST['year']) && !empty($_POST['year']) ? intval($_POST['year']) : date('Y');    
    $month = isset($_POST['month']) && !empty($_POST['month']) ? intval($_POST['month']) : date('m');  

    $firstDayOfMonth = date('w', strtotime("$year-$month-01"));
    $lastDayOfMonth = intval(date('t', strtotime("$year-$month-01")));
    $date = 1; 
    $week = 0;
    
    // create a mapping of dates to events for the month so that we can easily display which days have events when we render the calendar
    // looked up on google how to create a date object from a month number so that we can display the month name instead of just the number
    $dateObj = DateTime::createFromFormat('!m', $month);
    print("<h1>{$year}</h1>");
    print("<h1><button onclick='retreatMonth($month, $year)'>&#9664;</button> {$dateObj->format('F')} <button onclick='advanceMonth($month, $year)'>&#9654;</button></h1>");
 
    // retrieve all the events for a month

    $map = [];

$sql = <<<SQL
SELECT *
FROM planned_items
WHERE MONTH(due_date) = $month AND YEAR(due_date) = $year
AND completed = 'False'
SQL;

    // add all events for a single day to a mapping so that we can easily display which days have events when we render the calendar
    $events = [];
    $result = $connection->query($sql);
    while ($row = $result->fetch_assoc()) {
        $dateKey = date('Y-m-d', strtotime($row['due_date']));
        $map[$dateKey][] = $row;
    }

    while ($date <= $lastDayOfMonth){
        print('<tr>');
        for ($day = 0; $day < 7; $day++){
            print('<td>');
            if ($week > 0 || $day >= $firstDayOfMonth){
                if (($week > 0 || $day >= $firstDayOfMonth) && $date <= $lastDayOfMonth){
                    print($date);
                    print('<br>');
                    $dateKey = sprintf('%04d-%02d-%02d', $year, $month, $date);

                    // If any events for a date, a button is displayed that allows the user to view all events
                    if (isset($map[$dateKey])) {
                        // pass datekey into a function that will render a separate portion of the page with all the events
                        print("<input type='button' value='View Events' onclick='loadDateEvents(\"$dateKey\")'>");
                    }
                }
                $date++;
            }
            print('</td>');
        }
        print('</tr>');
        $week++;
    }
    print('</tbody>');
    print('</table>');
?>
    </div>

        <div class="upcoming-events">
<?php
    $sql = <<<SQL
    SELECT title, description, due_date
    FROM planned_items
    WHERE completed = 'False'
    AND due_date < CURDATE()
    OR due_date > CURDATE() AND due_date < DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    ORDER BY due_date ASC
    SQL;

    $result = $connection->query($sql);
    print('<h2>Upcoming Events</h2>');
    
    if ($result->num_rows == 0) {
        print('<p>No upcoming events.</p>');
    } else {
        while ($row = $result->fetch_assoc()) {
            if ($row['due_date'] < date('Y-m-d')) {
                print("<p style='color: red;'>{$row['title']} - {$row['description']} - Due: {$row['due_date']}</p>");
            } else {
                print("<p>{$row['title']} - {$row['description']} - Due: {$row['due_date']}</p>");
            }
        }
    }
?>
    </div>
    </div>
    <div id="events-field"></div>
   
</body>
</html>