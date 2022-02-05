const gameBtn = document.getElementById('play');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logoutbtn');


function routeToGame() {
    window.location.replace('/game');
}

function routeToLogin() {
    window.location.replace('/login');
}

const logoutroute = async () => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        document.location.replace('/');
        localStorage.clear();
    } else {
        alert('Failed to log out.');
    }
};


gameBtn.addEventListener("click", routeToGame);
if (!logoutBtn) {
    loginBtn.addEventListener("click", routeToLogin);
}
if (!loginBtn) {
    logoutBtn.addEventListener('click', logoutroute);
}