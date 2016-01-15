<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$id = $_POST['id'];
$text = $_POST['text'];
$deadline = $_POST['deadline'];
$done = 0;

$servername = "localhost";
$username = "root";
$password = "mysql";
$dbname = "habitrpg";

if ($difficulty == 1) {
    $coins = 5;
    $xp = 10;
} else {
    if ($difficulty == 2) {
        $coins = 10;
        $xp = 20;
    }
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO tasks (user_id, text, done, deadline)
VALUES ('".$id."', '".$text."', '".$done."', '".$deadline."')";

if ($conn->query($sql) === TRUE) {
    $sql = "SELECT * FROM tasks WHERE user_id='".$id."'";
    $result = $conn->query($sql);

    $response = array();

    if ($result->num_rows > 0) {
        $i = 0;
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $response["tasks"][$i] = $row;
            $i = $i+1;
        }

        header('Content-Type: application/json');
        echo json_encode($response);

    } else {
        header('X-PHP-Response-Code: 404', true, 404);
        echo "0 results";
    }
} else {
    header('X-PHP-Response-Code: 500', true, 500);
    echo "Error: " . $sql . "<br>" . $conn->error;
}
