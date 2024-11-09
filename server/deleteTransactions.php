<?php

include "connection.php";

if (isset($_GET['id'])) {
    $transactionId = $_GET['id'];  

    $query = $connection->prepare("DELETE FROM transactions WHERE id = ?");
    $query->bind_param("i", $transactionId);  

    if ($query->execute()) {
       
        if ($query->affected_rows > 0) {
            echo json_encode([
                "status" => "success",
                "message" => "Transaction deleted successfully."
            ]);
        } else {
            echo json_encode([
                "status" => "no_transaction_found",
                "message" => "No transaction found with the given ID."
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to delete transaction."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Transaction ID is required."
    ]);
}

?>
