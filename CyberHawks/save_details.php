<?php

include("library.php");
$connection = get_connection();

// Escape values for safe SQL usage
$comps_attended = $connection->real_escape_string($comps_attended);
$meetings_hosted = $connection->real_escape_string($meetings_hosted);
$game_nights_hosted = $connection->real_escape_string($game_nights_hosted);
$total_possible_points = $connection->real_escape_string($total_possible_points);
$total_tech_support_hours = $connection->real_escape_string($total_tech_support_hours);

$sql = "";

// Determine whether to insert a new record or update an existing one
if ($id === ""){
    $sql = <<<SQL
    INSERT INTO club_details (comps_attended, meetings_hosted, game_nights_hosted, total_possible_points, total_tech_support_hours)
    VALUES ('$comps_attended', '$meetings_hosted', '$game_nights_hosted', '$total_possible_points', '$total_tech_support_hours')
    SQL;
} else {
    $sql = <<<SQL
    UPDATE club_details
    SET comps_attended = '$comps_attended',
        meetings_hosted = '$meetings_hosted',
        game_nights_hosted = '$game_nights_hosted',
        total_possible_points = '$total_possible_points',
        total_tech_support_hours = '$total_tech_support_hours'
    WHERE idclub_details = $id
    SQL;
}

$connection->query($sql);
header('Location: index.php?content=list_details');