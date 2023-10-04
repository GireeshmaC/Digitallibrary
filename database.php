<?php

$host = "localhost";
$user = "root";
$password = "Password@123";
$database = "login_db";

// Create connection
$mysqli = new mysqli($host, $user, $password, $database);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

return $mysqli;

?>
