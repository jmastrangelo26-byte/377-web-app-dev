<?php

/*************************************************************************************************
 * list.php
 *
 * Displays a list of movies. This page expects to be included within index.php.
 *************************************************************************************************/

?>

<h2>All Data<span id="record-count"></span></h2>

<a href='index.php?content=list'>All</a>

<table class="table table-bordered table-hover">
    <thead class="thead-dark">
        <tr>
            <th>Member Name</th>
            <th>Member Status</th>
            <th>Meeting Attendance</th>
            <th>% of Meetings Attended</th>
            <th>Game Nights Attended</th>
            <th>% of Game Nights Attended</th>
            <th>Competitions Attended</th>
            <th>% of Competitions Attended</th>
            <th>Points Scored</th>
            <th>Competition Accuracy</th>
            <th>Hours Spent at Tech Support</th>

        </tr>
    </thead>
    <tbody>

<?php

$connection = get_connection();

if (!isset($filter)){
    $filter = '';
} else {
    $filter = $connection->real_escape_string($filter);
}

$sql =<<<SQL
 SELECT *
   FROM member_data
SQL;

$recordCount = 0;
$result = $connection->query($sql);
while ($row = $result->fetch_assoc()){
    echo "<tr>";
    echo "<td><a href='index.php?content=detail&id=". $row["idmember_data"] . "'>" . $row["mem_name"] . "</a></td>";
    echo "<td>" . $row["mem_status"] . "</td>";
    echo "<td>" . $row["mem_meeting_attendance"] . "</td>";
    echo "<td>" . $row["mem_meeting_percentage"] . "</td>";
    echo "<td>" . $row["mem_game_attendance"] . "</td>";
    echo "<td>" . $row["mem_game_percentage"] . "</td>";
    echo "<td>" . $row["mem_comp_attendance"] . "</td>";
    echo "<td>" . $row["mem_comp_percentage"] . "</td>";
    echo "<td>" . $row["mem_points_scored"] . "</td>";
    echo "<td>" . $row["mem_points_percentage"] . "</td>";
    echo "<td>" . $row["mem_hours_support"] . "</td>";
    echo "</tr>";

    $recordCount++;
}

?>

    </tbody>
</table>

<?php

$code =<<<JS
<script>
document.getElementById('record-count').innerHTML = '(' + $recordCount + ' records)';
</script>
JS;

echo $code;

?>