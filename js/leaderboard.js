// Function to fetch leaderboard data
async function fetchLeaderboard() {
    try {
        const response = await fetch('https://makimobackend.onrender.com/api/leaderboards/getAll', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const leaderboards = await response.json();
            // Sort leaderboards by rank in ascending order
            leaderboards.sort((a, b) => a.rank - b.rank);
            displayLeaderboard(leaderboards);
        } else {
            console.error('Error fetching leaderboard:', response.status);
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}


// Function to display leaderboard
function displayLeaderboard(leaderboards) {
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    if (leaderboardContainer) {
        leaderboardContainer.innerHTML = `
            <h2>Top Scorers</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Total Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaderboards.map(leaderboard => `
                        <tr>
                            <td>${leaderboard.rank}</td>
                            <td>${leaderboard.firstName}</td>
                            <td>${leaderboard.lastName}</td>
                            <td>${leaderboard.totalScore}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        console.error('Leaderboard container not found');
    }
}

// Setup event listeners and initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch leaderboard data
    fetchLeaderboard();

    // Add event listeners
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});
