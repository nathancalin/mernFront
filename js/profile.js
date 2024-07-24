document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchProfile(userId);

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Profile update modal handling
    const profileUpdateModal = document.getElementById('updateProfileModal');
    const profileUpdateModalCloseBtn = profileUpdateModal.querySelector('.close');

    profileUpdateModalCloseBtn.addEventListener('click', () => {
        profileUpdateModal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === profileUpdateModal) {
            profileUpdateModal.style.display = 'none';
        }
    };

    document.getElementById('updateProfileForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await updateProfile(userId);
        profileUpdateModal.style.display = 'none';
    });

    // Password update modal handling
    const passwordUpdateModal = document.getElementById('updatePasswordModal');
    const passwordUpdateModalCloseBtn = passwordUpdateModal.querySelector('.close');

    passwordUpdateModalCloseBtn.addEventListener('click', () => {
        passwordUpdateModal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === passwordUpdateModal) {
            passwordUpdateModal.style.display = 'none';
        }
    };

    document.getElementById('updatePasswordForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await updatePassword(userId);
        passwordUpdateModal.style.display = 'none';
    });
});

async function updatePassword(userId) {
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`https://makimobackend.onrender.com/api/users/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        if (response.status === 200) {
            alert('Password updated successfully');
        } else {
            console.error('Error updating password:', response.status);
        }
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

async function fetchProfile(userId) {
    try {
        const response = await fetch(`https://makimobackend.onrender.com/api/profiles/get/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            displayProfile(data.profile);
        } else if (response.status === 404) {
            displayCreateProfileButton(userId);
        } else {
            console.error('Error fetching profile:', response.status);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

function displayProfile(profile) {
    const profileContainer = document.getElementById('profileContainer');
    
    const gameScoresHTML = profile.gameScores.map(score => `
        <li>Level ${score.levelNumber}: ${score.score} points</li>
    `).join('');

    profileContainer.innerHTML = `
        <h2>Profile</h2>
        <p><strong>First Name:</strong> ${profile.firstName}</p>
        <p><strong>Last Name:</strong> ${profile.lastName}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Total Points:</strong> ${profile.totalPoints}</p>
        <h3>Game Scores</h3>
        <ul>${gameScoresHTML}</ul>
        <button onclick="showUpdateProfileModal('${profile._id}', '${profile.firstName}', '${profile.lastName}', '${profile.email}')">Update Profile</button>
        <button onclick="showUpdatePasswordModal()">Change Password</button>
    `;
}

function displayCreateProfileButton(userId) {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = `
        <h2>Don't have a profile yet?</h2>
        <p>Click this button to create now.</p>
        <button id="createProfileButton">Create Profile</button>
    `;

    document.getElementById('createProfileButton').addEventListener('click', async () => {
        try {
            const response = await fetch(`https://makimobackend.onrender.com/api/profiles/create/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 201) {
                const data = await response.json();
                displayProfile(data.profile);
            } else {
                console.error('Error creating profile:', response.status);
            }
        } catch (error) {
            console.error('Error creating profile:', error);
        }
    });
}

function showUpdateProfileModal(id, firstName, lastName, email) {
    const modal = document.getElementById('updateProfileModal');
    document.getElementById('firstName').value = firstName;
    document.getElementById('lastName').value = lastName;
    document.getElementById('email').value = email;
    modal.style.display = 'block';
}

function showUpdatePasswordModal() {
    const modal = document.getElementById('updatePasswordModal');
    modal.style.display = 'block';
}

async function updateProfile(userId) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch(`https://makimobackend.onrender.com/api/profiles/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email })
        });

        if (response.status === 200) {
            const data = await response.json();
            displayProfile(data.profile);
        } else {
            console.error('Error updating profile:', response.status);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

function getUserIdFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
}
