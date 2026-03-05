<?php

$comps_attended = "";
$meetings_hosted = "";
$game_nights_hosted = "";
$total_possible_points = "";
$total_tech_support_hours = "";


if (isset($id)){
    $connection = get_connection();
    $id = $connection->real_escape_string($id);
    $sql =<<<SQL
    SELECT *
    FROM club_details
    WHERE idclub_details = '$id'
    SQL;

    $result = $connection->query($sql);
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $comps_attended = $row["comps_attended"];
        $meetings_hosted = $row["meetings_hosted"];
        $game_nights_hosted = $row["game_nights_hosted"];
        $total_possible_points = $row["total_possible_points"];
        $total_tech_support_hours = $row["total_tech_support_hours"];
    }
}

?>

<h2>Club Details</h2>
<form action="save_details.php" method="POST">

    <input type="hidden" class="form-control" name="id" value="<?php echo $id; ?>">

    <div class="mb-3">
        <label for="comps_attended" class="form-label">Competitions Attended</label>
        <input type="text" class="form-control" name="comps_attended" value="<?php echo $comps_attended; ?>">
    </div>

    <div class="mb-3">
        <label for="meetings_hosted" class="form-label">Meetings Hosted</label>
        <input type="text" class="form-control" name="meetings_hosted" value="<?php echo $meetings_hosted; ?>">
    </div>

    <div class="mb-3">
        <label for="game_nights_hosted" class="form-label">Game Nights Hosted</label>
        <input type="text" class="form-control" name="game_nights_hosted" value="<?php echo $game_nights_hosted; ?>">
    </div>

    <div class="mb-3">
        <label for="total_possible_points" class="form-label">Total Possible Points</label>
        <input type="text" class="form-control" name="total_possible_points" value="<?php echo $total_possible_points; ?>">
    </div>

    <div class="mb-3">
        <label for="total_tech_support_hours" class="form-label">Total Tech Support Hours</label>
        <input type="text" class="form-control" name="total_tech_support_hours" value="<?php echo $total_tech_support_hours; ?>">
    </div>

    <button type="submit" class="btn btn-primary">Save Details</button>
    <a href="index.php?content=list" class="btn btn-secondary" role="button">Cancel</a>
</form>