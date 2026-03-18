// 1. Inisialisasi Kunci Unik Per Akun
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
// Kunci dinamis: jika login 'budi', data disimpan di 'products_budi'
const userKey = currentUser ? `products_${currentUser.username}` : 'myProducts';

// 2. Ambil data barang sesuai akun yang login
let products = JSON.parse(localStorage.getItem(userKey)) || [];

// 3. Fungsi Simpan (HANYA SATU, GAK BOLEH DOBEL)
function saveAndRefresh() {
    localStorage.setItem(userKey, JSON.stringify(products));
    renderTable();
    updateStats();
}

// 4. Fungsi Tampil Tabel
function renderTable() {
    const tableBody = document.getElementById('productTable');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    products.forEach((item) => {
        const isLowStock = item.stock <= 5;
        const rowClass = isLowStock ? 'table-warning-custom' : '';
        const stockAlert = isLowStock ? `<br><span class="badge-low-stock">Limit!</span>` : '';

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td onclick="editField(${item.id}, 'name', '${item.name}')">${item.name}${stockAlert}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary" onclick="adjustStock(${item.id}, -1)">-</button>
                    <span class="mx-2 fw-bold" onclick="editField(${item.id}, 'stock', ${item.stock})">${item.stock}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="adjustStock(${item.id}, 1)">+</button>
                </td>
                <td onclick="editField(${item.id}, 'price', ${item.price})">Rp ${item.price.toLocaleString('id-ID')}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${item.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

// 5. Fungsi Update Statistik (Total Barang, Stok, & Nilai)
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

// 6. Fungsi Edit & Tambah
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
    Swal.fire({ title: `Edit ${field}`, input: type, inputValue: val, showCancelButton: true })
    .then((res) => {
        if (res.isConfirmed && res.value !== "") {
            const idx = products.findIndex(p => p.id === id);
            products[idx][field] = (type === 'number') ? parseInt(res.value) : res.value;
            saveAndRefresh();
        }
    });
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveAndRefresh();
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

function searchData() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    // Pastikan nama variabel data barang lo adalah 'products'
    const results = products.filter(item => 
        item.name.toLowerCase().includes(keyword)
    );

    const tableBody = document.getElementById('productTable');
    tableBody.innerHTML = '';

    results.forEach(item => {
        const rowClass = item.stock <= 5 ? 'table-warning-custom' : '';
        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td>${item.name}</td>
                <td><span class="fw-bold">${item.stock}</span></td>
                <td>Rp ${item.price.toLocaleString('id-ID')}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${item.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

// Jalankan saat halaman dibuka
renderTable();
updateStats();
