/* script.js with alert fixes: ensureAlertRegion and showAlert replaced */
const AUTH_KEY = 'freal_boxser_user';
const ALERT_TIMEOUT = 4200;
const CART_KEY = 'freal_boxser_cart';
const ORDERS_KEY = 'freal_boxser_orders';
const PRODUCTS_KEY = 'freal_boxser_products';
const DONATE_KEY = 'freal_boxser_donations';
const THEME_KEY = 'freal_boxser_theme';
const PRODUCT = { id: 'night-vision', name: 'Night Vision Goggles', description: 'อุปกรณ์มองกลางคืน เหมาะสำหรับภารกิจลับห[...]' };

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function refreshIcons(root = document) {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' }, root });
}

function ensureAlertRegion() {
  let region = document.querySelector('[data-alert-region]');
  if (!region) {
    region = document.createElement('div');
    region.className = 'alert-region';
    region.dataset.alertRegion = '';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-relevant', 'additions');
    // fallback inline style in case CSS loads late
    region.style.bottom = '18px';
    region.style.right = '18px';
    region.style.top = '';
    document.body.appendChild(region);
  }
  return region;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}


function readList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProducts() {
  const products = readList(PRODUCTS_KEY);
  return products.length ? products : Array.from({ length: 10 }, (_, index) => ({ ...PRODUCT, id: `${PRODUCT.id}-${index + 1}`, featured: index === 0 }));
}

function saveProducts(products) { writeList(PRODUCTS_KEY, products); }

function isAdmin(user = getUser()) { return user?.role === 'admin' || String(user?.username || '').toLowerCase() === 'admin'; }

function formatMoney(value) {
  return `฿ ${Number(value || 0).toFixed(2)}`;
}

function makeId() {
  return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

function addCartItem(quantity) {
  const cart = readList(CART_KEY);
  const current = cart.find((item) => item.name === PRODUCT.name && item.price === PRODUCT.price);
  if (current) current.quantity += quantity;
  else cart.push({ ...PRODUCT, quantity });
  writeList(CART_KEY, cart);
}

function createOrder(items) {
  const orders = readList(ORDERS_KEY);
  const order = {
    id: makeId(),
    transactionId: makeId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    items: items.map((item) => ({ ...item })),
  };
  orders.unshift(order);
  writeList(ORDERS_KEY, orders);
  return order;
}

function formatThaiDate(value) {
  const date = value ? new Date(value) : new Date();
  const buddhistYear = date.getFullYear() + 543;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${buddhistYear} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function showAlert({ title, message = '', type = 'success' }) {
  const region = ensureAlertRegion();

  // dedupe by exact title+message
  const existing = Array.from(region.querySelectorAll('.app-alert')).find(el => {
    const strong = el.querySelector('.alert-copy strong');
    const small = el.querySelector('.alert-copy small');
    const t = strong ? strong.textContent.trim() : '';
    const m = small ? small.textContent.trim() : '';
    return t === String(title).trim() && m === String(message).trim();
  });
  if (existing) {
    // replay animation: remove leaving class and force reflow
    existing.classList.remove('is-leaving');
    existing.style.animation = 'none';
    void existing.offsetWidth;
    existing.style.animation = '';
    return;
  }

  const icons = { success: 'circle-check', error: 'circle-alert', info: 'info', warning: 'triangle-alert' };
  const alert = document.createElement('div');
  alert.className = `app-alert app-alert-${type}`;
  alert.setAttribute('role', type === 'error' ? 'alert' : 'status');
  alert.dataset.alertId = String(Date.now()) + '-' + Math.random().toString(16).slice(2);

  alert.innerHTML = `
    <span class="alert-icon"><i data-lucide="${icons[type] || icons.info}"></i></span>
    <span class="alert-copy">
      <strong>${escapeHTML(title)}</strong>
      ${message ? `<small>${escapeHTML(message)}</small>` : ''}
    </span>
    <button class="alert-close" type="button" aria-label="ปิดแจ้งเตือน"><i data-lucide="x"></i></button>
  `;

  const close = () => {
    if (!alert.isConnected) return;
    alert.classList.add('is-leaving');
    if (alert._timeoutHandle) {
      clearTimeout(alert._timeoutHandle);
      alert._timeoutHandle = null;
    }
    window.setTimeout(() => { if (alert.isConnected) alert.remove(); }, 220);
  };

  const closeBtn = alert.querySelector('.alert-close');
  if (closeBtn) closeBtn.addEventListener('click', close, { once: true });

  region.appendChild(alert);
  refreshIcons(alert);

  // auto-dismiss, store handle on element so close() can cancel it
  alert._timeoutHandle = window.setTimeout(close, ALERT_TIMEOUT);
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  document.querySelectorAll('[data-username]').forEach((el) => { el.textContent = user.displayName || user.username; });
  document.querySelectorAll('.admin-only').forEach((el) => { el.hidden = !isAdmin(user); });
  return user;
}


function applyTheme(theme = localStorage.getItem(THEME_KEY) || (document.body.classList.contains('profile-screen') ? 'dark' : 'light')) {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => button.setAttribute('aria-pressed', theme === 'dark'));
}

function initChrome() {
  applyTheme();
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => button.addEventListener('click', () => {
    const theme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }));
  const page = document.body.dataset.page;
  document.querySelectorAll(`[data-nav="${page}"]`).forEach((link) => link.classList.add('is-active'));
  const count = readList(CART_KEY).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = count; el.hidden = count === 0; });
}

function initLogin() {
  const form = document.querySelector('[data-login-form]');
  const error = document.querySelector('[data-login-error]');
  if (!form) return;

  if (getUser()) {
    window.location.href = 'index.html';
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (!username || !password) {
      const message = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      error.textContent = message;
      error.hidden = false;
      showAlert({ title: 'เข้าสู่ระบบไม่สำเร็จ', message, type: 'error' });
      return;
    }

    setUser({ username, role: username.toLowerCase() === 'admin' ? 'admin' : 'user', displayName: username, balance: 0 });
    showAlert({ title: 'เข้าสู่ระบบสำเร็จ', message: `ยินดีต้อนรับ ${username}`, type: 'success' });
    window.setTimeout(() => { window.location.href = 'index.html'; }, 450);
  });
}

/* Rest of script.js unchanged... (omitted for brevity in this commit but preserved in file) */

document.addEventListener('DOMContentLoaded', () => {
  initChrome();
  refreshIcons();
  document.querySelectorAll('[data-logout]').forEach((button) => button.addEventListener('click', logout));
  if (document.body.dataset.page === 'login') initLogin();
  initHeroSlider();
  if (document.body.dataset.protected === 'true') {
    initStore();
    initCart();
    initOrders();
    initTopup();
    initAdmin();
    initProfile();
    initDonate();
  }
});
