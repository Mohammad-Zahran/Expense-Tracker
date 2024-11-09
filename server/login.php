<?php

include "connection.php";

$username = $_POST["username"];
$password = $_POST["password"];

$query = $connection->prepare("SELECT * FROM users WHERE username = ?");
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result();

if ($result->num_rows != 0) {
    $user = $result->fetch_assoc();

    // Verify password
    $check = password_verify($password, $user["password"]);

    if ($check) {
        echo json_encode([
            "status" => "Login Succesful",
            "user_id" => $user["id"], 
        ]);
    } else {
        echo json_encode([
            "status" => "Invalid Credentials",
        ]);
    }
} else {
    echo json_encode([
        "status" => "Invalid Credentials",
    ]);
}

?>
