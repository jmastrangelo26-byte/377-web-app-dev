<?php

/*************************************************************************************************
 * list.php
 *
 * Displays a list of movies. This page expects to be included within index.php.
 *************************************************************************************************/

?>

<h2>Movies <span id="record-count"></span></h2>

<a href='index.php?content=list'>All</a>

<?php

for ($i = 1; $i < 10; $i++){
    echo "<a href='index.php?content=list&filter=$i'>$i</a> ";
}

for ($i = 0; $i < 26; $i++){
    $letter = chr($i + ord("A"));
    echo "<a href='index.php?content=list&filter=$letter'>$letter</a> ";
}

?>

<table class="table table-bordered table-hover">
    <thead class="thead-dark">
        <tr>
            <th>Title</th>
            <th>Duration</th>
            <th>Release</th>
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
   FROM movie
  WHERE mov_title LIKE '$filter%'
  ORDER BY mov_title
SQL;

$recordCount = 0;
$result = $connection->query($sql);
while ($row = $result->fetch_assoc()){
    echo "<tr>";
    echo "<td><a href='index.php?content=detail&id=". $row["idmember_data"] . "'>" . $row["mem_name"] . "</a></td>";
    echo "<td>" . $row["mem_status"] . "</td>";
    echo "<td>" . $row["movmem_meeting_attendance_release_year"] . "</td>";
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