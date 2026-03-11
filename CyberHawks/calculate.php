<?php 

// calculate % of meetings attended
$meetings_hosted = 0; 
$sql =<<<SQL
SELECT meetings_hosted
FROM club_details
LIMIT 1
SQL;

$result = $connection->query($sql);
if ($result && ($row = $result->fetch_assoc())) {
    $meetings_hosted = (int) $row['meetings_hosted'];
}

if ($meetings_hosted > 0) {
    $mem_meeting_percentage = ((int) $mem_meeting_attendance / $meetings_hosted) * 100;
} else {
    $mem_meeting_percentage = 0;
}

// calculate % of game nights attended
$game_nights_hosted = 0;
$sql =<<<SQL
SELECT game_nights_hosted
FROM club_details
LIMIT 1
SQL;        

$result = $connection->query($sql);
if ($result && ($row = $result->fetch_assoc())) {
    $game_nights_hosted = (int) $row['game_nights_hosted'];
}   

if ($game_nights_hosted > 0) {
    $mem_game_percentage = ((int) $mem_game_attendance / $game_nights_hosted) * 100;
} else {
    $mem_game_percentage = 0;
}

// calculate % of competitions attended
$comps_attended = 0;
$sql =<<<SQL
SELECT comps_attended
FROM club_details
LIMIT 1
SQL;

$result = $connection->query($sql);
if ($result && ($row = $result->fetch_assoc())) {
    $comps_attended = (int) $row['comps_attended'];
}

if ($comps_attended > 0) {
    $mem_comp_percentage = ((int) $mem_comp_attendance / $comps_attended) * 100;
} else {
    $mem_comp_percentage = 0;
}

$mem_comp_percentage = round($mem_comp_percentage, 2);

// calculate competition accuracy
$total_possible_points = 0;
$sql =<<<SQL
SELECT total_possible_points
FROM club_details
LIMIT 1
SQL;

$result = $connection->query($sql);
if ($result && ($row = $result->fetch_assoc())) {
    $total_possible_points = (int) $row['total_possible_points'];
}

if ($total_possible_points > 0) {
    $mem_points_percentage = ((int) $mem_points_scored / $total_possible_points) * 100;
} else {
    $mem_points_percentage = 0;
}


