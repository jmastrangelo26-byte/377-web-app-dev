<?php
include("library.php");

// Determines if club data has been input or not
// intval is used to ensure that $id is an integer
$showEditClubDetailsButton = true;
$connection = get_connection();

$sql =<<<SQL
SELECT COUNT(*) AS count 
FROM club_details
SQL;

$result = $connection->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    // looked up intval to convert value count to an integer
    if ($row && intval($row['count']) > 0) {
        $showEditClubDetailsButton = false;
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

        <style>
            .alert-position {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: none;
            }
        </style>

        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

        <script>
            function showAlert(type, title, message) {
                $('#alert').hide();
                $('#alert').removeClass('alert-success alert-info alert-warning alert-danger').addClass('alert-' + type);
                $('#alertTitle').text(title);
                $('#alertMessage').html(message);
                $('#alert').fadeIn();
            }
        </script>

        <title>CyberHawks</title>
    </head>

    <body>
        <div class="container">
            <div class="alert alert-position" id="alert">
                <strong id="alertTitle"></strong> <span id="alertMessage"></span>
            </div>
    <!-- Shows up only if there is no data in the club details page -->
    <div class="mb-3">
            <a href="index.php?content=detail" class="btn btn-primary" role="button">Add a Record</a>
            <?php
            // Learned online that you can use PHP to decide if HTML code should be run or not
            if ($showEditClubDetailsButton) { ?>
                <a href="index.php?content=club_details" class="btn btn-secondary" role="button">Edit Club Details</a>
            <?php } ?>
    </div>

    <body>
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