<?php

$host = "localhost";
$dbuser = "root";
$pass = "";
$dbname = "expenseDB";

$connection = new mysqli($host, $dbuser, $pass, $dbname);

if ($connection->connect_error){
  die("Error happened");
}