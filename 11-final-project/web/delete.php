<?php

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