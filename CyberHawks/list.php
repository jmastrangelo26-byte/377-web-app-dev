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