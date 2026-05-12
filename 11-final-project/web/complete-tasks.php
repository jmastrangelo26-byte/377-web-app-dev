<?php

/* 
This file is responsible for marking a task as completed when the "Complete!"
button is clicked on the detail page. It updates the 'completed' field in the database to 
'True' for the specified task ID and then redirects back to the list of tasks. 
*/

include_once("library.php");
$connection = get_connection();


$set = <<<SQL
UPDATE planned_items
SET completed = 'True'
WHERE id = $id
SQL;

$connection->query($set);
header('Location: index.php?content=list');