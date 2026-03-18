// 1. Inisialisasi Kunci User
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const userKey = currentUser ? `products_${currentUser.username}` : 'myProducts';

// 2. Ambil data
let products = JSON.parse(localStorage.getItem(userKey)) || [];

// 3. FUNGSI RENDER (Jantungnya Aplikasi - Udah Include Tombol +/- & Search)
function renderTable(dataToDisplay = products) {
    const tableBody = document.getElementById('productTable');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    dataToDisplay.forEach((item) => {
        const isLowStock = item.stock <= 5;
        const rowClass = isLowStock ? 'table-warning-custom' : '';
        const stockAlert = isLowStock ? `<br><span class="badge-low-stock">Limit!</span>` : '';

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td onclick="editField(${item.id}, 'name', '${item.name}')">
                    ${item.name}${stockAlert}
                </td>
                <td>
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="adjustStock(${item.id}, -1)">-</button>
                        <span class="fw-bold" style="min-width: 25px;" onclick="editField(${item.id}, 'stock', ${item.stock})">${item.stock}</span>
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

// 4. LOGIC SEARCH (Sekarang manggil renderTable biar tombol gak ilang)
function searchData() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const results = products.filter(item => item.name.toLowerCase().includes(keyword));
    renderTable(results); // Manggil render utama biar tombol tetep ada
}

// 5. UPDATE & SIMPAN
function saveAndRefresh() {
    localStorage.setItem(userKey, JSON.stringify(products));
    
    // Cek lagi search atau nggak
    const keyword = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : "";
    if (keyword) {
        searchData();
    } else {
        renderTable();
    }
    updateStats();
}

function updateStats() {
    const totalP = products.length;
    const totalS = products.reduce((s, i) => s + (parseInt(i.stock) || 0), 0);
    const totalV = products.reduce((s, i) => s + ((parseInt(i.stock) || 0) * (parseInt(i.price) || 0)), 0);

    if(document.getElementById('totalProducts')) document.getElementById('totalProducts').innerText = totalP;
    if(document.getElementById('totalStock')) document.getElementById('totalStock').innerText = totalS;
    if(document.getElementById('totalValue')) document.getElementById('totalValue').innerText = totalV.toLocaleString('id-ID');
}

// 6. ACTION (STOK & EDIT)
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
        title: `Edit ${field}`, 
        input: type, 
        inputValue: val, 
        showCancelButton: true 
    }).then((res) => {
        if (res.isConfirmed && res.value !== "") {
            const idx = products.findIndex(p => p.id === id);
            products[idx][field] = (type === 'number') ? parseInt(res.value) : res.value;
            saveAndRefresh();
        }
    });
}

function deleteProduct(id) {
    Swal.fire({
        title: 'Hapus?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        confirmButtonColor: '#dc3545'
    }).then((r) => {
        if (r.isConfirmed) {
            products = products.filter(p => p.id !== id);
            saveAndRefresh();
        }
    });
}

// 7. FORM MODAL
function showAddForm() { document.getElementById('addModal').style.display = 'flex'; }
function closeForm() { document.getElementById('addModal').style.display = 'none'; }

function saveProduct() {
    const name = document.getElementById('pName').value;
    const stock = parseInt(document.getElementById('pStock').value);
    const price = parseInt(document.getElementById('pPrice').value);
    if (!name || isNaN(stock) || isNaN(price)) return Swal.fire('Eits!', 'Isi semua!', 'warning');
    
    products.push({ id: Date.now(), name, stock, price });
    saveAndRefresh();
    closeForm();
    document.getElementById('pName').value = '';
    document.getElementById('pStock').value = '';
    document.getElementById('pPrice').value = '';
}

// JALANKAN AWAL
renderTable();
updateStats();
