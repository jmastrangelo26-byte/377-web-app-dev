<html>
<head>My Club's Website</head>

<style>
    a{
        border: solid 1px blue;
        background-color: lightblue;
        color: blue;
        text-decoration: none;
        padding: 5px;
        width: 200px;
    }

    .selected{
        border: solid 1px blue; 
        background-color: lightblue
        color: lightblue
    }
</style>
<body>
    <!-- Section 1: Header -->
    <h1>HHS Indoor Track</h1>

    <!-- Section 2: Menu -->

    <?php
        if (!isset($nav)){
            $nav = "home";
        }
    ?>

    <a href="club.php?nav=home"     <?php if ($nav == 'home')     print("class='selected'"); ?>>Home</a>
    <a href="club.php?nav=schedule" <?php if ($nav == 'schedule') print("class='selected'"); ?>>Schedule</a>
    <a href="club.php?nav=roster"   <?php if ($nav == 'roster')   print("class='selected'"); ?>>Roster</a>
    <a href="club.php?nav=media"    <?php if ($nav == 'media')    print("class='selected'"); ?>>Media</a>

    <!-- Section 3: Content -->
    <br><br><br>
    <?php
        extract($_REQUEST);

        include("club-$nav.php")
    ?>
    
</body>
</html>