// 1. KONFIGURASI SESI (7 Hari)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; 

// 2. FUNGSI CEK AKSES (Hanya satu, biar gak bentrok)
function checkAccess() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    const registeredUser = localStorage.getItem('registeredUser');

    // Jika belum ada user terdaftar sama sekali (User Baru)
    if (!registeredUser) {
        if (!window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
        }
        return;
    }

    // Jika sudah ada user, cek sesi 7 hari
    if (session) {
        const currentTime = new Date().getTime();
        if (currentTime - session.loginTime < SESSION_DURATION) {
            // Sesi VALID - Auto-login ke dashboard
            if (window.location.href.includes('index.html')) {
                window.location.href = 'dashboard.html';
            }
            return;
        }
    }

    // Jika sesi habis/tidak ada dan nekat buka dashboard
    if (!window.location.href.includes('index.html')) {
        localStorage.removeItem('userSession'); 
        window.location.href = 'index.html';
    }
}

// 3. LOGIKA LOGIN / DAFTAR (Disatukan agar simpel)
function handleAuth(inputUser, inputPass) {
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!registeredUser) {
        // JIKA USER PERTAMA: Langsung jadikan akun utama
        const newUser = { username: inputUser, password: inputPass };
        localStorage.setItem('registeredUser', JSON.stringify(newUser));
        createSession();
        return "DAFTAR_SUKSES";
    } else {
        // JIKA SUDAH ADA USER: Cek Password
        if (inputUser === registeredUser.username && inputPass === registeredUser.password) {
            createSession();
            return "LOGIN_SUKSES";
        } else {
            return "SALAH_PASSWORD";
        }
    }
}

// 4. FUNGSI BUAT SESI
function createSession() {
    const session = {
        loginTime: new Date().getTime()
    };
    localStorage.setItem('userSession', JSON.stringify(session));
}

// JALANKAN CEK AKSES OTOMATIS
checkAccess();
