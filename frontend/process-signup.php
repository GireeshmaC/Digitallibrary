<?php

$errors = [];

if (empty($_POST["name"])) {
    $errors[] = "Name is required";
}

if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Valid email is required";
}

if (strlen($_POST["password"]) < 8) {
    $errors[] = "Password must be at least 8 characters";
}

if (!preg_match("/[a-z]/i", $_POST["password"])) {
    $errors[] = "Password must contain at least one letter";
}

if (!preg_match("/[0-9]/", $_POST["password"])) {
    $errors[] = "Password must contain at least one number";
}

if ($_POST["password"] !== $_POST["password_confirmation"]) {
    $errors[] = "Passwords must match";
}

if (!empty($errors)) {
    // If there are errors, display them to the user
    foreach ($errors as $error) {
        echo $error . "<br>";
    }
    exit;
}

$password_hash = password_hash($_POST["password"], PASSWORD_DEFAULT);

$mysqli = require __DIR__ . "/database.php";

$sql = "INSERT INTO user (name, email, password_hash)
        VALUES (?, ?, ?)";

$stmt = $mysqli->stmt_init();

if (!$stmt->prepare($sql)) {
    die("SQL error: " . $mysqli->error);
}

$stmt->bind_param("sss", $_POST["name"], $_POST["email"], $password_hash);

if ($stmt->execute()) {
    header("Location: signup-success.html");
    exit;
} else {
    if ($mysqli->errno === 1062) {
        echo "The email address is already taken. Please choose another.";
    } else {
        echo "An error occurred during registration. Please try again later.";
    }
    exit;
}