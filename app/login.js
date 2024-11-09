document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const errorContainer = document.getElementById('error-container');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        errorContainer.textContent = '';
        errorContainer.style.display = 'none';

        if (!username) {
            errorContainer.textContent = 'User Name is required';
            errorContainer.style.display = 'block'; 
            return;
        }
        
        if (!password) {
            errorContainer.textContent = 'Password is required';
            errorContainer.style.display = 'block'; 
            return;
        }

        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `uname=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('index.html')) {
                window.location.href = 'index.html';
            } else {
                errorContainer.textContent = data;
                errorContainer.style.display = 'block'; // Show error container
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorContainer.textContent = 'An error occurred. Please try again.';
            errorContainer.style.display = 'block'; // Show error container
        });
    });
});
