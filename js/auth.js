// Check if the token is present in local storage
const token = localStorage.getItem('token');

if (!token) {
    // If the token is not found, redirect to the login page
    window.location.href = 'login.html';
}
