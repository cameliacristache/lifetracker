<?php
// if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
//     $_POST = json_decode(file_get_contents('php://input'), true);
// }

$id = $_GET['id'];

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

$sql = "SELECT * FROM users WHERE id='".$id."'";
$result = $conn->query($sql);

$response = array();

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $response["user"] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($response);

} else {
    header('X-PHP-Response-Code: 404', true, 404);
    echo "0 results";
}
