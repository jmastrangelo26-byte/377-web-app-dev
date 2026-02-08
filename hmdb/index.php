<html>
<head>
    <title>HMDB</title>
    
</head>
    <body>
        <h1>HMDB: The Hanover Movie Database</h1>

        <h2>Movies <span id = "recordCount"></span></h2>
<?php

for ($i = 0; $i < 26; $i++) {
    $letter = chr($i + ord("A"));
    echo "<a href='index.php?filter=$letter'>$letter</a> ";
}

echo "<a href='index.php'>ALL</a> ";

?>
        <table border = "1">
            <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Release</th>
            </tr>
            
            <?php

$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "hmdb";

// Connect to the database and verify if it is secure
$connection = new mysqli($servername, $username, $password, $dbname);
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
    }
    
    extract($_REQUEST);
    if (!isset($filter)) {
        $filter = '';
    } else {
        $filter = connection->real_escape_string($filter);
    }
        
$sql =<<<SQL
SELECT * 
FROM movie 
WHERE mov_title LIKE "$filter%"
ORDER BY mov_title;
SQL;

$result = $connection->query($sql);

$recordCount = 0;
while($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td><a href='detail.php?id='>" .$row["mov_title"]. "</td>";
    echo "<td>" . $row["mov_duration"] . "</td>";
    echo "<td>" . $row["mov_release_year"] . "</td>";

    $recordCount++;
}

    ?>
        </table>
<?php 
$code=<<<JS
<script>
document.getElementById('recordCount').innerHTML = '(' + $recordCount + ' records)';
</script>
JS;

echo $code;
?>

    </body>
</html>
