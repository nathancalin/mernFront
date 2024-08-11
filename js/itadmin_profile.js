document.addEventListener('DOMContentLoaded', () => {
    console.log('IT Admin profile page loaded');

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

    // Filtering functionality
    document.getElementById('profileFilter').addEventListener('input', function() {
        const filterValue = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('#profile-table-body tr');

        tableRows.forEach(row => {
            const userId = row.cells[0].textContent.toLowerCase();
            const firstName = row.cells[1].textContent.toLowerCase();
            const lastName = row.cells[2].textContent.toLowerCase();
            const email = row.cells[3].textContent.toLowerCase();

            if (userId.includes(filterValue) || firstName.includes(filterValue) ||
                lastName.includes(filterValue) || email.includes(filterValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Sorting functionality
    document.getElementById('profileSort').addEventListener('change', function() {
        const sortKey = this.value;
        const tableBody = document.getElementById('profile-table-body');
        const rowsArray = Array.from(tableBody.rows);

        rowsArray.sort((a, b) => {
            const cellA = a.querySelector(`td:nth-child(${getSortColumnIndex(sortKey)})`).textContent;
            const cellB = b.querySelector(`td:nth-child(${getSortColumnIndex(sortKey)})`).textContent;
            
            if (cellA < cellB) return -1;
            if (cellA > cellB) return 1;
            return 0;
        });

        // Re-append sorted rows
        tableBody.innerHTML = '';
        rowsArray.forEach(row => tableBody.appendChild(row));
    });

    function getSortColumnIndex(sortKey) {
        switch (sortKey) {
            case 'userId': return 1;
            case 'firstName': return 2;
            case 'lastName': return 3;
            case 'email': return 4;
            default: return 1;
        }
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
                <td>${profile.userId}</td> <!-- Ensure this is correctly logged -->
                <td>${profile.firstName}</td>
                <td>${profile.lastName}</td>
                <td>${profile.email}</td>
                <td><button class="update-btn" data-userid="${profile.userId}">Update</button></td>
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

    fetch(`https://makimobackend.onrender.com/api/profiles/admin/update/${userId}`, {
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
