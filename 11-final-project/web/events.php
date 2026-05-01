<?php

// Take a specific date and return all events that occur on that date
include_once("library.php");
$connection = get_connection();

$sql = <<<SQL
SELECT *
FROM planned_items
-- Uses the "like" operator to account for the fact that times may be different for different events on the same day
WHERE due_date like '$date%'
SQL;

$events = [];
$result = $connection->query($sql);
print('<div class="events-container">');
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
    // passes the name of the event as a link to the detail page for that event so that the user can click on it and view more information about the event
    print("<a href='index.php?content=detail&id={$row['id']}'>{$row['title']}-{$row['description']}</a><br>");
}
print('</div>');

