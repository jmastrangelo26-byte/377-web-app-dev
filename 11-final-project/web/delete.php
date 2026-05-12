<?php
/* This file is responsible for deleting a task when the "Delete" button is clicked */


include_once("library.php");
$connection = get_connection();

$sql = <<<SQL
DELETE FROM planned_items
WHERE id = $id
SQL;

if ($connection->query($sql)){
    http_response_code(200);
}else{
    http_response_code(401);
}
header('Location: index.php?content=list');