document.addEventListener('DOMContentLoaded', () => {
    console.log('IT Admin user page loaded');

    // Logout functionality
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

    fetchAllUsers(token);

    // Event listener for modal form submission
    document.getElementById('updateUserForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const userId = document.getElementById('modalUserId').value;
        const firstName = document.getElementById('modalFirstName').value;
        const lastName = document.getElementById('modalLastName').value;
        const username = document.getElementById('modalUsername').value; // Add this line
        const email = document.getElementById('modalEmail').value;
        const role = document.getElementById('modalRole').value;
        updateUser({ userId, firstName, lastName, username, email, role }); // Include username here
    });

    // Modal close functionality
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        document.getElementById('updateUserModal').style.display = 'none';
    });

    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('updateUserModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

function fetchAllUsers(token) {
    fetch('https://makimobackend.onrender.com/api/users/admin/getAll', {
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
        if (data.length > 0) {
            displayUsers(data);
        } else {
            document.getElementById('user-table-body').innerHTML = '<tr><td colspan="8">No users found</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error fetching users:', error);
        document.getElementById('user-table-body').innerHTML = '<tr><td colspan="8">Error loading users</td></tr>';
    });
}

function displayUsers(users) {
    const tableBody = document.getElementById('user-table-body');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const createdAt = new Date(user.createdAt).toLocaleString();
        const updatedAt = new Date(user.updatedAt).toLocaleString();

        const row = `
            <tr>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${createdAt}</td>
                <td>${updatedAt}</td>
                <td><button class="update-btn" data-userid="${user._id}">Update</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Add event listeners to Update buttons
    tableBody.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.getAttribute('data-userid');
            const user = users.find(u => u._id === userId);
            openUpdateModal(user);
        });
    });
}

function openUpdateModal(user) {
    if (!user) {
        console.error('User is undefined or null');
        return;
    }

    const modalUserIdInput = document.getElementById('modalUserId');
    const modalFirstNameInput = document.getElementById('modalFirstName');
    const modalLastNameInput = document.getElementById('modalLastName');
    const modalUsernameInput = document.getElementById('modalUsername');
    const modalEmailInput = document.getElementById('modalEmail');
    const modalRoleInput = document.getElementById('modalRole');
    const modalCreatedAtInput = document.getElementById('modalCreatedAt');
    const modalUpdatedAtInput = document.getElementById('modalUpdatedAt');

    // Check if modal elements are accessible
    if (!modalUserIdInput || !modalFirstNameInput || !modalLastNameInput ||
        !modalUsernameInput || !modalEmailInput || !modalRoleInput ||
        !modalCreatedAtInput || !modalUpdatedAtInput) {
        console.error('Modal elements not found');
        return;
    }

    // Populate modal with user data
    modalUserIdInput.value = user._id;
    modalFirstNameInput.value = user.firstName;
    modalLastNameInput.value = user.lastName;
    modalUsernameInput.value = user.username;

    // Debug logging to check if username is properly assigned
    console.log('Username in openUpdateModal:', user.username);

    modalEmailInput.value = user.email;
    modalRoleInput.value = user.role;
    modalCreatedAtInput.value = new Date(user.createdAt).toLocaleString();
    modalUpdatedAtInput.value = new Date().toLocaleString(); // Set current date/time for updated at

    // Disable createdAt field
    modalCreatedAtInput.disabled = true;

    // Display the modal
    document.getElementById('updateUserModal').style.display = 'block';
}

function updateUser(user) {
    const userId = user.userId;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const username = user.username; // Ensure username is being used here
    const email = user.email;
    const role = user.role;
    const token = localStorage.getItem('token');

    // Logging for debugging purposes
    console.log('Updating user with data:', { userId, firstName, lastName, username, email, role });

    fetch(`https://makimobackend.onrender.com/api/users/admin/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ firstName, lastName, username, email, role })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'User updated successfully') {
            alert('User updated successfully');
            document.getElementById('updateUserModal').style.display = 'none';
            fetchAllUsers(token); // Refresh users table after update
        } else {
            alert('Error updating user');
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Error updating user');
    });
}
