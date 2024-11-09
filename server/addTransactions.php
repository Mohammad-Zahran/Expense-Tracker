<?php

include "connection.php";

$data = json_decode(file_get_contents("php://input"), true);

$requiredFields = ['user_id', 'name', 'amount', 'date', 'type'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        echo json_encode([
            "status" => "error",
            "message" => ucfirst($field) . " is missing."
        ]);
        exit();
    }
}

$user_id = $data["user_id"];
$name = $data["name"];
$amount = $data["amount"];
$date = $data["date"];
$type = $data["type"];

if (!in_array($type, ['income', 'expense'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid transaction type. Allowed values are 'income' or 'expense'."
    ]);
    exit();
}

$query = $connection->prepare("INSERT INTO transactions (user_id, name, amount, date, type) VALUES (?, ?, ?, ?, ?)");
$query->bind_param("issss", $user_id, $name, $amount, $date, $type);

if ($query->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Transaction added successfully.",
        "id" => $connection->insert_id 
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to add transaction."
    ]);
}

?>
