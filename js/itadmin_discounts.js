document.addEventListener('DOMContentLoaded', function() {
    fetchDiscounts();
    fetchUsedDiscounts();

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

    document.querySelector('#createDiscountButton').addEventListener('click', createDiscount);
});

function fetchDiscounts() {
    fetch('https://makimobackend.onrender.com/api/discounts/admin/getall', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const discountTable = document.querySelector('#discountsTable tbody');
        discountTable.innerHTML = '';

        data.discounts.forEach(discount => {
            const row = document.createElement('tr');
            const expiryDate = new Date(discount.expiryDate);
            row.innerHTML = `
                <td>${discount.name}</td>
                <td>${discount.description}</td>
                <td>${discount.uniqueCode}</td>
                <td>${expiryDate.toLocaleString()}</td>
                <td>
                    <button onclick="openEditModal('${discount._id}')">Edit</button>
                    <button onclick="markAsUsed('${discount._id}')">Mark as Used</button>
                    
                </td>
            `;
            discountTable.appendChild(row);
        });
        
        // Apply filter and sorting after fetching data
        filterDiscounts();
        sortDiscounts();
    })
    .catch(error => console.error('Error fetching discounts:', error));
}

function filterDiscounts() {
    const filterInput = document.getElementById('filterInput').value.toLowerCase();
    const discountsTable = document.getElementById('discountsTable');
    const rows = discountsTable.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        const nameCell = rows[i].getElementsByTagName('td')[0];
        const uniqueCodeCell = rows[i].getElementsByTagName('td')[2];
        const name = nameCell.textContent.toLowerCase();
        const uniqueCode = uniqueCodeCell.textContent.toLowerCase();

        if (name.includes(filterInput) || uniqueCode.includes(filterInput)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}


function sortDiscounts() {
    const sortSelect = document.querySelector('#sortSelect').value;
    const rows = Array.from(document.querySelectorAll('#discountsTable tbody tr'));

    rows.sort((a, b) => {
        const aValue = sortSelect === 'name' ? a.querySelector('td:first-child').textContent.toLowerCase() : new Date(a.querySelector('td:nth-child(4)').textContent);
        const bValue = sortSelect === 'name' ? b.querySelector('td:first-child').textContent.toLowerCase() : new Date(b.querySelector('td:nth-child(4)').textContent);

        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
    });

    const discountTableBody = document.querySelector('#discountsTable tbody');
    discountTableBody.innerHTML = '';
    rows.forEach(row => discountTableBody.appendChild(row));
}

// Filter used discounts by name or unique code
function filterUsedDiscounts() {
    const filterInput = document.querySelector('#usedfilterInput').value.toLowerCase();
    const rows = document.querySelectorAll('#usedDiscountsTable tbody tr');

    rows.forEach(row => {
        const name = row.querySelector('td:first-child').textContent.toLowerCase();
        const uniqueCode = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

        if (name.includes(filterInput) || uniqueCode.includes(filterInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Sort used discounts by name or expiry date
function sortUsedDiscounts() {
    const sortSelect = document.querySelector('#usedsortSelect').value;
    const tbody = document.querySelector('#usedDiscountsTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        let aValue, bValue;

        if (sortSelect === 'name') {
            aValue = a.querySelector('td:first-child').textContent.toLowerCase();
            bValue = b.querySelector('td:first-child').textContent.toLowerCase();
        } else if (sortSelect === 'expiryDate') {
            aValue = new Date(a.querySelector('td:nth-child(4)').textContent);
            bValue = new Date(b.querySelector('td:nth-child(4)').textContent);
        }

        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    // Clear the table body and append sorted rows
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

function openEditModal(discountId) {
    fetch(`https://makimobackend.onrender.com/api/discounts/get/${discountId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(discount => {
        document.querySelector('#editDiscountId').value = discount._id;
        document.querySelector('#editName').value = discount.name;
        document.querySelector('#editDescription').value = discount.description;
        document.querySelector('#editUniqueCode').value = discount.uniqueCode;

        // Format expiryDate for datetime-local input
        const expiryDate = new Date(discount.expiryDate);
        const formattedDate = expiryDate.toISOString().slice(0, 16);

        document.querySelector('#editExpiryDate').value = formattedDate;
        document.querySelector('#editModal').style.display = 'block';
    })
    .catch(error => console.error('Error fetching discount details:', error));
}


function closeEditModal() {
    document.querySelector('#editModal').style.display = 'none';
}

function createDiscount() {
    const name = document.querySelector('#createName').value;
    const description = document.querySelector('#createDescription').value;
    const uniqueCode = document.querySelector('#createUniqueCode').value;
    const expiryDate = new Date(document.querySelector('#createExpiryDate').value).toISOString(); // Convert to UTC

    fetch('https://makimobackend.onrender.com/api/discounts/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, description, uniqueCode, expiryDate })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.querySelector('#successNotification').style.display = 'block';
        setTimeout(() => {
            document.querySelector('#successNotification').style.display = 'none';
        }, 2000);

        // Clear form fields
        document.querySelector('#createName').value = '';
        document.querySelector('#createDescription').value = '';
        document.querySelector('#createUniqueCode').value = '';
        document.querySelector('#createExpiryDate').value = '';

        // Fetch updated discounts
        fetchDiscounts();
    })
    .catch(error => console.error('Error creating discount:', error));
}

function updateDiscount() {
    const discountId = document.querySelector('#editDiscountId').value;
    const name = document.querySelector('#editName').value;
    const description = document.querySelector('#editDescription').value;
    const uniqueCode = document.querySelector('#editUniqueCode').value;
    const expiryDate = new Date(document.querySelector('#editExpiryDate').value).toISOString(); // Convert to UTC

    fetch(`https://makimobackend.onrender.com/api/discounts/update/${discountId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, description, uniqueCode, expiryDate })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        closeEditModal();
        fetchDiscounts();
    })
    .catch(error => console.error('Error updating discount:', error));
}

function markAsUsed(discountId) {
    fetch(`https://makimobackend.onrender.com/api/discounts/markused/${discountId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        fetchDiscounts();
        fetchUsedDiscounts();
    })
    .catch(error => console.error('Error marking discount as used:', error));
}

function fetchUsedDiscounts() {
    fetch('https://makimobackend.onrender.com/api/discounts/getUsed', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const usedDiscountsTable = document.querySelector('#usedDiscountsTable tbody');
        usedDiscountsTable.innerHTML = '';

        data.usedDiscounts.forEach(discount => {
            const row = document.createElement('tr');
            const expiryDate = new Date(discount.expiryDate);
            row.innerHTML = `
                <td>${discount.name}</td>
                <td>${discount.description}</td>
                <td>${discount.uniqueCode}</td>
                <td>${expiryDate.toLocaleString()}</td>
                <td>
                    <button onclick="markAsUnused('${discount._id}')">Make Unused</button>
                    
                </td>
            `;
            usedDiscountsTable.appendChild(row);
        });
        
        // Apply filter and sorting after fetching data
        filterUsedDiscounts();
        sortUsedDiscounts();
    })
    .catch(error => console.error('Error fetching used discounts:', error));
}
