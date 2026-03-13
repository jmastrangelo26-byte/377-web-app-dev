<?php
/*************************************************************************************************
 * list_details.php
 *
 * Displays a list of of the club details. This page expects to be included within index.php.
 *************************************************************************************************/
?>


<h2>Club Details <span id="record-count"></span></h2>

<table class="table table-bordered table-hover">
    <thead class="thead-dark">
        <tr>
            <th>Competitions Attended</th>
            <th>Meetings Hosted</th>
            <th>Game Nights Hosted</th>
            <th>Total Possible Points</th>
            <th>Total Points Scored</th>
           
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
FROM club_details
SQL;

$recordCount = 0;
$result = $connection->query($sql);

$recordCount = 0;
$result = $connection->query($sql); 
while ($row = $result->fetch_assoc()){
    echo "<tr>";
    echo "<td><a href='index.php?content=club_details&id=" . $row["idclub_details"] . "'>" . $row["comps_attended"] . "</a></td>";
    echo "<td>" . $row["meetings_hosted"] . "</td>";
    echo "<td>" . $row["game_nights_hosted"] . "</td>";
    echo "<td>" . $row["total_possible_points"] . "</td>";
    echo "<td>" . $row["total_tech_support_hours"] . "</td>";
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

<a href = "index.php?content=list" class="btn btn-info" role="button">Home</a>

