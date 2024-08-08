document.getElementById('verifyEmailButton').addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
        document.getElementById('statusMessage').textContent = 'Invalid or missing verification token.';
        return;
    }

    try {
        const response = await fetch(`https://makimobackend.onrender.com/api/users/verify-email?token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('statusMessage').textContent = 'Your email has been verified successfully!';
        } else {
            document.getElementById('statusMessage').textContent = 'Email verification failed: ' + data.message;
        }
    } catch (error) {
        document.getElementById('statusMessage').textContent = 'Error verifying email: ' + error.message;
    }
});
