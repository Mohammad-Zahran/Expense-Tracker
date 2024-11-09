const RegisterButton = document.getElementById("register");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

RegisterButton.addEventListener("click", async (event) => {
    event.preventDefault(); 
    const data = new FormData();
    data.append("username", usernameInput.value);
    data.append("password", passwordInput.value);

    try {
        const response = await axios("http://localhost/Expense%20Tracker/server/register.php", {
            method: "POST",
            data: data,
        });

        console.log(response.data);
        if (response.data.status === "Successful") {
            window.location.href = "index.html"; 
        } else {
            document.getElementById("error-container").innerText = response.data.message; 
        }
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById("error-container").innerText = "Failed to reach the server.";
    }
});
