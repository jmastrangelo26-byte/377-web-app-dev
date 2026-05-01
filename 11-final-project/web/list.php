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
            },
            error: function() {
                $('#events-field').html('Error loading events.');
            }
        });
    }
</script>

<body>
    <div class="container"> 
    
    <form method="post">
        Enter Month : <input type="text" id=month name="month" placeholder="Number 1-12 ">
        Enter Year : <input type="text" id=year name="year" placeholder="Number 2000-2024 ">
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
    $month = isset($_POST['month']) && !empty($_POST['month']) ? intval($_POST['month']) : 1;  

    $firstDayOfMonth = date('w', strtotime("$year-$month-01"));
    $lastDayOfMonth = intval(date('t', strtotime("$year-$month-01")));
    $date = 1; 
    $week = 0;
    
    // create a mapping of dates to events for the month so that we can easily display which days have events when we render the calendar
    // looked up on google how to create a date object from a month number so that we can display the month name instead of just the number
    $dateObj = DateTime::createFromFormat('!m', $month);
    print("<h1>{$year}</h1>");
    print("<h1>{$dateObj->format('F')}</h1>");
 
    // retrieve all the events for a month

    $map = [];

$sql = <<<SQL
SELECT *
FROM planned_items
WHERE MONTH(due_date) = $month AND YEAR(due_date) = $year
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

    <div id="events-field">
    </div>
   
</body>
</html>