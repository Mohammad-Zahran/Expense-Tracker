<?php

include "connection.php";

if (isset($_GET['user_id'])) {
    $userId = $_GET['user_id'];  

    
    $query = $connection->prepare("SELECT * FROM transactions WHERE user_id = ?");
    $query->bind_param("i", $userId);  
    $query->execute();  
    $result = $query->get_result();  

    
    if ($result->num_rows > 0) {
        $transactions = [];  
        
        
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;  
        }

        
        echo json_encode([
            "status" => "success",
            "transactions" => $transactions  
        ]);
    } else {
        
        echo json_encode([
            "status" => "no_transactions",
            "message" => "No transactions found for the given user."
        ]);
    }
} else {
    
    echo json_encode([
        "status" => "error",
        "message" => "User ID is required and must be a valid number."
    ]);
}

?>
