<?php

include_once("library.php");
$connection = get_connection();


// $title = $connection->real_escape_string($title);
// $description = $connection->real_escape_string($description);
// $due_date = $connection->real_escape_string($due_date);
$sql = "";

$sql = <<<SQL
SELECT *
FROM planned_items
WHERE completed = 'True'
SQL;

$result = $connection->query($sql);
$completed_items = [];

print("<div class='completed-tasks-container'>");
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $completed_items[] = $row;
        print("Task: " . $row['title'] . " - " . $row['description'] . " - Due: " . $row['due_date'] . "<br>");
    }
}else{
    print("No completed tasks to display!");
}
print("</div>");

?>

<a href="index.php?content=list" class="btn btn-secondary" role="button">Back</a>

