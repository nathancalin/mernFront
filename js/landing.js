document.addEventListener('DOMContentLoaded', async () => {
    console.log('Landing page loaded');

    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);

    function getUserIdFromToken(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    }
    

    // Fetch profile to check if it exists
    const profileExists = await checkProfileExists(userId);

    if (profileExists) {
        document.getElementById('profileDescription').innerText = 'You can now play the game!';
        document.getElementById('openGame').style.display = 'inline-block';
    } else {
        document.getElementById('profileDescription').innerText = 'Please create a profile first before playing the game. Please go to the Profiles tab and click "Create Profile"';
        document.getElementById('openGame').style.display = 'none';
    }

    document.getElementById('openGame').addEventListener('click', function() {
        window.open('/game/index.html?token=' + token, '_blank');
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

// Function to check if profile exists
async function checkProfileExists(userId) {
    try {
        const response = await fetch(`https://makimobackend.onrender.com/api/profiles/get/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log('Profile check response status:', response.status);
        if (response.ok) {
            return true;
        } else {
            console.error('Profile check failed:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error checking profile:', error);
        return false;
    }
}

