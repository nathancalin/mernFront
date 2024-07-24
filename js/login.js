// login.js

document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('token');

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('https://makimobackend.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log(data);

            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role); // Store user role in localStorage

                // Redirect based on user role
                if (data.role === 'superadmin') {
                    window.location.href = 'superadmin_landing.html';
                } else if (data.role === 'itAdmin') {
                    window.location.href = 'itadmin_landing.html';
                } else {
                    window.location.href = 'landing.html';
                }
            } else {
                alert('Error logging in: ' + data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert('Error logging in. Please try again.');
        }
    });
});
