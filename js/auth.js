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
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        // "Kunci" Keamanan: Simpan session di localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html'; // Pindah ke dashboard
    } else {
        alert("Email atau Password salah!");
    }
});

// 4. ROUTE GUARD (Proteksi Halaman)
// Fungsi ini dijalankan di dashboard.html nanti
function checkAccess() {
    const isLogged = localStorage.getItem('isLoggedIn');
    if (!isLogged) {
        window.location.href = 'index.html'; // Tendang balik kalau nekat
    }
}
