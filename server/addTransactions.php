<?php

include "connection.php";

if (isset($_POST["user_id"]) && isset($_POST["name"]) && isset($_POST["amount"]) && isset($_POST["date"]) && isset($_POST["type"])) {

    $user_id = $_POST["user_id"];
    $name = $_POST["name"];
    $amount = $_POST["amount"];
    $date = $_POST["date"];
    $type = $_POST["type"];

    if (empty($type)) {
        echo json_encode([
            "status" => "error",
            "message" => "Transaction type is required."
        ]);
        exit();
    } elseif ($type !== 'income' && $type !== 'expense') {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid transaction type. Allowed values are 'income' or 'expense'."
        ]);
        exit();
    }

    $query = $connection->prepare("INSERT INTO transactions (user_id, name, amount, date, type) VALUES (?, ?, ?, ?, ?)");

   
    $query->bind_param("issss", $user_id, $name, $amount, $date, $type);


    // Execute the query
    if ($query->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Transaction added successfully."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to add transaction."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Required fields are missing."
    ]);
}

?>
