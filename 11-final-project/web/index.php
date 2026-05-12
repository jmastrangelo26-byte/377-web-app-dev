<html>

<!-- This is the main entry point for the Assignment Planner web application. 
It sets up the basic HTML structure and includes the necessary CSS and JavaScript libraries. 
It also determines which content to display based on URL parameters and includes the appropriate 
PHP files for rendering that content. -->

    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" href="styles.css">
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    </head>

    <body>

        <h1>Assignment Planner</h1>

        <div class="mb-3">
            <a href="index.php?content=detail" class="btn btn-primary" role="button">Add Assignment/Event</a>
            <a href="index.php?content=view-completed-tasks" class="btn btn-secondary" role="button">View Completed Tasks</a>
        </div>

<?php
include_once("library.php");

if (!isset($content)){
    $content = "list";
}
include("$content.php");
?>
        </div>
