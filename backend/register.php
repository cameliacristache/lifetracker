<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$user = $_POST['email'];
$name = $_POST['nume'];
$pass = $_POST['password'];
$gender = $_POST['gender'];

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

$sql = "INSERT INTO users (email, password, name, gender, life, xp, coins, level)
VALUES ('".$user."', '".$pass."', '".$name."','".$gender."',20,0,0,1)";

if ($conn->query($sql) === TRUE) {
    $sql2 = "SELECT id FROM users WHERE email='".$user."'";
    $result = $conn->query($sql2);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo intval($row["id"]);
        }
    } else {
        echo "0 results";
    }

} else {
    header('X-PHP-Response-Code: 500', true, 500);
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
