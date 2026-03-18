// 1. Inisialisasi Kunci Unik Per Akun
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userKey = currentUser ? `products_${currentUser.username}` : 'myProducts';

// 2. Ambil data barang
let products = JSON.parse(localStorage.getItem(userKey)) || [];

// 3. Fungsi Render Utama (Satu fungsi untuk semua kondisi)
function renderTable(dataToDisplay = products) {
    const tableBody = document.getElementById('productTable');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    dataToDisplay.forEach((item) => {
        const isLowStock = item.stock <= 5;
        const rowClass = isLowStock ? 'table-warning-custom' : '';
        // Pake <br> biar rapi di HP kalau ada alert limit
        const stockAlert = isLowStock ? `<br><span class="badge-low-stock">Limit!</span>` : '';

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td onclick="editField(${item.id}, 'name', '${item.name}')">
                    ${item.name}${stockAlert}
                </td>
                <td>
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="adjustStock(${item.id}, -1)">-</button>
                        <span class="fw-bold" style="min-width:25px" onclick="editField(${item.id}, 'stock', ${item.stock})">${item.stock}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="adjustStock(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td onclick="editField(${item.id}, 'price', ${item.price})">
                    Rp ${item.price.toLocaleString('id-ID')}
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
}

// 4. Fungsi Simpan & Refresh (Otomatis update semua tampilan)
function saveAndRefresh() {
    localStorage.setItem(userKey, JSON.stringify(products));
    
    // Cek apakah lagi ada teks di search bar
    const keyword = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : "";
    
    if (keyword) {
        searchData(); // Jika lagi nyari, tetep di tampilan cari
    } else {
        renderTable(); // Jika nggak, tampilkan semua
    }
    updateStats();
}

// 5. Fungsi Update Statistik
function updateStats() {
    const totalP = products.length;
    const totalS = products.reduce((s, i) => s + (parseInt(i.stock) || 0), 0);
    const totalV = products.reduce((s, i) => s + ((parseInt(i.stock) || 0) * (parseInt(i.price) || 0)), 0);

    const elP = document.getElementById('totalProducts');
    const elS = document.getElementById('totalStock');
    const elV = document.getElementById('totalValue');

    if(elP) elP.innerText = totalP;
    if(elS) elS.innerText = totalS;
    if(elV) elV.innerText = totalV.toLocaleString('id-ID');
}

// 6. Logika Search (Panggil renderTable dengan data yang difilter)
function searchData() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const results = products.filter(item => item.name.toLowerCase().includes(keyword));
    renderTable(results); // Panggil fungsi render utama pake hasil cari
}

// 7. Fungsi Edit & Adjust
function adjustStock(id, amt) {
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
        if (products[idx].stock + amt < 0) return;
        products[idx].stock += amt;
        saveAndRefresh();
    }
}

function editField(id, field, val) {
    const type = (field === 'name') ? 'text' : 'number';
    Swal.fire({ 
        title: `Edit ${field === 'name' ? 'Nama' : field === 'stock' ? 'Stok' : 'Harga'}`, 
        input: type, 
        inputValue: val, 
        showCancelButton: true,
        confirmButtonColor: '#0d6efd'
    })
    .then((res) => {
        if (res.isConfirmed && res.value !== "") {
            const idx = products.findIndex(p => p.id === id);
            products[idx][field] = (type === 'number') ? parseInt(res.value) : res.value;
            saveAndRefresh();
        }
    });
}

// 8. CRUD Dasar
function deleteProduct(id) {
    Swal.fire({
        title: 'Hapus Barang?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        confirmButtonColor: '#dc3545'
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(p => p.id !== id);
            saveAndRefresh();
        }
    });
}

function showAddForm() { document.getElementById('addModal').style.display = 'flex'; }
function closeForm() { document.getElementById('addModal').style.display = 'none'; }

function saveProduct() {
    const name = document.getElementById('pName').value;
    const stock = parseInt(document.getElementById('pStock').value);
    const price = parseInt(document.getElementById('pPrice').value);
    
    if (!name || isNaN(stock) || isNaN(price)) {
        return Swal.fire('Eits!', 'Isi semua data barangnya dulu, Bos!', 'warning');
    }
    
    products.push({ id: Date.now(), name, stock, price });
    saveAndRefresh();
    closeForm();
    
    // Reset Form
    document.getElementById('pName').value = '';
    document.getElementById('pStock').value = '';
    document.getElementById('pPrice').value = '';
}

// Inisialisasi awal
renderTable();
updateStats();
