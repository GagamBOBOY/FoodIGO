document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("show-register").onclick = (e) => {
    e.preventDefault();
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
};

document.getElementById("show-login").onclick = (e) => {
    e.preventDefault();
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
};

    document.getElementById("registerBtn").onclick = () => {
        const username = document.getElementById("reg-username").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        if (!username || !email || !password) {
            document.getElementById("regErrorMsg").innerText = "Fill all fields!";
            return;
        }

        const user = { username, email, password };
        localStorage.setItem("user", JSON.stringify(user));

        alert("Registered successfully!");
    };

    document.getElementById("loginBtn").onclick = () => {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("errorMsg");

    // clear old message
    errorBox.innerText = "";

    if (!email || !password) {
        errorBox.innerText = "Please fill all fields!";
        return;
    }

    fetch("login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            window.location.href = "index.php";
        } else if (data.status === "wrong") {
            errorBox.innerText = "Wrong password";
        } else if (data.status === "not_found") {
            errorBox.innerText = "User not found";
        } else {
            errorBox.innerText = "Something went wrong";
        }
    })
    .catch(() => {
        errorBox.innerText = "Server error";
    });
};
});