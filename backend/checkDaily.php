<?php

if ($_SERVER['REQUEST_METHOD'] == 'PUT' && empty($_PUT)) {
    $_PUT = json_decode(file_get_contents('php://input'), true);
}

$id = $_PUT["id"];
$user_id = $_PUT['user_id'];
$tcomplete = $_PUT['tcomplete'];
$done = 1;

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

$sql = "UPDATE daily SET done='".$done."', tcomplete='".$tcomplete."' WHERE id='".$id."'";

if ($conn->query($sql) === TRUE) {

    $sql0 = "SELECT * FROM users WHERE id='".$user_id."'";
    $result = $conn->query($sql0);
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $currentXP = $row["xp"] + 20;
            $currentCoins = $row["coins"] + 10;
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


    $sql1 = "UPDATE users SET xp='".$currentXP."', coins='".$currentCoins."', level='".$currentLevel."' WHERE id='".$user_id."'";
    $result1 = $conn->query($sql1);

    $sql = "SELECT * FROM daily WHERE user_id='".$user_id."'";
    $result = $conn->query($sql);

    $response = array();

    if ($result->num_rows > 0) {
        $i = 0;
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $response["dailies"][$i] = $row;
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
