document.addEventListener('DOMContentLoaded', () => {
    console.log('SuperAdmin levels page loaded');

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

    fetchAllLevels(token);

    // Add event listener for create level form submission
    document.getElementById('createLevelForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const levelNumber = document.getElementById('levelNumber').value;
        const description = document.getElementById('description').value;
        const difficulty = document.getElementById('difficulty').value;
        const maxScore = document.getElementById('maxScore').value;
        createLevel({ levelNumber, description, difficulty, maxScore });
    });

    // Add event listener for update level form submission
    document.getElementById('updateLevelForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const levelId = document.getElementById('modalLevelId').value;
        const levelNumber = document.getElementById('modalLevelNumber').value;
        const description = document.getElementById('modalDescription').value;
        const difficulty = document.getElementById('modalDifficulty').value;
        const maxScore = document.getElementById('modalMaxScore').value;
        updateLevel({ levelId, levelNumber, description, difficulty, maxScore });
    });

    // Modal close functionality
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        document.getElementById('updateLevelModal').style.display = 'none';
    });

    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('updateLevelModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

function fetchAllLevels(token) {
    fetch('https://makimobackend.onrender.com/api/levels/getall', {
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
        console.log('Fetched data:', data);

        if (data && data.length > 0) {
            displayLevels(data);
        } else {
            document.getElementById('level-table-body').innerHTML = '<tr><td colspan="5">No levels found</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error fetching levels:', error);
        document.getElementById('level-table-body').innerHTML = '<tr><td colspan="5">Error loading levels</td></tr>';
    });
}

function displayLevels(levels) {
    const tableBody = document.getElementById('level-table-body');
    tableBody.innerHTML = '';

    levels.forEach(level => {
        const row = `
            <tr>
                <td>${level.levelNumber}</td>
                <td>${level.description}</td>
                <td>${level.difficulty}</td>
                <td>${level.maxScore}</td>
                <td>
                    <button class="update-btn" data-levelid="${level._id}">Update</button>
                    <button class="delete-btn" data-levelid="${level._id}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Add event listeners to Update buttons
    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const level = {
                levelId: event.target.dataset.levelid,
                levelNumber: row.cells[0].textContent,
                description: row.cells[1].textContent,
                difficulty: row.cells[2].textContent,
                maxScore: row.cells[3].textContent
            };
            openUpdateModal(level);
        });
    });

    // Add event listeners to Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const levelId = event.target.dataset.levelid;
            deleteLevel(levelId);
        });
    });
}

function openUpdateModal(level) {
    populateModal(level);
    document.getElementById('updateLevelModal').style.display = 'block';
}

function populateModal(level) {
    document.getElementById('modalLevelId').value = level.levelId;
    document.getElementById('modalLevelNumber').value = level.levelNumber;
    document.getElementById('modalDescription').value = level.description;
    document.getElementById('modalDifficulty').value = level.difficulty;
    document.getElementById('modalMaxScore').value = level.maxScore;
}

function createLevel(level) {
    const token = localStorage.getItem('token');

    fetch('https://makimobackend.onrender.com/api/levels/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(level)
    })
    .then(response => response.json())
    .then(data => {
        if (data._id) {
            alert('Level created successfully');
            fetchAllLevels(token);
            document.getElementById('createLevelForm').reset();
        } else {
            alert('Error creating level');
        }
    })
    .catch(error => {
        console.error('Error creating level:', error);
    });
}

function updateLevel(level) {
    const token = localStorage.getItem('token');

    fetch(`https://makimobackend.onrender.com/api/levels/update/${level.levelId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(level)
    })
    .then(response => response.json())
    .then(data => {
        if (data._id) {
            alert('Level updated successfully');
            fetchAllLevels(token);
            document.getElementById('updateLevelModal').style.display = 'none';
        } else {
            alert('Error updating level');
        }
    })
    .catch(error => {
        console.error('Error updating level:', error);
    });
}

function deleteLevel(levelId) {
    const token = localStorage.getItem('token');

    fetch(`https://makimobackend.onrender.com/api/levels/delete/${levelId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Level deleted successfully');
            fetchAllLevels(token);
        } else {
            alert('Error deleting level');
        }
    })
    .catch(error => {
        console.error('Error deleting level:', error);
    });
}
