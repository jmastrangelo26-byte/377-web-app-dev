<?php

include_once("library.php");
$connection = get_connection();

    
$set = <<<SQL
UPDATE planned_items
SET completed = 'True'
WHERE id = $id
SQL;

$connection->query($set);
header('Location: index.php?content=list');