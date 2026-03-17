// 1. FUNGSI TOGGLE (Pindah pindah tampilan Login/Register)
function toggleAuth() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('registerForm').classList.toggle('hidden');
    const title = document.getElementById('authTitle');
    title.innerText = title.innerText === 'Login' ? 'Register' : 'Login';
}

// 2. LOGIKA REGISTER (Simpan ke LocalStorage)
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Cek apakah email sudah terdaftar
    if (users.find(u => u.email === email)) {
        return alert("Email ini sudah dipakai!");
    }

    users.push({ name, email, pass });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Akun berhasil dibuat! Silakan Login.");
    toggleAuth();
});

// 3. LOGIKA LOGIN
// Konfigurasi: 7 Hari dalam milidetik
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; 

// 1. FUNGSI CEK AKSES (Taruh di paling atas)
function checkAccess() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    const userData = localStorage.getItem('registeredUser');

    // Jika belum ada user terdaftar sama sekali, lempar ke halaman daftar/login
    if (!userData) {
        if (!window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
        }
        return;
    }

    // Cek apakah sesi masih berlaku
    if (session) {
        const currentTime = new Date().getTime();
        if (currentTime - session.loginTime < SESSION_DURATION) {
            // Sesi VALID - Jika di login page, langsung lempar ke dashboard
            if (window.location.href.includes('index.html')) {
                window.location.href = 'dashboard.html';
            }
            return;
        }
    }

    // Jika sesi habis/tidak ada dan mencoba buka dashboard
    if (!window.location.href.includes('index.html')) {
        localStorage.removeItem('userSession'); // Bersihkan sesi basi
        window.location.href = 'index.html';
    }
}

// 2. FUNGSI LOGIN / DAFTAR
function handleAuth(inputUser, inputPass) {
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!registeredUser) {
        // JIKA USER PERTAMA: Langsung Daftarkan
        const newUser = { username: inputUser, password: inputPass };
        localStorage.setItem('registeredUser', JSON.stringify(newUser));
        createSession();
        return "DAFTAR_SUKSES";
    } else {
        // JIKA SUDAH ADA USER: Cek Login
        if (inputUser === registeredUser.username && inputPass === registeredUser.password) {
            createSession();
            return "LOGIN_SUKSES";
        } else {
            return "SALAH_PASSWORD";
        }
    }
}

function createSession() {
    const session = {
        loginTime: new Date().getTime()
    };
    localStorage.setItem('userSession', JSON.stringify(session));
}

// Jalankan cek akses tiap file di-load
checkAccess();

// 4. ROUTE GUARD (Proteksi Halaman)
// Fungsi ini dijalankan di dashboard.html nanti
function checkAccess() {
    const isLogged = localStorage.getItem('isLoggedIn');
    if (!isLogged) {
        window.location.href = 'index.html'; // Tendang balik kalau nekat
    }
}
