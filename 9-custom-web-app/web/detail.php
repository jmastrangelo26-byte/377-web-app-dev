<?php

/*************************************************************************************************
 * detail.php
 *
 * Displays the details for a single member. This page expects to be included within index.php.
 *************************************************************************************************/

$mem_name = "";
$mem_status = "";
$mem_meeting_attendance = "";
$mem_meeting_percentage = "";
$mem_game_attendance = "";
$mem_game_percentage = "";
$mem_comp_attendance = "";
$mem_comp_percentage = "";
$mem_points_scored = "";
$mem_points_percentage = "";
$mem_hours_support = "";
$date_joined = "";

include_once("library.php"); // include_once makes sure that the connection is not redeclared multiple times
$connection = get_connection();

if (isset($id)){
    $sql =<<<SQL
    SELECT *
    FROM member_data
    WHERE idmember_data = $id
    SQL;

    // Run the query on the database
    $result = $connection->query($sql);

    // Store the ONE result in an associative array
    $row = $result->fetch_assoc();

    $id = $row["idmember_data"];

    $mem_name = $row['mem_name'];
    $mem_status = $row['mem_status'];
    $mem_meeting_attendance = $row['mem_meeting_attendance'];
    $mem_meeting_percentage = $row['mem_meeting_percentage'];
    $mem_game_attendance = $row['mem_game_attendance'];
    $mem_game_percentage = $row['mem_game_percentage'];
    $mem_comp_attendance = $row['mem_comp_attendance'];
    $mem_comp_percentage = $row['mem_comp_percentage'];
    $mem_points_scored = $row['mem_points_scored'];
    $mem_points_percentage = $row['mem_points_percentage'];
    $mem_hours_support = $row['mem_hours_support'];
    $date_joined = $row['date_joined'];
}
else
{
    $id = "";
}

// Code that determines the calculated percentages
include("calculate.php");

?>

<h2><?php echo $mem_name; ?></h2>

<form action="save.php" method="POST">

    <input type="hidden" class="form-control" name="id" id="id" value="<?php echo $id; ?>">


    <div class="mb-3">
        <label for="mem_name" class="form-label">Member's Name</label>
        <input id="mem_name" type="text" class="form-control" name="mem_name" id="mem_name" value="<?php echo $mem_name; ?>">
    </div>

    <div class="mb-3">
        <label for="mem_status" class="form-label">Member's Status</label>
        <!-- Looked up a select tag to figure out how to implement a dropdown -->
        <select id="mem_status" class="form-control" name="mem_status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Alumni">Alumni</option>
            <option value="Pending">Pending</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="mem_meeting_attendance" class="form-label">Meeting Attendance</label>
        <input id="mem_meeting_attendance" type="number" min="0" step="1" class="form-control" name="mem_meeting_attendance" id="mem_meeting_attendance" value="<?php echo $mem_meeting_attendance; ?>">
    </div>

    <div class="mb-3">
        <label for="mem_meeting_percentage" class="form-label">Meeting Attendance Percentage</label>
        <input id="mem_meeting_percentage" type="number" min="0" max="100" step="0.1" class="form-control" name="mem_meeting_percentage" id="mem_meeting_percentage" value="<?php echo $mem_meeting_percentage; ?>" readonly>
    </div>

    <div class="mb-3">
        <label for="mem_game_attendance" class="form-label">Game Nights Attended</label>
        <input id="mem_game_attendance" type="number" min="0" step="1" class="form-control" name="mem_game_attendance" id="mem_game_attendance" value="<?php echo $mem_game_attendance; ?>">
    </div>

    <div class="mb-3">
        <label for="mem_game_percentage" class="form-label">Game Nights Percentage</label>
        <input id="mem_game_percentage" type="number" min="0" max="100" step="0.1" class="form-control" name="mem_game_percentage" id="mem_game_percentage" value="<?php echo $mem_game_percentage; ?>" readonly>
    </div>

    <div class="mb-3">
        <label for="mem_comp_attendance" class="form-label">Competition Attendance</label>
        <input id="mem_comp_attendance" type="number" min="0" step="1" class="form-control" name="mem_comp_attendance" id="mem_comp_attendance" value="<?php echo $mem_comp_attendance; ?>">
    </div>

    <div class="mb-3">
        <label for="mem_comp_percentage" class="form-label">Competition Attendance Percentage</label>
        <input id="mem_comp_percentage" type="number" min="0" max="100" step="0.1" class="form-control" name="mem_comp_percentage" id="mem_comp_percentage" value="<?php echo $mem_comp_percentage; ?>" readonly>
    </div>

    <div class="mb-3">
        <label for="mem_points_scored" class="form-label">Points Scored</label>
        <input id="mem_points_scored" type="number" min="0" step="1" class="form-control" name="mem_points_scored" id="mem_points_scored" value="<?php echo $mem_points_scored; ?>">
    </div>

    <div class="mb-3">
        <label for="mem_points_percentage" class="form-label">Competition Accuracy</label>
        <input id="mem_points_percentage" type="number" min="0" max="100" step="0.1" class="form-control" name="mem_points_percentage" id="mem_points_percentage" value="<?php echo $mem_points_percentage; ?>" readonly>
    </div>

    <div class="mb-3">
        <label for="mem_hours_support" class="form-label">Member Hour Support</label>
        <input id="mem_hours_support" type="number" min="0" step="0.1" class="form-control" name="mem_hours_support" id="mem_hours_support" value="<?php echo $mem_hours_support; ?>">
    </div>

    <div class="mb-3">
        <label for="date_joined" class="form-label">Date Joined</label>
        <input id="date_joined" type="date" class="form-control" name="date_joined" id="date_joined" value="<?php echo $date_joined; ?>">
    </div>

    <button type="button" class="btn btn-primary" onclick="save()">Save</button>
    <a href="delete.php?id=<?php echo $id; ?>" class="btn btn-danger" role="button">Delete</a>
    <a href="index.php?content=list" class="btn btn-secondary" role="button">Cancel</a>
</form>

<?php
$connection->close();
?>

<script>

function save() {
    var settings = {
        'async': true,
        'url': 'save.php?id=' + $('#id').val() + 
            '&mem_name=' + $('#mem_name').val() + 
            '&mem_status=' + $('#mem_status').val() + 
            '&mem_meeting_attendance=' + $('#mem_meeting_attendance').val() + 
            '&mem_meeting_percentage=' + $('#mem_meeting_percentage').val() + 
            '&mem_game_attendance=' + $('#mem_game_attendance').val() + 
            '&mem_game_percentage=' + $('#mem_game_percentage').val() + 
            '&mem_comp_attendance=' + $('#mem_comp_attendance').val() + 
            '&mem_comp_percentage=' + $('#mem_comp_percentage').val() + 
            '&mem_points_scored=' + $('#mem_points_scored').val() + 
            '&mem_points_percentage=' + $('#mem_points_percentage').val() + 
            '&date_joined=' + $('#date_joined').val() + 
            '&mem_hours_support=' + $('#mem_hours_support').val(),
            'method': 'POST',
        'headers': {
            'Cache-Control': 'no-cache',
        },
    }

    $.ajax(settings).done(function (response) {
        console.log(response);

        if ($('#id').val() == "") {
            $('#id').val(response);
        }
        $('#results').html('Member saved successfully.' + response);
        showAlert('success', 'Success!', 'Member saved successfully.');
    }).fail(function() {
        showAlert('danger', 'Error!', 'Error occurred while saving data.');
    });
}
</script>