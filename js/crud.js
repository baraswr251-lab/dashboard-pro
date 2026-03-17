let products = JSON.parse(localStorage.getItem('myProducts')) || [];

// BAGIAN 1: KONTROL POP-UP
function showAddForm() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.setProperty('display', 'flex', 'important');
}

function closeForm() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.setProperty('display', 'none', 'important');
}

// BAGIAN 2: LOGIKA SIMPAN
function saveProduct() {
    const name = document.getElementById('pName').value;
    const stock = document.getElementById('pStock').value;
    const price = document.getElementById('pPrice').value;

    if (name && stock && price) {
        const sValue = parseInt(stock);
        const newProduct = {
            id: Date.now(),
            name: name,
            stock: sValue,
            price: parseInt(price)
        };

        products.push(newProduct);
        localStorage.setItem('myProducts', JSON.stringify(products));
        
        // Reset Form
        document.getElementById('pName').value = '';
        document.getElementById('pStock').value = '';
        document.getElementById('pPrice').value = '';
        
        closeForm();
        renderTable();
        updateStats();

        // NOTIFIKASI PREMIUM
        if (sValue <= 5) {
            Swal.fire({
                title: 'Berhasil!',
                text: 'Produk tersimpan, tapi stok menipis (≤ 5)!',
                icon: 'warning',
                confirmButtonColor: '#3085d6'
            });
        } else {
            Swal.fire({
                title: 'Berhasil!',
                text: 'Produk baru telah ditambahkan.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    } else {
        Swal.fire({
            title: 'Waduh!',
            text: 'Isi semua data dulu, Bos!',
            icon: 'error',
            confirmButtonColor: '#d33'
        });
    }
}

// BAGIAN 3: UPDATE TAMPILAN (ID SUDAH DISINKRONKAN)
function updateStats() {
    const totalProd = products.length;
    const totalStok = products.reduce((sum, item) => sum + item.stock, 0);
    const totalAset = products.reduce((sum, item) => sum + (item.stock * item.price), 0);

    // Target ID harus pas sama di dashboard.html
    if(document.getElementById('totalProducts')) document.getElementById('totalProducts').innerText = totalProd;
    if(document.getElementById('totalStock')) document.getElementById('totalStock').innerText = totalStok;
    if(document.getElementById('totalValue')) document.getElementById('totalValue').innerText = totalAset.toLocaleString('id-ID');
}

function renderTable() {
    const tableBody = document.getElementById('productTable');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    products.forEach((item) => {
        // 1. Logika Cek Stok: Kalau <= 5, kasih class CSS khusus
        const isLowStock = item.stock <= 5;
        const rowClass = isLowStock ? 'table-warning-custom' : '';
        
        // 2. Tambahin label "Stok Menipis" kalau stok dikit
        const stockAlert = isLowStock 
            ? `<br><span class="badge-low-stock">Stok Menipis!</span>` 
            : '';

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td class="fw-bold text-start ps-3">
                    ${item.name} ${stockAlert}
                </td>
                <td class="align-middle">${item.stock}</td>
                <td class="align-middle">Rp ${item.price.toLocaleString('id-ID')}</td>
                <td class="align-middle">
                    <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteProduct(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
}

function deleteProduct(id) {
    Swal.fire({
        title: 'Yakin mau hapus?',
        text: "Data yang dihapus nggak bisa balik lagi, Bos!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jalankan proses hapus
            products = products.filter(p => p.id !== id);
            localStorage.setItem('myProducts', JSON.stringify(products));
            
            // Refresh tampilan
            renderTable();
            updateStats();

            // Notif sukses hapus
            Swal.fire(
                'Terhapus!',
                'Barang lo udah ilang dari daftar.',
                'success'
            );
        }
    });
}
// Inisialisasi awal
window.onload = () => {
    renderTable();
    updateStats();
};
function searchData() {
    // 1. Ambil kata kunci dari input, ubah ke huruf kecil biar gak sensitif
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('productTable');
    
    // 2. Filter data dari array products utama
    const filteredProducts = products.filter(item => {
        return item.name.toLowerCase().includes(keyword);
    });

    // 3. Tampilkan hasil filter ke tabel (pake logika yang mirip renderTable)
    tableBody.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-muted py-4">Barang tidak ditemukan...</td></tr>`;
        return;
    }

    filteredProducts.forEach((item) => {
        const isLowStock = item.stock <= 5;
        const rowClass = isLowStock ? 'table-warning-custom' : '';
        const stockAlert = isLowStock ? `<br><span class="badge-low-stock">Stok Menipis!</span>` : '';

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td class="fw-bold text-start ps-3">${item.name} ${stockAlert}</td>
                <td class="align-middle">${item.stock}</td>
                <td class="align-middle">Rp ${item.price.toLocaleString('id-ID')}</td>
                <td class="align-middle">
                    <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteProduct(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
}
