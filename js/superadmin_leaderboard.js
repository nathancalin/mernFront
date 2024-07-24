document.addEventListener('DOMContentLoaded', () => {
    console.log('Super Admin leaderboard page loaded');

    // Logout event listener
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

    fetchAllLeaderboardEntries(token);

    // Event listener for update form submission
    document.getElementById('updateLeaderboardForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const leaderboardId = document.getElementById('modalLeaderboardId').value;
        const profileID = document.getElementById('modalProfileID').value;
        const firstName = document.getElementById('modalFirstName').value;
        const lastName = document.getElementById('modalLastName').value;
        const totalScore = document.getElementById('modalTotalScore').value;
        updateLeaderboardEntry({ leaderboardId, profileID, firstName, lastName, totalScore });
    });

    // Modal close functionality
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        document.getElementById('updateLeaderboardModal').style.display = 'none';
    });

    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('updateLeaderboardModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

function fetchAllLeaderboardEntries(token) {
    fetch('https://makimobackend.onrender.com/api/leaderboards/getAll', {
        method: 'GET',
        headers: {
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
        console.log('Fetched leaderboard data:', data);

        if (data && data.length > 0) {
            displayLeaderboardEntries(data);
        } else {
            document.getElementById('leaderboard-table-body').innerHTML = '<tr><td colspan="6">No leaderboard entries found</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error fetching leaderboard entries:', error);
        document.getElementById('leaderboard-table-body').innerHTML = '<tr><td colspan="6">Error loading leaderboard entries</td></tr>';
    });
}

function displayLeaderboardEntries(entries) {
    // Sort entries by rank
    entries.sort((a, b) => a.rank - b.rank);

    const tableBody = document.getElementById('leaderboard-table-body');
    tableBody.innerHTML = '';

    entries.forEach(entry => {
        const row = `
            <tr>
                <td>${entry.profileID}</td>
                <td>${entry.firstName}</td>
                <td>${entry.lastName}</td>
                <td>${entry.totalScore}</td>
                <td>${entry.rank}</td>
                <td>
                    <button class="update-btn" data-leaderboardid="${entry._id}">Update</button>
                    <button class="delete-btn" data-leaderboardid="${entry._id}">Delete</button>
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
            const entry = {
                leaderboardId: event.target.dataset.leaderboardid,
                profileID: row.cells[0].textContent,
                firstName: row.cells[1].textContent,
                lastName: row.cells[2].textContent,
                totalScore: row.cells[3].textContent
            };
            openUpdateModal(entry);
        });
    });

    // Add event listeners to Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const leaderboardId = event.target.dataset.leaderboardid;
            if (confirm('Are you sure you want to delete this entry?')) {
                deleteLeaderboardEntry(leaderboardId);
            }
        });
    });
}

function openUpdateModal(entry) {
    populateModal(entry);
    document.getElementById('updateLeaderboardModal').style.display = 'block';
}

function populateModal(entry) {
    document.getElementById('modalLeaderboardId').value = entry.leaderboardId;
    document.getElementById('modalProfileID').value = entry.profileID;
    document.getElementById('modalFirstName').value = entry.firstName;
    document.getElementById('modalLastName').value = entry.lastName;
    document.getElementById('modalTotalScore').value = entry.totalScore;
}

function updateLeaderboardEntry(entry) {
    const token = localStorage.getItem('token');

    fetch(`https://makimobackend.onrender.com/api/leaderboards/admin/update/${entry.leaderboardId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            profileID: entry.profileID,
            firstName: entry.firstName,
            lastName: entry.lastName,
            totalScore: entry.totalScore
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data._id) {
            alert('Leaderboard entry updated successfully');
            fetchAllLeaderboardEntries(token);
            document.getElementById('updateLeaderboardModal').style.display = 'none';
        } else {
            alert('Error updating leaderboard entry');
        }
    })
    .catch(error => {
        console.error('Error updating leaderboard entry:', error);
        alert('Error updating leaderboard entry');
    });
}

function deleteLeaderboardEntry(leaderboardId) {
    const token = localStorage.getItem('token');

    fetch(`https://makimobackend.onrender.com/api/leaderboards/delete/${leaderboardId}`, {
        method: 'DELETE',
        headers: {
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
        if (data.message === 'Leaderboard deleted successfully') {
            alert(data.message);
            fetchAllLeaderboardEntries(token);
        } else {
            alert('Error deleting leaderboard entry');
        }
    })
    .catch(error => {
        console.error('Error deleting leaderboard entry:', error);
        alert('Error deleting leaderboard entry');
    });
}
