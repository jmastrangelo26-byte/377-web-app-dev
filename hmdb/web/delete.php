<?php

/*************************************************************************************************
 * library.php
 *
 * This page saves a deletes a movie record based on the values submitted by the user 
 *************************************************************************************************/

include("library.php");

$connection = get_connection();

$delete =<<<SQL
DELETE FROM movie
WHERE mov_id = '$id'
SQL;

$connection->query($delete);
header('Location: index.php?content=list');