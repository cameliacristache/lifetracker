<?php

if ($_SERVER['REQUEST_METHOD'] == 'PUT' && empty($_PUT)) {
    $_PUT = json_decode(file_get_contents('php://input'), true);
}

$id = $_PUT['id'];
$coins = $_PUT['coins'];
$xp = $_PUT['xp'];

$servername = "localhost";
$username = "root";
$password = "mysql";
$dbname = "habitrpg";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql0 = "SELECT * FROM users WHERE id='".$id."'";
$result = $conn->query($sql0);
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $currentXP = $row["xp"] + $xp;
        $currentCoins = $row["coins"] + $coins;
    }
}

if ($currentXP<301) {
    $currentLevel = 1;
}
if (($currentXP<601)&&($currentXP>300)) {
    $currentLevel = 2;
}
if (($currentXP<1201)&&($currentXP>600)) {
    $currentLevel = 3;
}
if (($currentXP<2101)&&($currentXP>1200)) {
    $currentLevel = 4;
}
if (($currentXP<3301)&&($currentXP>2100)) {
    $currentLevel = 5;
}
if ($currentXP>3300) {
    $currentLevel = 6;
}


$sql = "UPDATE users SET xp='".$currentXP."', coins='".$currentCoins."', level='".$currentLevel."' WHERE id='".$id."'";
if ($conn->query($sql) === TRUE) {
    $sql2 = "SELECT * FROM users WHERE id='".$id."'";
    $result2 = $conn->query($sql2);

    $response = array();

    if ($result2->num_rows > 0) {
        // output data of each row
        $rowUpdate = $result2->fetch_assoc();
        $response = $rowUpdate;

        header('Content-Type: application/json');
        echo json_encode($response);

    } else {
        header('X-PHP-Response-Code: 404', true, 404);
        echo "0 results";
    }
} else {
    echo "Error updating record: " . $conn->error;
}
