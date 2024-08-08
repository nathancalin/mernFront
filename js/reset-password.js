document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;

        try {
            const response = await fetch(`https://makimobackend.onrender.com/api/users/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword })
            });

            const data = await response.json();
            console.log(data);

            if (response.status === 200) {
                alert('Password has been reset successfully.');
                window.location.href = '../html/login.html'; // Redirect to login page
            } else {
                alert('Error resetting password: ' + data.message);
            }
        } catch (error) {
            console.error('Error resetting password:', error.message);
            alert('Error resetting password. Please try again.');
        }
    });
});
