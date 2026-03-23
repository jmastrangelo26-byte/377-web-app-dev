<?php

/*************************************************************************************************
 * save.php
 *
 * This page saves a single member record based on the values submitted by the user 
 *************************************************************************************************/
include_once("library.php");
$connection = get_connection();

// Original issue was that percentages would only save after manually saving twice
// Used COPILOT to realize that percentages were not being cacluated before the SQL statement
// I decided to use a separate calculation page so that it could be plugged in both here and in detail to prevent this 
include("calculate.php");

// Ensure competition percentage is always derived from the latest attendance value so users don't need to save twice.
$comps_attended = 0;
$compResult = $connection->query("SELECT comps_attended FROM club_details LIMIT 1");
if ($compResult && ($row = $compResult->fetch_assoc())) {
    $comps_attended = (int) $row['comps_attended'];
}

if ($comps_attended > 0) {
    $mem_comp_percentage = round(((int) $mem_comp_attendance / $comps_attended) * 100, 2);
} else {
    $mem_comp_percentage = 0;
}

$mem_name = $connection->real_escape_string($mem_name);
$mem_status = $connection->real_escape_string($mem_status);
$mem_meeting_attendance = $connection->real_escape_string($mem_meeting_attendance);
$mem_meeting_percentage = $connection->real_escape_string($mem_meeting_percentage);
$mem_game_attendance = $connection->real_escape_string($mem_game_attendance);
$mem_game_percentage = $connection->real_escape_string($mem_game_percentage);
$mem_comp_attendance = $connection->real_escape_string($mem_comp_attendance);
$mem_comp_percentage = $connection->real_escape_string($mem_comp_percentage);
$mem_points_scored = $connection->real_escape_string($mem_points_scored);
$mem_points_percentage = $connection->real_escape_string($mem_points_percentage);
$mem_hours_support = $connection->real_escape_string($mem_hours_support);

$sql = "";

if ($id == ""){
    $sql = <<<SQL
    INSERT INTO member_data (mem_name, mem_status, mem_meeting_attendance, mem_meeting_percentage, mem_game_attendance, mem_game_percentage, mem_comp_attendance, mem_comp_percentage, mem_points_scored, mem_points_percentage, mem_hours_support)
    VALUES ('$mem_name', '$mem_status', '$mem_meeting_attendance', $mem_meeting_percentage, '$mem_game_attendance', '$mem_game_percentage', '$mem_comp_attendance', '$mem_comp_percentage', '$mem_points_scored', '$mem_points_percentage', '$mem_hours_support')
    SQL;
}else{
    $sql =<<<SQL
    UPDATE member_data
    SET mem_name = '$mem_name',
        mem_status = '$mem_status',
        mem_meeting_attendance = '$mem_meeting_attendance',
        mem_meeting_percentage = $mem_meeting_percentage,
        mem_game_attendance = '$mem_game_attendance',
        mem_game_percentage = '$mem_game_percentage',
        mem_comp_attendance = '$mem_comp_attendance',
        mem_comp_percentage = '$mem_comp_percentage',
        mem_points_scored = '$mem_points_scored',
        mem_points_percentage = '$mem_points_percentage',
        mem_hours_support = '$mem_hours_support'        
    WHERE idmember_data = $id
    SQL;
}

if ($connection->query($sql)){
    // http_response_code(200);
    $id = $connection->insert_id; // Get the ID of the newly inserted record
    print($id);
}else{
    http_response_code(401);
}   