<?php
if ($_SERVER['REQUEST_METHOD'] == 'PUT' && empty($_PUT)) {
    $_PUT = json_decode(file_get_contents('php://input'), true);
}

$id = $_PUT['id'];
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
        if ($xp == 20){
            $currentLife = $row["life"] - 2;
        }
        if ($xp == 10){
            $currentLife = $row["life"] - 1;
        }
    }

    if ($currentLife < 0) {
        $currentLife = 0;
    }
}

$sql = "UPDATE users SET life='".$currentLife."' WHERE id='".$id."'";
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
