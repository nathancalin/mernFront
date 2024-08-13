const nextButtons = document.querySelectorAll('.next-btn');
const slides = document.querySelectorAll('.slide');
const token = localStorage.getItem('token');
const userId = getUserIdFromToken(token);

    function getUserIdFromToken(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    }

let currentSlide = 0;

nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = index + 1;
        slides[currentSlide].classList.add('active');
    });
});

document.querySelector('.start-btn').addEventListener('click', () => {
    alert('Starting the game...');
    // Here you can redirect to the game page
    window.location.href = '/game/index.html?token=' + token;
});
