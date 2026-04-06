<?php

/*************************************************************************************************
 * list.php
 *
 * Displays a list of the member entries. This page expects to be included within index.php.
 *************************************************************************************************/

?>

<h2>All Data<span id="record-count"></span></h2>

<div class="table-responsive">
    <table id="main" class="table table-striped table-hover table-bordered strike hover row-border column-border order-column" style="width:100%">


    <thead>
        <tr>
            <th>Member Name</th>
            <th>Member Status</th>
            <th>Meeting Attendance</th>
            <th>% of Meetings Attended</th>
            <th>Game Nights Attended</th>
            <th>% of Game Nights Attended</th>
            <th>Competitions Attended</th>
            <th>% of Competitions Attended</th>
            <th>Points Scored</th>
            <th>Competition Accuracy</th>
            <th>Hours Spent at Tech Support</th>
            <th>Date Joined</th>

        </tr>
    </thead>
    <tbody>
<?php

$connection = get_connection();

$sql =<<<SQL
 SELECT *
   FROM member_data
  ORDER BY mem_name
SQL;

$rows = [];
$result = $connection->query($sql);
while ($row = $result->fetch_assoc()){
    $rows[] = $row;
}

print '<script>';
print 'var data = ' . json_encode($rows, JSON_PARTIAL_OUTPUT_ON_ERROR) . ';';
print '</script>';

?>

<script>
    var dataTable = $('#main').DataTable({
        data: data,
        columns: [
            { data: 'mem_name', title: 'Member Name', render: function(data, type, row) {
                return '<a href="index.php?content=detail&id=' + row.idmember_data + '">' + data + '</a>';
            }},
            { data: 'mem_status', title: 'Member Status' },
            { data: 'mem_meeting_attendance', title: 'Meeting Attendance' },
            { data: 'mem_meeting_percentage', title: '% of Meetings Attended', render: function(data) {
                return data + '%';
            }},
            { data: 'mem_game_attendance', title: 'Game Nights Attended' },
            { data: 'mem_game_percentage', title: '% of Game Nights Attended', render: function(data) {
                return data + '%';
            }},
            { data: 'mem_comp_attendance', title: 'Competitions Attended' },
            { data: 'mem_comp_percentage', title: '% of Competitions Attended', render: function(data) {
                return data + '%';
            }},
            { data: 'mem_points_scored', title: 'Points Scored' },
            { data: 'mem_points_percentage', title: 'Competition Accuracy', render: function(data) {
                return data + '%';
            }},
            { data: 'mem_hours_support', title: 'Hours Spent at Tech Support' },
            { data: 'date_joined', title: 'Date Joined', render: function(data) {
                if (!data) return '';
                var date = new Date(data);
                return date.toLocaleDateString();
            }}
        ]
    });
</script>
    </tbody>
</table>
</div>

<hr>

<form method="GET" class="mb-3">
    <input type="hidden" name="content" value="list">
    <!-- Used COPILOT to help write the value field to use htmlspecialchars to santize input
        Discovered that ? is essentially an if else statement -->
    <input type="text" name="filter" placeholder="Filter by member name" class="form-control" value="<?php echo isset($_GET['filter']) ? htmlspecialchars($_GET['filter']) : ''; ?>">
    <button type="submit" class="btn btn-primary mt-2">Filter</button>
</form>

<table class="table table-bordered table-hover">
    <thead class="thead-dark">
        <tr>
            <th>Member Name</th>
            <th>Member Status</th>
            <th>Meeting Attendance</th>
            <th>% of Meetings Attended</th>
            <th>Game Nights Attended</th>
            <th>% of Game Nights Attended</th>
            <th>Competitions Attended</th>
            <th>% of Competitions Attended</th>
            <th>Points Scored</th>
            <th>Competition Accuracy</th>
            <th>Hours Spent at Tech Support</th>
            <th>Date Joined</th>

        </tr>
    </thead>
    <tbody>


<?php

// Looked up how to read the filter value off of my form tag which houses the dropdown menu
// Looked up that ? is essentially an if else statement
// $_GET allows you to pull the value of filter from the HTML section as it was written with a methood tpe of GET
if (!isset($_GET['filter'])){
    // Needs to be null instead of an empty so that values show up when no filter is tped in
    $filter = NULL;
} else {
    $filter = $connection->real_escape_string($_GET['filter']);
}


$sql =<<<SQL
 SELECT *
   FROM member_data
   WHERE mem_name LIKE '%$filter%'
  ORDER BY mem_name
SQL;

$recordCount = 0;
$result = $connection->query($sql);
while ($row = $result->fetch_assoc()){
    echo "<tr>";
    echo "<td><a href='index.php?content=detail&id=". $row["idmember_data"] . "'>" . $row["mem_name"] . "</a></td>";
    echo "<td>" . $row["mem_status"] . "</td>";
    echo "<td>" . $row["mem_meeting_attendance"] . "</td>";
    echo "<td>" . $row["mem_meeting_percentage"] . "%</td>";
    echo "<td>" . $row["mem_game_attendance"] . "</td>";
    echo "<td>" . $row["mem_game_percentage"] . "%</td>";
    echo "<td>" . $row["mem_comp_attendance"] . "</td>";
    echo "<td>" . $row["mem_comp_percentage"] . "%</td>";
    echo "<td>" . $row["mem_points_scored"] . "</td>";
    echo "<td>" . $row["mem_points_percentage"] . "%</td>";
    echo "<td>" . $row["mem_hours_support"] . "</td>";
    echo "<td>" . (!empty($row["date_joined"]) ? date('m/d/Y', strtotime($row["date_joined"])) : '') . "</td>";
    echo "</tr>";

    $recordCount++;
}
?>
    </tbody>
</table>

<?php

$code =<<<JS
<script>
document.getElementById('record-count').innerHTML = '(' + $recordCount + ' records)';
</script>
JS;

echo $code;

?>

<a href = "index.php?content=list_details" class="btn btn-info" role="button">View Club Details</a>