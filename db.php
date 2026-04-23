<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "foodigo";

$conn = new mysqli($host, $user, $pass, $db);
if($conn ->connect_error) {
    echo"<script>console.log('Database connection failed');</script>";
}else {
    echo"<script>console.log('Database Connected successfully');</script>" ;
}

?>