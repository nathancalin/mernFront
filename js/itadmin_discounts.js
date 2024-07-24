document.addEventListener('DOMContentLoaded', function() {
    fetchDiscounts();
    fetchUsedDiscounts();

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
            row.innerHTML = `
                <td>${discount.name}</td>
                <td>${discount.description}</td>
                <td>${discount.uniqueCode}</td>
                <td>${new Date(discount.expiryDate).toLocaleDateString()}</td>
                <td>
                    <button onclick="openEditModal('${discount._id}')">Edit</button>
                    <button onclick="markAsUsed('${discount._id}')">Mark as Used</button>
                </td>
            `;
            discountTable.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching discounts:', error));
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
        document.querySelector('#editExpiryDate').value = discount.expiryDate.split('T')[0];
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
    const expiryDate = document.querySelector('#createExpiryDate').value;

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
    .then(() => {
        document.querySelector('#createName').value = '';
        document.querySelector('#createDescription').value = '';
        document.querySelector('#createUniqueCode').value = '';
        document.querySelector('#createExpiryDate').value = '';
        document.querySelector('#successNotification').style.display = 'block';
        setTimeout(() => {
            document.querySelector('#successNotification').style.display = 'none';
        }, 3000);
        fetchDiscounts();
    })
    .catch(error => console.error('Error creating discount:', error));
}

function updateDiscount() {
    const discountId = document.querySelector('#editDiscountId').value;
    const name = document.querySelector('#editName').value;
    const description = document.querySelector('#editDescription').value;
    const uniqueCode = document.querySelector('#editUniqueCode').value;
    const expiryDate = document.querySelector('#editExpiryDate').value;

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
    .then(() => {
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
            row.innerHTML = `
                <td>${discount.name}</td>
                <td>${discount.description}</td>
                <td>${discount.uniqueCode}</td>
                <td>${new Date(discount.expiryDate).toLocaleDateString()}</td>
            `;
            usedDiscountsTable.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching used discounts:', error));
}
