<?php

/*************************************************************************************************
 * detail.php
 *
 * Displays the details for a single movie. This page expects to be included within index.php.
 *************************************************************************************************/

$mem_name = "";
$mem_status = "";
$mem_meeting_attendance = "";
$mem_meeting_percentage = "";
$mem_game_attendance = "";
$mem_comp_attendance = "";
$mem_comp_percentage = "";
$mem_points_scored = "";
$mem_points_percentage = "";
$mem_hours_support = "";


if (isset($id)){
    $sql =<<<SQL
    SELECT *
    FROM member_data
    WHERE idmember_data = $id
    SQL;

    $connection = get_connection();

    // Run the query on the database
    $result = $connection->query($sql);

    // Store the ONE result in an associative array
    $row = $result->fetch_assoc();

    $id = $row["idmember_data"];
}


?>

<h2><?php echo $title; ?></h2>

<form action="save.php" method="POST">

    <input type="hidden" class="form-control" name="id" value="<?php echo $id; ?>">


    <div class="mb-3">
        <label for="title" class="form-label">Member's Name</label>
        <input type="text" class="form-control" name="title" value="<?php echo $mem_name; ?>">
    </div>

    <div class="mb-3">
        <label for="genre" class="form-label">Member's Status</label>
        <input type="text" class="form-control" name="genre" value="<?php echo $mem_status; ?>">
    </div>

    <div class="mb-3">
        <label for="rating" class="form-label">Meeting Attendance</label>
        <input type="text" class="form-control" name="rating" value="<?php echo $mem_meeting_attendance; ?>">
    </div>

    <div class="mb-3">
        <label for="rating" class="form-label">Meeting Attendance Percentage</label>
        <input type="text" class="form-control" name="rating" value="<?php echo $mem_meeting_percentage; ?>">
    </div>


    <div class="mb-3">
        <label for="duration" class="form-label">Game Nights Attended</label>
        <input type="text" class="form-control" name="duration" value="<?php echo $mem_game_attendance; ?>">
    </div>

    <div class="mb-3">
        <label for="duration" class="form-label">Game Nights Percentage</label>
        <input type="text" class="form-control" name="duration" value="<?php echo $mem_game_percentage; ?>">
    </div>


    <div class="mb-3">
        <label for="duration" class="form-label">Competition Attendance</label>
        <input type="text" class="form-control" name="duration" value="<?php echo $mem_comp_attendance; ?>">
    </div>

    <div class="mb-3">
        <label for="duration" class="form-label">Competition Attendance Percentage</label>
        <input type="text" class="form-control" name="duration" value="<?php echo $mem_comp_percentage; ?>">
    </div>

    <div class="mb-3">
        <label for="duration" class="form-label">Points Scored</label>
        <input type="text" class="form-control" name="duration" value="<?php echo $mem_comp_percentage; ?>">
    </div>

    <div class="mb-3">
        <label for="duration" class="form-label">Competition Accuracy</label>
        <input type="text" class="form-control" name="duration" value="<?php echo $mem_points_percentage; ?>">
    </div>

    <div class="mb-3">
        <label for="duration" class="form-label">Member Hour Support</label>
        <input type="text" class="form-control" name="duration" value="<?php echo $mem_points_percentage; ?>">
    </div>



    <button type="submit" class="btn btn-primary">Save</button>
    <button type="delete.php?id=<?php echo $id; ?>" class="btn btn-danger" role="button">Delete</button>
    <a href="index.php?content=list" class="btn btn-secondary" role="button">Cancel</a>
</form>