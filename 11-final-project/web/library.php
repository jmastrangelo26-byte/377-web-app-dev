
<?php   
/*
This file contains common functions and database connection logic that can be used 
across multiple PHP files in the application.
*/



extract($_REQUEST);

function get_connection(){
    $servername = "localhost";
    $username = "root";
    $password = "password";
    $dbname = "assignment_planner";

    // Connect to the database and make sure it was successful
    $connection = new mysqli($servername, $username, $password, $dbname);
    if ($connection->connect_error){
        die("Connection failed: " . $connection->connect_error);
    }
    return $connection;
}