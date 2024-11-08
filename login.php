<?php
if (isset($_POST['uname']) && isset($_POST['password'])) {
    function validate($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    $uname = validate($_POST['uname']);
    $pass = validate($_POST['password']);

    // Check if fields are empty and respond with errors
    if (empty($uname)) {
        echo 'User Name is required';
        exit();
    }
    if (empty($pass)) {
        echo 'Password is required';
        exit();
    }

    // If credentials are valid, return a success URL
    echo 'index.html';
    exit();
} else {
    echo 'Invalid submission';
    exit();
}
