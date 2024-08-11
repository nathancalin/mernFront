document.addEventListener('DOMContentLoaded', () => {
    console.log('Super Admin user page loaded');

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
        const username = document.getElementById('modalUsername').value;
        const email = document.getElementById('modalEmail').value;
        const role = document.getElementById('modalRole').value;
        updateUser({ userId, firstName, lastName, username, email, role });
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

    // Add filtering functionality
    document.getElementById('userFilter').addEventListener('input', filterUsers);

    // Add sorting functionality
    document.getElementById('userSort').addEventListener('change', sortUsers);
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
                <td>
                    <button class="update-btn" data-userid="${user._id}">Update</button>
                    <button class="delete-btn" data-userid="${user._id}">Delete</button>
                </td>
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

    // Add event listeners to Delete buttons
    tableBody.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.getAttribute('data-userid');
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(userId);
            }
        });
    });
}

function filterUsers(event) {
    const filterValue = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#user-table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const [firstName, lastName, username, email, role] = cells;

        if (firstName.textContent.toLowerCase().includes(filterValue) ||
            lastName.textContent.toLowerCase().includes(filterValue) ||
            username.textContent.toLowerCase().includes(filterValue) ||
            email.textContent.toLowerCase().includes(filterValue) ||
            role.textContent.toLowerCase().includes(filterValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function sortUsers(event) {
    const sortBy = event.target.value;
    const tableBody = document.getElementById('user-table-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aText = a.querySelector(`td:nth-child(${getSortIndex(sortBy)})`).textContent.toLowerCase();
        const bText = b.querySelector(`td:nth-child(${getSortIndex(sortBy)})`).textContent.toLowerCase();

        if (aText < bText) return -1;
        if (aText > bText) return 1;
        return 0;
    });

    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}

function getSortIndex(sortBy) {
    switch (sortBy) {
        case 'firstName':
            return 1;
        case 'lastName':
            return 2;
        case 'username':
            return 3;
        case 'email':
            return 4;
        case 'role':
            return 5;
        case 'createdAt':
            return 6;
        default:
            return 1;
    }
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
    const username = user.username;
    const email = user.email;
    const role = user.role;
    const token = localStorage.getItem('token');

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
        console.log('User updated successfully:', data.message);
        fetchAllUsers(token); // Refresh the user list after update
        document.getElementById('updateUserModal').style.display = 'none'; // Close modal
    })
    .catch(error => {
        console.error('Error updating user:', error);
        // Handle error display if needed
    });
}

function deleteUser(userId) {
    const token = localStorage.getItem('token');

    fetch(`https://makimobackend.onrender.com/api/users/admin/delete/${userId}`, {
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
        console.log('User deleted successfully:', data.message);
        fetchAllUsers(token); // Refresh the user list after deletion
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        // Handle error display if needed
    });
}
