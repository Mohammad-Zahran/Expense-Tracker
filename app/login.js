const LoginButton = document.getElementById("login");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

LoginButton.addEventListener("click", async (event) => {
    event.preventDefault(); 

    const data = new FormData();

    data.append("username",usernameInput.value);
    data.append("password",passwordInput.value);

    try {
        // Send the POST request using Axios
        const response = await axios("http://localhost/Expense%20Tracker/server/login.php", {
            method: "POST",
            data:data,
        });

        console.log(response.data);
        if (response.data.status === "Login Successful") {
            window.location.href = "/index.html"
        } else {
            document.getElementById("error-container").innerText = "Invalid credentials, please try again.";
        }
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById("error-container").innerText = "Failed to reach the server.";
    }
});
