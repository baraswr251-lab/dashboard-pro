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
        const isLowStock = item.stock <= 5;
        const rowClass = isLowStock ? 'table-warning-custom' : '';
        const stockAlert = isLowStock ? `<br><span class="badge-low-stock">Stok Menipis!</span>` : '';

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td class="fw-bold text-start ps-3" style="cursor: pointer;" onclick="editField(${item.id}, 'name', '${item.name}')">
                    ${item.name} ${stockAlert}
                </td>
                
                <td class="align-middle">
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary p-1" style="width: 25px; height: 25px; line-height: 1;" onclick="adjustStock(${item.id}, -1)">-</button>
                        
                        <span class="fw-bold" style="cursor: pointer; min-width: 30px;" onclick="editField(${item.id}, 'stock', ${item.stock})">
                            ${item.stock}
                        </span>
                        
                        <button class="btn btn-sm btn-outline-primary p-1" style="width: 25px; height: 25px; line-height: 1;" onclick="adjustStock(${item.id}, 1)">+</button>
                    </div>
                </td>
                
                <td class="align-middle" style="cursor: pointer;" onclick="editField(${item.id}, 'price', ${item.price})">
                    Rp ${item.price.toLocaleString('id-ID')}
                </td>
                
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
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('productTable');
    
    const filteredProducts = products.filter(item => {
        return item.name.toLowerCase().includes(keyword);
    });

    tableBody.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-muted py-4">Barang "${keyword}" tidak ditemukan...</td></tr>`;
        return;
    }

    filteredProducts.forEach((item) => {
        const isLowStock = item.stock <= 5;
        const rowClass = isLowStock ? 'table-warning-custom' : '';
        const stockAlert = isLowStock ? `<br><span class="badge-low-stock">Stok Menipis!</span>` : '';

        // --- LOGIKA HIGHLIGHT (MAGICNYA DI SINI) ---
        let displayName = item.name;
        if (keyword !== '') {
            const regExp = new RegExp(`(${keyword})`, 'gi');
            displayName = item.name.replace(regExp, `<mark style="padding:0; background: yellow;">$1</mark>`);
        }
        // -------------------------------------------

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td class="fw-bold text-start ps-3" style="cursor: pointer;" onclick="editField(${item.id}, 'name', '${item.name}')">
                    ${displayName} ${stockAlert}
                </td>
                <td class="align-middle" style="cursor: pointer;" onclick="editField(${item.id}, 'stock', ${item.stock})">
                    <span class="badge bg-light text-dark border">${item.stock}</span>
                </td>
                <td class="align-middle" style="cursor: pointer;" onclick="editField(${item.id}, 'price', ${item.price})">
                    Rp ${item.price.toLocaleString('id-ID')}
                </td>
                <td class="align-middle">
                    <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteProduct(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
}

function editField(id, field, currentVal) {
    // Tentukan tipe input: kalau stok/harga pake number, kalau nama pake text
    const inputType = (field === 'stock' || field === 'price') ? 'number' : 'text';
    const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);

    Swal.fire({
        title: `Ubah ${fieldLabel}`,
        input: inputType,
        inputValue: currentVal,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#3085d6',
        inputValidator: (value) => {
            if (!value) {
                return 'Data nggak boleh kosong, Bos!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Cari index barangnya
            const index = products.findIndex(p => p.id === id);
            
            if (index !== -1) {
                // Update datanya (kalau angka di-parse dulu)
                products[index][field] = (inputType === 'number') ? parseInt(result.value) : result.value;
                
                // Simpan ke LocalStorage
                localStorage.setItem('myProducts', JSON.stringify(products));
                
                // Refresh tampilan & statistik
                renderTable();
                updateStats();

                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil diupdate!',
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        }
    });
}
function adjustStock(id, amount) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        // Update stok tapi jangan sampe minus
        const newStock = products[index].stock + amount;
        
        if (newStock < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Eits!',
                text: 'Stok nggak bisa kurang dari 0, Bos!',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        products[index].stock = newStock;
        
        // Simpan dan Refresh
        localStorage.setItem('myProducts', JSON.stringify(products));
        renderTable();
        updateStats();
    }
}
