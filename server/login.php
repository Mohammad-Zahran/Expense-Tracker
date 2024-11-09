<?php
include "connection.php";

if (isset($_POST['uname']) && isset($_POST['password'])) {
    function validate($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    $uname = validate($_POST['uname']);
    $password = validate($_POST['password']);

    if (empty($uname)) {
        echo 'User Name is required';
        exit();
    }
    else if (empty($password)) {
        echo 'Password is required';
        exit();
    }
    else {
        $sql = "SELECT * FROM users WHERE username='$uname' AND password='$password'";

        // Use the correct connection variable
        $result = mysqli_query($connection, $sql);

        // Use the correct function to check the number of rows
        if (mysqli_num_rows($result) > 0) {
            // Redirect to index.html after successful login
            header("Location: index.html");
            exit();
        } else {
            echo 'Invalid credentials';
            exit();
        }
    }
} else {
    echo 'Invalid submission';
    exit();
}
?>
