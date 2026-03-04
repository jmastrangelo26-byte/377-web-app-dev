<?php

/*************************************************************************************************
 * library.php
 *
 * This page saves a single movie record based on the values submitted by the user 
 *************************************************************************************************/

include("library.php");
$connection = get_connection();
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

if ($id != ""){
    $sql = <<<SQL
    INSERT INTO movie (mem_name, mem_status, mem_meeting_attendance, mem_meeting_percentage, mem_game_attendance, mem_game_percentage, mem_comp_attendance, mem_comp_percentage, mem_points_scored, mem_points_percentage, mem_hours_support)
    VALUES ('$mem_name', '$mem_status', $mem_meeting_attendance, '$mem_meeting_percentage', '$mem_game_attendance', '$mem_game_percentage', '$mem_comp_attendance', '$mem_comp_percentage', '$mem_points_scored', '$mem_points_percentage', '$mem_hours_support')
    SQL;
}else{
    $sql =<<<SQL
    UPDATE movie
    SET mov_title = '$title',
        mov_genre = '$genre',
        mov_rating = $rating,
        mov_mpaa = '$mpaa',
        mov_duration = $duration,
        mov_release_year = $release_year
    WHERE mov_id = $id
    SQL;
}

$connection->query($sql);
header('Location: index.php?content=list');