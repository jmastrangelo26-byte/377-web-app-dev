<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            max-width: 800px;
            margin: 40px auto;
            padding: 30px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        }

        .container h1{
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }

        .container h2{
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            color: #555;
        }

        .container table {
            width: 100%;
            border-collapse: collapse;
            background: #fafafa;
        }

        .container thead {
            background: #3b82f6;
            color: white;
        }

        .container th {
            padding: 15px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            border: 1px solid #ddd;
        }

        .container td {
            padding: 20px;
            height: 100px;
            border: 1px solid #ddd;
            text-align: right;
            vertical-align: top;
            font-size: 18px;
            font-weight: 600;
            color: #333;
            background: white;
            position: relative;
        }

        .container td:hover {
            background: #f0f4ff;
            transition: background 0.2s ease;
        }

        /* Alternate weekend styling */
        .container tbody tr td:nth-child(1),
        .container tbody tr td:nth-child(7) {
            background: #f5f5f5;
        }

        /* Disabled/adjacent month days */
        .container td.disabled {
            color: #bbb;
            background: #fafafa;
            font-weight: 400;
        }

        /* Today highlight */
        .container td.today {
            background: #3b82f6;
            color: white;
            border-radius: 8px;
            font-weight: bold;
        }
    </style>
</head>

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
        $map[$row['due_date']] = $row;  
    }

    while ($date <= $lastDayOfMonth){
        print('<tr>');
        for ($day = 0; $day < 7; $day++){
            print('<td>');
            if ($week > 0 || $day >= $firstDayOfMonth){
                if (($week > 0 || $day >= $firstDayOfMonth) && $date <= $lastDayOfMonth){
                    print($date);
                    print('<br>');
                    print(isset($map["$year-$month-$date"]) ? $map["$year-$month-$date"]['title'] : '');
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