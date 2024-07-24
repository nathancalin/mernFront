// Function to handle pagination navigation
function navigatePagination(direction) {
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');

    // Check if elements exist
    if (!currentPageElement || !totalPagesElement) {
        console.error('Pagination elements not found in the DOM');
        return;
    }

    let currentPage = parseInt(currentPageElement.textContent);
    const totalPages = parseInt(totalPagesElement.textContent);

    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    fetchDiscounts(currentPage);
}

// Function to fetch discounts
async function fetchDiscounts(pageNumber = 1) {
    try {
        const response = await fetch(`https://makimobackend.onrender.com/api/discounts/getall?page=${pageNumber}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            if (Array.isArray(responseData.discounts)) {
                const unclaimedDiscounts = responseData.discounts.filter(discount => !discount.userId);
                displayDiscounts(unclaimedDiscounts);
                updatePagination(responseData.currentPage, responseData.totalPages);
            } else {
                console.error('Error fetching discounts: Unexpected response format', responseData);
            }
        } else {
            console.error('Error fetching discounts:', response.status);
        }
    } catch (error) {
        console.error('Error fetching discounts:', error);
    }
}

// Function to update pagination information
function updatePagination(currentPage, totalPages) {
    const paginationInfo = document.getElementById('paginationInfo');
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');

    if (paginationInfo && currentPageElement && totalPagesElement) {
        currentPageElement.textContent = currentPage;
        totalPagesElement.textContent = totalPages;
    } else {
        console.error('Pagination elements not found in the DOM');
    }

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Function to fetch claimed discounts
async function fetchClaimedDiscounts() {
    try {
        const response = await fetch('https://makimobackend.onrender.com/api/discounts/getclaimeddiscounts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            const claimedDiscounts = await response.json();
            displayClaimedDiscounts(claimedDiscounts);
        } else {
            console.error('Error fetching claimed discounts:', response.status);
        }
    } catch (error) {
        console.error('Error fetching claimed discounts:', error);
    }
}

// Function to display discounts
function displayDiscounts(discounts) {
    const discountsBody = document.getElementById('discountsBody');
    discountsBody.innerHTML = discounts.map(discount => `
        <tr>
            <td>${discount.name}</td>
            <td>${discount.description}</td>
            <td>${discount.uniqueCode}</td>
            <td>${new Date(discount.expiryDate).toLocaleDateString()}</td>
            <td><button onclick="claimDiscount('${discount._id}')">Claim</button></td>
        </tr>
    `).join('');
}

// Function to display claimed discounts
function displayClaimedDiscounts(claimedDiscounts) {
    const claimedDiscountsContainer = document.getElementById('claimedDiscounts');
    if (claimedDiscountsContainer) {
        claimedDiscountsContainer.innerHTML = `
            <h2>Claimed Discounts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Unique Code</th>
                        <th>Expiry Date</th>
                        <th>Used</th>
                    </tr>
                </thead>
                <tbody>
                    ${claimedDiscounts.map(claimedDiscount => `
                        <tr>
                            <td>${claimedDiscount.name}</td>
                            <td>${claimedDiscount.description}</td>
                            <td>${claimedDiscount.uniqueCode}</td>
                            <td>${new Date(claimedDiscount.expiryDate).toLocaleDateString()}</td>
                            <td>${claimedDiscount.used ? 'Yes' : 'No'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        console.error('Claimed discounts container not found');
    }
}

// Function to claim a discount
async function claimDiscount(discountId) {
    if (confirm("Are you sure you want to claim this discount?")) {
        try {
            const response = await fetch(`https://makimobackend.onrender.com/api/discounts/claim/${discountId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                alert('Discount claimed successfully!');
                fetchDiscounts();
            } else {
                console.error('Error claiming discount:', response.status);
            }
        } catch (error) {
            console.error('Error claiming discount:', error);
        }
    }
}

// Setup event listeners and initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch discounts and claimed discounts
    fetchDiscounts();
    fetchClaimedDiscounts();

    // Add event listeners
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    document.getElementById('prevButton').addEventListener('click', () => navigatePagination('prev'));
    document.getElementById('nextButton').addEventListener('click', () => navigatePagination('next'));
});
