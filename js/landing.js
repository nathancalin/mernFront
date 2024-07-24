document.addEventListener('DOMContentLoaded', () => {
    console.log('Landing page loaded');

    document.getElementById('openGame').addEventListener('click', function() {
        const token = localStorage.getItem('token');
        // Check if token is present
        if (!token) {
            console.error('Token not found in local storage.');
            return;
        }
        // Open the game in a new tab using relative path
        window.open('/game/index.html?token=' + token, '_blank');
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});
