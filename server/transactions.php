<?php

include "connection.php";

// Fetch transactions for a user
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id']; // User should be logged in and pass their ID
    $stmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $userId]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($transactions);
}

// Add a new transaction
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $userId = $data->user_id; // Ensure the user is authenticated
    $name = $data->name;
    $amount = $data->amount;
    $date = $data->date;
    $type = $data->type;

    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, name, amount, date, type) VALUES (:user_id, :name, :amount, :date, :type)");
    $stmt->execute([
        'user_id' => $userId,
        'name' => $name,
        'amount' => $amount,
        'date' => $date,
        'type' => $type
    ]);
    echo json_encode(['status' => 'Transaction added']);
}

// Delete a transaction
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = :id");
    $stmt->execute(['id' => $id]);
    echo json_encode(['status' => 'Transaction deleted']);
}
?>









?>