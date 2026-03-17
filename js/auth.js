const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; 

function checkAccess() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    const registeredUser = localStorage.getItem('registeredUser');

    if (!registeredUser) {
        if (!window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
        }
        return;
    }

    if (session) {
        const currentTime = new Date().getTime();
        if (currentTime - session.loginTime < SESSION_DURATION) {
            if (window.location.href.includes('index.html')) {
                window.location.href = 'dashboard.html';
            }
            return;
        }
    }

    if (!window.location.href.includes('index.html')) {
        localStorage.removeItem('userSession'); 
        window.location.href = 'index.html';
    }
}

function handleAuth(inputUser, inputPass) {
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));
    if (!registeredUser) {
        localStorage.setItem('registeredUser', JSON.stringify({ username: inputUser, password: inputPass }));
        createSession();
        return "DAFTAR_SUKSES";
    } else {
        if (inputUser === registeredUser.username && inputPass === registeredUser.password) {
            createSession();
            return "LOGIN_SUKSES";
        } else {
            return "SALAH_PASSWORD";
        }
    }
}

function createSession() {
    localStorage.setItem('userSession', JSON.stringify({ loginTime: new Date().getTime() }));
}

checkAccess();
