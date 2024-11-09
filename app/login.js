const LoginButton = document.getElementById("login");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

LoginButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const data = new FormData();
    data.append("username", usernameInput.value);
    data.append("password", passwordInput.value);

    try {
        // Send the POST request using Axios
        const response = await axios({
            method: "POST",
            url: "http://localhost/Expense%20Tracker/server/login.php", // Corrected axios request format
            data: data
        });

        console.log(response.data); // Check the response in the console

        if (response.data.status === "Login Succesful") {
            // Store user ID in localStorage
            const userId = response.data.user_id;
            localStorage.setItem("userId", userId); // Store user ID for future requests

            // Redirect to home page
            window.location.href = "home.html";
        } else {
            document.getElementById("error-container").innerText = "Invalid Credentials";
        }
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById("error-container").innerText = "Failed to reach the server.";
    }
});
