<?php

/* 
This file is responsible for handling the form submission for adding or editing an assignment or event.
It takes the data from the form, sanitizes it, and then either 
inserts a new record into the database or updates an existing record based on whether an ID is provided. 
After saving the data, it redirects back to the list of tasks.
*/

include_once("library.php");
$connection = get_connection();

$title = $connection->real_escape_string($title);
$description = $connection->real_escape_string($description);
$item_type = $connection->real_escape_string($item_type);
$due_date = $connection->real_escape_string($due_date);
$start_time = $connection->real_escape_string($start_time);
$end_time = $connection->real_escape_string($end_time);
$completed = $connection->real_escape_string($completed);
$priority = $connection->real_escape_string($priority);

$sql = "";

if ($id == ""){
    $sql = <<<SQL
    INSERT INTO planned_items (title, description, item_type, due_date, start_time, end_time, priority, completed)
    VALUES ('$title', '$description', '$item_type', '$due_date', '$start_time', '$end_time', '$priority', '$completed')
    SQL;
}else{
    $sql =<<<SQL
    UPDATE planned_items
    SET title = '$title',
        description = '$description',
        item_type = '$item_type',
        due_date = '$due_date',
        start_time = '$start_time',
        end_time = '$end_time',
        priority = '$priority',
        completed = '$completed'
    WHERE id = $id
    SQL;
} 

if ($connection->query($sql)){
    // http_response_code(200);
    $id = $connection->insert_id; // Get the ID of the newly inserted record
    print($id);
}else{
    http_response_code(401);
} 

header('Location: index.php?content=list');



