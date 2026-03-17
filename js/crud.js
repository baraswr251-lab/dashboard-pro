let products = JSON.parse(localStorage.getItem('myProducts')) || [];

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

function updateStats() {
    const totalP = products.length;
    const totalS = products.reduce((s, i) => s + parseInt(i.stock), 0);
    const totalV = products.reduce((s, i) => s + (parseInt(i.stock) * parseInt(i.price)), 0);

    document.getElementById('totalProducts').innerText = totalP;
    document.getElementById('totalStock').innerText = totalS;
    document.getElementById('totalValue').innerText = totalV.toLocaleString('id-ID');
}

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
        if (res.isConfirmed) {
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

function saveAndRefresh() {
    localStorage.setItem('myProducts', JSON.stringify(products));
    renderTable();
    updateStats();
}

// Tambah Produk Baru
function showAddForm() { document.getElementById('addModal').style.display = 'flex'; }
function closeForm() { document.getElementById('addModal').style.display = 'none'; }
function saveProduct() {
    const name = document.getElementById('pName').value;
    const stock = parseInt(document.getElementById('pStock').value);
    const price = parseInt(document.getElementById('pPrice').value);
    if (!name || isNaN(stock) || isNaN(price)) return alert("Isi semua!");
    
    products.push({ id: Date.now(), name, stock, price });
    saveAndRefresh();
    closeForm();
}

renderTable();
updateStats();
