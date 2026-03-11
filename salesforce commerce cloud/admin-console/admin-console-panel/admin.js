// ------------------------------
// App state (in-memory phase 1)
// ------------------------------
let products = [
  { id: 1, title: 'Wireless Earbuds Pro', sku: 'WM-EB-1004', category: 'Electronics', price: 89.0, stock: 24, status: 'Active', updated: '2026-03-11' },
  { id: 2, title: 'Organic Honey Crisp Apples', sku: 'WM-GR-2031', category: 'Groceries', price: 6.49, stock: 8, status: 'Low Stock', updated: '2026-03-10' },
  { id: 3, title: 'Performance Cotton Tee', sku: 'WM-AP-5502', category: 'Apparel', price: 14.99, stock: 120, status: 'Active', updated: '2026-03-09' },
  { id: 4, title: 'Portable Blender', sku: 'WM-HM-8870', category: 'Home', price: 29.5, stock: 0, status: 'Draft', updated: '2026-03-08' },
  { id: 5, title: '4K Streaming Device', sku: 'WM-EL-6423', category: 'Electronics', price: 39.99, stock: 11, status: 'Active', updated: '2026-03-07' },
  { id: 6, title: 'Memory Foam Pillow', sku: 'WM-HM-9201', category: 'Home', price: 24.0, stock: 5, status: 'Low Stock', updated: '2026-03-06' }
];

let editingProductId = null;
let panelMode = 'create';

// ------------------------------
// DOM references
// ------------------------------
const sidebarNav = document.getElementById('sidebarNav');
const sidebarButtons = sidebarNav.querySelectorAll('.nav-item');
const appSections = document.querySelectorAll('.app-section');
const productsSection = document.getElementById('section-products');
const productsPreviewSection = document.getElementById('section-products-previews');

const tableBody = document.getElementById('products-table-body');
const totalProductsEl = document.getElementById('total-products');
const activeProductsEl = document.getElementById('active-products');
const lowStockProductsEl = document.getElementById('low-stock-products');
const draftProductsEl = document.getElementById('draft-products');

const newProductBtn = document.getElementById('new-product-btn');
const productPanel = document.getElementById('product-panel');
const panelTitle = document.getElementById('panelTitle');
const productPanelCloseBtn = document.getElementById('product-panel-close');
const productPanelCancelBtn = document.getElementById('product-panel-cancel');
const productForm = document.getElementById('product-form');

