<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");

$host = "localhost";
$dbuser = "root";   
$pass = "";        
$dbname = "expensedb"; 

$connection = new mysqli($host, $dbuser, $pass, $dbname);

if ($connection->connect_error){
  die("Connection failed: " . $connection->connect_error);
}

?>