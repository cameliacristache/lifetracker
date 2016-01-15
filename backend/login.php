<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);
}

    $user = $_POST['email'];
    $pass = md5($_POST['password']);

    if ($user&&$pass)
    {
    //connect to db
    $connect = mysql_connect("localhost","root","mysql") or die("not connecting");
    mysql_select_db("habitrpg") or die("no db :'(");
    $query = mysql_query("SELECT * FROM users WHERE email='$user'");

    $numrows = mysql_num_rows($query);


    if ($numrows!=0)
    {
    //while loop
      while ($row = mysql_fetch_assoc($query))
      {
        $dbusername = $row['email'];
        $dbpassword = $row['password'];
        $dbid = $row['id'];
      }

      if ($dbusername) {
          echo intval($dbid);
      }
    }
    else {
        header('X-PHP-Response-Code: 401', true, 401);
        echo "User does not exist!";
  }
    }
else {
    header('X-PHP-Response-Code: 404', true, 404);
    die("Please enter a username and password!");
}
