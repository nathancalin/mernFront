document.addEventListener('DOMContentLoaded', () => {
    console.log('Superadmin profile page loaded');

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    });

    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetchAllProfiles(token);

    // Add event listener for modal form submission once
    document.getElementById('updateProfileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const userId = document.getElementById('modalUserId').value;
        const firstName = document.getElementById('modalFirstName').value;
        const lastName = document.getElementById('modalLastName').value;
        const email = document.getElementById('modalEmail').value;
        updateProfile({ userId, firstName, lastName, email });
    });

    // Modal close functionality
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        document.getElementById('updateProfileModal').style.display = 'none';
    });

    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('updateProfileModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

function fetchAllProfiles(token) {
    fetch('https://makimobackend.onrender.com/api/profiles/admin/getAllProfiles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.profiles && data.profiles.length > 0) {
            displayProfiles(data.profiles);
        } else {
            document.getElementById('profile-table-body').innerHTML = '<tr><td colspan="5">No profiles found</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error fetching profiles:', error);
        document.getElementById('profile-table-body').innerHTML = '<tr><td colspan="5">Error loading profiles</td></tr>';
    });
}

function displayProfiles(profiles) {
    const tableBody = document.getElementById('profile-table-body');
    tableBody.innerHTML = '';

    profiles.forEach(profile => {
        const row = `
            <tr>
                <td>${profile.userId}</td>
                <td>${profile.firstName}</td>
                <td>${profile.lastName}</td>
                <td>${profile.email}</td>
                <td>
                    <button class="update-btn" data-userid="${profile.userId}">Update</button>
                    <button class="delete-btn" data-userid="${profile.userId}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Add event listeners to Update buttons
    const updateButtons = document.querySelectorAll('.update-btn');
    updateButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const profile = {
                userId: row.cells[0].textContent,
                firstName: row.cells[1].textContent,
                lastName: row.cells[2].textContent,
                email: row.cells[3].textContent
            };
            openUpdateModal(profile);
        });
    });

    // Add event listeners to Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.dataset.userid;
            deleteProfile(userId);
        });
    });
}

function openUpdateModal(profile) {
    if (!profile) {
        console.error('Profile is undefined or null');
        return;
    }

    populateModal(profile);
    document.getElementById('updateProfileModal').style.display = 'block';
}

function populateModal(profile) {
    document.getElementById('modalUserId').value = profile.userId; // Store userId in hidden input
    document.getElementById('modalFirstName').value = profile.firstName;
    document.getElementById('modalLastName').value = profile.lastName;
    document.getElementById('modalEmail').value = profile.email;
}

function updateProfile(profile) {
    const userId = profile.userId;
    const firstName = profile.firstName;
    const lastName = profile.lastName;
    const email = profile.email;
    const token = localStorage.getItem('token');

    fetch(`https://makimobackend.onrender.com/profiles/admin/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ firstName, lastName, email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Profile updated successfully') {
            alert('Profile updated successfully');
            document.getElementById('updateProfileModal').style.display = 'none';
            fetchAllProfiles(token); // Refresh profiles table after update
        } else {
            alert('Error updating profile');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    });
}

function deleteProfile(userId) {
    const token = localStorage.getItem('token');

    if (confirm('Are you sure you want to delete this profile?')) {
        fetch(`https://makimobackend.onrender.com/api/profiles/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Profile deleted successfully') {
                alert('Profile deleted successfully');
                fetchAllProfiles(token); // Refresh profiles table after deletion
            } else {
                alert('Error deleting profile');
            }
        })
        .catch(error => {
            console.error('Error deleting profile:', error);
            alert('Error deleting profile');
        });
    }
}
