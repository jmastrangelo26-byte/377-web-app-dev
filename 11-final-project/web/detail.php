<?php

$title = "";
$description = "";
$item_type = "";
$due_date = "";
$start_time = "";
$end_time = "";
$priority = "";

include_once("library.php"); // include_once makes sure that the connection is not redeclared multiple times
$connection = get_connection();

if (isset($id)){
    $sql =<<<SQL
    SELECT *
    FROM planned_items
    WHERE id = $id
    SQL;

    // Run the query on the database
    $result = $connection->query($sql);

    // Store the ONE result in an associative array
    $row = $result->fetch_assoc();

    $id = $row["id"];

    $title = $row['title'];
    $description = $row['description'];
    $item_type = $row['item_type'];
    $due_date = $row['due_date'];
    $start_time = $row['start_time'];
    $end_time = $row['end_time'];
    $priority = $row['priority'];
}
else
{
    $id = "";
}

?>

<h2><?php echo $title; ?></h2>

<foirm action="save.php" method="POST">
    <input type="hidden" name="id" id="id" value="<?php echo $id; ?>">
    
    <div class="mb-3">
        <label for="title" class="form-label">Name of Assignment/Event"</label>
        <input type="text" class="form-control" name="title" id="title" value="<?php echo $title; ?>">
    </div>

    <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" name="description" id="description"><?php echo $description; ?></textarea>
    </div>

    <div class="mb-3">
        <label for="item_type" class="form-label">Type of Item</label>
        <select class="form-control" name="item_type" id="item_type">
            <option value="">Select Type</option>
            <option value="assignment" <?php if ($item_type == "assignment") echo "selected"; ?>>Assignment</option>
            <option value="event" <?php if ($item_type == "event") echo "selected"; ?>>Event</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="due_date" class="form-label">Due Date</label>
        <input type="date" class="form-control" name="due_date" id="due_date" value="<?php echo $due_date; ?>">
    </div> 

    <div class="mb-3">
        <label for="start_time" class="form-label">Start Time</label>
        <input type="time" class="form-control" name="start_time" id="start_time" value="<?php echo $start_time; ?>">
    </div>

    <div class="mb-3">
        <label for="end_time" class="form-label">End Time</label>
        <input type="time" class="form-control" name="end_time" id="end_time" value="<?php echo $end_time; ?>">
    </div> 

    <div class="mb-3">
        <label for="priority" class="form-label">Priority</label>
        <select class="form-control" name="priority" id="priority">
            <option value="">Select Priority</option>
            <option value="low" <?php if ($priority == "low") echo "selected"; ?>>Low</option>
            <option value="medium" <?php if ($priority == "medium") echo "selected"; ?>>Medium</option>
            <option value="high" <?php if ($priority == "high") echo "selected"; ?>>High</option>
        </select>
    </div>

    <button type="submit" class="btn btn-primary">Save</button>
</form>