<?php

$host = "localhost";
$dbuser = "root";   // Default MySQL user for XAMPP
$pass = "";         // Default password for XAMPP MySQL is usually empty
$dbname = "expensedb"; // Ensure this matches the database name

$connection = new mysqli($host, $dbuser, $pass, $dbname);

if ($connection->connect_error){
  die("Connection failed: " . $connection->connect_error);
}

