<?php
include("library.php");

// Determines if club data has been input or not
// intval is used to ensure that $id is an integer
$showEditClubDetailsButton = true;
$connection = get_connection();

$sql =<<<SQL
SELECT COUNT(*) AS cnt 
FROM club_details
SQL;

$result = $connection->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    // looked up intval to convert value count to an integer
    if ($row && intval($row['cnt']) > 0) {
        $showEditClubDetailsButton = false;
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

        <title>CyberHawks</title>
    </head>

    <!-- Shows up only if there is no data in the club details page -->
    <div class="mb-3">
            <a href="index.php?content=detail" class="btn btn-primary" role="button">Add a Record</a>
            <?php if ($showEditClubDetailsButton) { ?>
                <a href="index.php?content=club_details" class="btn btn-secondary" role="button">Edit Club Details</a>
            <?php } ?>
    </div>

    <body>
        <div class="container">
            <h1>CyberHawks Homebase</h1>
            <?php
                if (!isset($content)){
                    $content = "list";
                }
                include("$content.php");
            ?>
        </div>
        </div>
    </body>
</html>