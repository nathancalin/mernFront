document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotPasswordEmail').value;

        try {
            const response = await fetch('https://makimobackend.onrender.com/api/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            console.log(data);

            if (response.status === 200) {
                alert('A reset link has been sent to your email address.');
                // Optionally redirect or clear the form
                document.getElementById('forgotPasswordForm').reset();
            } else {
                alert('Error sending reset link: ' + data.message);
            }
        } catch (error) {
            console.error('Error sending reset link:', error.message);
            alert('Error sending reset link. Please try again.');
        }
    });
});