// ------------------------------
// Render functions
// ------------------------------
function renderProductsTable() {
  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No products available yet.</td></tr>';
    return;
  }

  tableBody.innerHTML = products
    .map((product) => {
      const badgeClass = getBadgeClass(product);
      const secondaryText = `ID ${product.id}`;

      return `
        <tr>
          <td>
            <div class="product-cell">
              <div class="thumb" aria-hidden="true"></div>
              <div>
                <strong>${escapeHtml(product.title)}</strong>
                <small>${escapeHtml(secondaryText)}</small>
              </div>
            </div>
          </td>
          <td>${escapeHtml(product.sku)}</td>
          <td>${escapeHtml(product.category)}</td>
          <td>$${Number(product.price).toFixed(2)}</td>
          <td>${product.stock}</td>
          <td><span class="badge ${badgeClass}">${escapeHtml(product.status)}</span></td>
          <td>${escapeHtml(product.updated)}</td>
          <td class="actions">
            <button type="button" data-action="view" data-id="${product.id}">View</button>
            <button type="button" data-action="edit" data-id="${product.id}">Edit</button>
            <button type="button" class="danger" data-action="delete" data-id="${product.id}">Delete</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderSummaryCards() {
  const total = products.length;
  const active = products.filter((item) => item.status === 'Active').length;
  const lowStock = products.filter((item) => item.status === 'Low Stock' || item.stock < 10).length;
  const draft = products.filter((item) => item.status === 'Draft').length;

  totalProductsEl.textContent = String(total);
  activeProductsEl.textContent = String(active);
  lowStockProductsEl.textContent = String(lowStock);
  draftProductsEl.textContent = String(draft);
}

function showSection(sectionName) {
  appSections.forEach((section) => section.classList.remove('is-visible'));

  const target = document.getElementById(`section-${sectionName}`);
  if (target) target.classList.add('is-visible');

  if (sectionName === 'products') {
    productsPreviewSection.classList.add('is-visible');
  }

  sidebarButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.section === sectionName);
  });
}

// ------------------------------
// UI control helpers
// ------------------------------
function openProductPanel(mode, productId = null) {
  panelMode = mode;
  editingProductId = mode === 'edit' ? productId : null;

  if (mode === 'edit' && productId !== null) {
    panelTitle.textContent = 'Edit Product';
    const selected = products.find((item) => item.id === productId);
    if (selected) populateProductForm(selected);
  } else {
    panelTitle.textContent = 'New Product';
    resetProductForm();
  }

  productPanel.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeProductPanel() {
  productPanel.hidden = true;
  resetProductForm();
  editingProductId = null;
  panelMode = 'create';
  panelTitle.textContent = 'New Product';
  document.body.style.overflow = '';
}

function resetProductForm() {
  productForm.reset();
}

function populateProductForm(product) {
  productForm.elements.title.value = product.title;
  productForm.elements.sku.value = product.sku;
  productForm.elements.category.value = product.category;
  productForm.elements.price.value = product.price;
  productForm.elements.comparePrice.value = product.comparePrice || '';
  productForm.elements.stock.value = product.stock;
  productForm.elements.status.value = product.status;
  productForm.elements.description.value = product.description || '';
}

// ------------------------------
// Product state operations
// ------------------------------
function createProductFromForm() {
  const nextId = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;

  return {
    id: nextId,
    title: productForm.elements.title.value.trim(),
    sku: productForm.elements.sku.value.trim(),
    category: productForm.elements.category.value,
    price: Number(productForm.elements.price.value),
    comparePrice: productForm.elements.comparePrice.value ? Number(productForm.elements.comparePrice.value) : null,
    stock: Number(productForm.elements.stock.value),
    status: productForm.elements.status.value,
    description: productForm.elements.description.value.trim(),
    updated: new Date().toISOString().slice(0, 10)
  };
}

function updateProductFromForm(existing) {
  return {
    ...existing,
    title: productForm.elements.title.value.trim(),
    sku: productForm.elements.sku.value.trim(),
    category: productForm.elements.category.value,
    price: Number(productForm.elements.price.value),
    comparePrice: productForm.elements.comparePrice.value ? Number(productForm.elements.comparePrice.value) : null,
    stock: Number(productForm.elements.stock.value),
    status: productForm.elements.status.value,
    description: productForm.elements.description.value.trim(),
    updated: new Date().toISOString().slice(0, 10)
  };
}

// ------------------------------
// Event wiring
// ------------------------------
sidebarNav.addEventListener('click', (event) => {
  const btn = event.target.closest('.nav-item');
  if (!btn) return;
  showSection(btn.dataset.section);
});

newProductBtn.addEventListener('click', () => openProductPanel('create'));
productPanelCloseBtn.addEventListener('click', closeProductPanel);
productPanelCancelBtn.addEventListener('click', closeProductPanel);

productPanel.addEventListener('click', (event) => {
  if (event.target === productPanel) closeProductPanel();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !productPanel.hidden) closeProductPanel();
});

productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (panelMode === 'edit' && editingProductId !== null) {
    products = products.map((item) =>
      item.id === editingProductId ? updateProductFromForm(item) : item
    );
  } else {
    const newProduct = createProductFromForm();
    products = [newProduct, ...products];
  }

  renderProductsTable();
  renderSummaryCards();
  closeProductPanel();
});

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  const selected = products.find((item) => item.id === id);
  if (!selected) return;

  if (action === 'view') {
    alert(`Product: ${selected.title}\nSKU: ${selected.sku}\nCategory: ${selected.category}\nPrice: $${selected.price.toFixed(2)}\nStock: ${selected.stock}\nStatus: ${selected.status}`);
    return;
  }

  if (action === 'edit') {
    openProductPanel('edit', id);
    return;
  }

  if (action === 'delete') {
    products = products.filter((item) => item.id !== id);
    renderProductsTable();
    renderSummaryCards();
  }
});

// ------------------------------
// Utility helpers
// ------------------------------
function getBadgeClass(product) {
  if (product.status === 'Active') return 'badge--active';
  if (product.status === 'Draft') return 'badge--draft';
  return 'badge--low';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Initial page render
renderProductsTable();
renderSummaryCards();
showSection('products');
