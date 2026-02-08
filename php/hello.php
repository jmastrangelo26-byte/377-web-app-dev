<html>
    <head>
        <title>PHP Lesson 1</title>
    <head>

    <body>
        <h1>PHP Lesson 1</h1>

        <p>
            This is the first PHP lesson with simply PHP markkup

            <?php 
            
                // Looping
                for ($i = 0; $i < 10; $i++){
                    echo "Hello<br>"; 
                }

                $firstName = "Will";
                $lastName = "Davidson";
                
                $fullName = $firstName . " " . $lastName; 

                // String concatenation
                echo "<p>" . $fullName . " is in Web App Development</p>";

                // String interpolation only works within double quotes
                echo "<p>$fullName is in Web App Development</p>"
            ?>
        </p>
    </body>
</html>