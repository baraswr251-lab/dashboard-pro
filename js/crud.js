// Data disimpan di LocalStorage supaya nggak hilang pas di-refresh
let products = JSON.parse(localStorage.getItem('myProducts')) || [];

// Fungsi nampilin Form Tambah
function showAddForm() {
    document.getElementById('addModal').classList.remove('hidden');
    document.getElementById('addModal').style.display = 'flex';
}

// Fungsi tutup Form
function closeForm() {
    document.getElementById('addModal').classList.add('hidden');
    document.getElementById('addModal').style.display = 'none';
}

// Fungsi Simpan Barang
function saveProduct() {
    const name = document.getElementById('pName').value;
    const stock = document.getElementById('pStock').value;
    const price = document.getElementById('pPrice').value;

    if (name && stock && price) {
        const newProduct = {
            id: Date.now(),
            name: name,
            stock: parseInt(stock),
            price: parseInt(price)
        };

        products.push(newProduct);
        localStorage.setItem('myProducts', JSON.stringify(products));
        
        // Reset form dan tutup
        document.getElementById('pName').value = '';
        document.getElementById('pStock').value = '';
        document.getElementById('pPrice').value = '';
        closeForm();
        
        // Refresh tampilan
        renderTable();
        updateStats();
    } else {
        alert("Isi semua data dulu, Bos!");
    }
}

// Fungsi Update Angka-angka di Kotak Atas
function updateStats() {
    const totalProd = products.length;
    const totalStok = products.reduce((sum, item) => sum + item.stock, 0);
    const totalAset = products.reduce((sum, item) => sum + (item.stock * item.price), 0);

    document.getElementById('totalProducts').innerText = totalProd;
    document.getElementById('totalStok').innerText = totalStok;
    // Format Rupiah sederhana
    document.querySelector('.card h3:nth-child(1)').parentElement.querySelectorAll('h3')[2].innerText = "Rp " + totalAset.toLocaleString();
}

// Fungsi Nampilin Data ke Tabel
function renderTable() {
    const tableBody = document.getElementById('productTable');
    tableBody.innerHTML = '';

    products.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.stock}</td>
                <td>Rp ${item.price.toLocaleString()}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${item.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

// Fungsi Hapus Barang
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('myProducts', JSON.stringify(products));
    renderTable();
    updateStats();
}

// Jalankan fungsi saat halaman dibuka
window.onload = function() {
    renderTable();
    updateStats();
};
