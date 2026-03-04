<?php

/*************************************************************************************************
 * library.php
 *
 * This page saves a single movie record based on the values submitted by the user 
 *************************************************************************************************/

include("library.php");
$connection = get_connection();
$title = $connection->real_escape_string($title);
$genre = $connection->real_escape_string($genre);
$rating = $connection->real_escape_string($rating);
$mpaa = $connection->real_escape_string($mpaa);
$duration = $connection->real_escape_string($duration);
$release_year = $connection->real_escape_string($release_year);

$sql = "";

if ($id != ""){
    $sql = <<<SQL
    INSERT INTO movie (MOV_TITLE, MOV_GENRE, MOV_RATING, MOV_MPAA, MOV_DURATION, MOV_RELEASE_YEAR)
    VALUES ('$title', '$genre', $rating, '$mpaa', $duration, $release_year)
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