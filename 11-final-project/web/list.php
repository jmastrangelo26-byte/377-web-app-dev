<!DOCTYPE html>
<html>

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
    // temporary variables will be replaced by user input 
    $year = isset($_POST['year']) && !empty($_POST['year']) ? intval($_POST['year']) : date('Y');    
    $month = isset($_POST['month']) && !empty($_POST['month']) ? intval($_POST['month']) : 1;  

    $firstDayOfMonth = date('w', strtotime("$year-$month-01"));
    $lastDayOfMonth = intval(date('t', strtotime("$year-$month-01")));
    $date = 1; 
    $week = 0;
    
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

    $result = $connection->query($sql);
    while ($row = $result->fetch_assoc()) {
        // Must exract y-m-d because datetime stores the hour and minute, which we do not want
        $dateKey = date('Y-m-d', strtotime($row['due_date']));
        $map[$dateKey] = $row;  
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
                    print(isset($map[$dateKey]) ? $map[$dateKey]['title'] : '');
                    $date++;
                }
            }
            print('</td>');
        }
        $week++;
    }
    print('</tbody>');
    print('</table>');
?>
    </div>
   
</body>
</html>