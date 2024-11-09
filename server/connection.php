<?php

$host = "localhost";
$dbuser = "root";   
$pass = "";        
$dbname = "expensedb"; 

$connection = new mysqli($host, $dbuser, $pass, $dbname);

if ($connection->connect_error){
  die("Connection failed: " . $connection->connect_error);
}

?>