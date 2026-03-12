// ------------------------------
// App state (phase 1: in-memory only)
// ------------------------------
// Intentionally empty: data will come from CSV import flow in a later phase.
let products = [];

// ------------------------------
// DOM references
// ------------------------------
const sidebarNav = document.getElementById('sidebarNav');
const sidebarButtons = sidebarNav.querySelectorAll('.nav-item');
const appSections = document.querySelectorAll('.app-section');
const productsPreviewSection = document.getElementById('section-products-previews');

const tableBody = document.getElementById('products-table-body');
const totalProductsEl = document.getElementById('total-products');
const activeProductsEl = document.getElementById('active-products');
const lowStockProductsEl = document.getElementById('low-stock-products');
const draftProductsEl = document.getElementById('draft-products');

// ------------------------------
// Render functions
// ------------------------------
function renderProductsTable() {
  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No products loaded yet. Use CSV import in a future phase.</td></tr>';
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
// Event wiring
// ------------------------------
sidebarNav.addEventListener('click', (event) => {
  const btn = event.target.closest('.nav-item');
  if (!btn) return;
  showSection(btn.dataset.section);
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
