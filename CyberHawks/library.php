<?php

/*************************************************************************************************
 * library.php
 *
 * Common functions used across the hMDB website
 *
 * This page will use the optional 'nav' request parameter to include a specific page. If the
 * parameter is not specified then the default list page will be included.
 *************************************************************************************************/

extract($_REQUEST);

function get_connection(){
    $servername = "localhost";
    $username = "root";
    $password = "password";
    $dbname = "CyberHawks";

    // Connect to the database and make sure it was successful
    $connection = new mysqli($servername, $username, $password, $dbname);
    if ($connection->connect_error){
        die("Connection failed: " . $connection->connect_error);
    }

    return $connection;
}