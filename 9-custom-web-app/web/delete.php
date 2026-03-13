<?php

/*************************************************************************************************
 * library.php
 *
 * This page saves a deletes a member record based on the values submitted by the user 
 *************************************************************************************************/

include("library.php");

$connection = get_connection();

$delete =<<<SQL
DELETE FROM member_data
WHERE idmember_data = '$id'
SQL;

$connection->query($delete);
header('Location: index.php?content=list');