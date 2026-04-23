<?php
include "db.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST['email'];
    $password = $_POST['password'];

    
    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows == 1) {

        $user = $result->fetch_assoc();

        
        if (password_verify($password, $user['password'])) {

            $_SESSION['username'] = $user['username'];

            header("Location: index.php");
            exit();

        } else {
            $error = "Wrong password";
        }

    } else {
        $error = "User not found";
    }
}
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FOODIGO - Login</title>

    <link rel="stylesheet" href="login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body style="background-image: url(bg1.jpg);">

<div class="login-container">
    <h1>
        Welcome to <br>
        <img src="" class="logo">
    </h1>

    <p>Discover recipes based on ingredients you already have!</p>

    <!-- LOGIN -->
    <div id="login-form">
        <form method="POST">
            <input type="text" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>

        <p id="errorMsg" style="color:red;">
            <?php if (isset($error)) echo $error; ?>
        </p>

        <p>
            Don't have an account?
            <a href="#" id="show-register">Register</a>
        </p>
    </div>

    <!-- REGISTER -->
    <div id="register-form" style="display:none;">
        <form method="POST" action="register.php">

            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>

            <button type="submit">Register</button>

            <p>
                Already have an account?
                <a href="#" id="show-login">Login</a>
            </p>

        </form>
    </div>

    <div class="social-login">
        <p>Or login with:</p>
        <button><i class="fab fa-google"></i> Google</button>
        <button><i class="fab fa-facebook-f"></i> Facebook</button>
    </div>
</div>

<script src="login.js"></script>

</body>
</html>
