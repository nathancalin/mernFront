document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://makimobackend.onrender.com/api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, username, email, password })
    });

    const data = await response.json();
    console.log(data);

    if (response.status === 201) {
        alert('User successfully created');
        document.getElementById('signupForm').reset();
    } else {
        alert('Error creating user: ' + data.message);
    }
});
