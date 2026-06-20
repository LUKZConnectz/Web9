const product = {
  id: 'nvg',
  name: 'Night Vision Goggles',
  desc: 'อุปกรณ์มองกลางคืน เหมาะสำหรับภารกิจลับหรือบุกเวลากลางคืน',
  price: 3500,
  stock: 4,
};

const products = Array.from({ length: 10 }, (_, index) => ({
  ...product,
  id: `nvg-${index}`,
  popular: index === 0 || index >= 5,
}));

const money = (amount) => `฿ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);

const state = {
  page: 'shop',
  dark: false,
  cart: [],
  orders: [
    {
      id: '85632007-13c8-40f5-952b-9c77edcc6d51',
      date: '26/5/2568 02:59:06',
      status: 'ยกเลิกแล้ว',
      tx: '35307e92-646e-48b6-922d-d88dde3f6772',
      items: [{ ...product, qty: 1 }, { ...product, qty: 1 }],
    },
    {
      id: '2a21b707-f779-4ba0-acd4-06c5dc4cc8df',
      date: '26/5/2568 04:25:07',
      status: 'รอชำระเงิน',
      tx: '548b1efd-4798-4e35-ad8a-2a06feff9167',
      items: [{ ...product, qty: 1 }, { ...product, qty: 1 }],
    },
  ],
};

const root = document.getElementById('root');

function setPage(page) {
  state.page = page;
  render();
}

function toggleTheme() {
  state.dark = !state.dark;
  render();
}

function addCart(qty = 1, buy = false) {
  state.cart.unshift({ ...product, qty, id: uid() });
  if (buy) state.page = 'cart';
  render();
}

function createOrder() {
  if (!state.cart.length) return;
  state.orders.unshift({
    id: uid(),
    date: new Date().toLocaleString('th-TH'),
    status: 'รอชำระเงิน',
    tx: uid(),
    items: [...state.cart],
  });
  state.cart = [];
  state.page = 'orders';
  render();
}

function header() {
  return `<header class="topbar">
    <button class="logo" data-page="shop" aria-label="กลับหน้าร้าน"><span>EREAL</span><b>BOXSER</b></button>
    <nav>
      <button class="pill avatar"><span>🪙</span>cvoppy</button>
      <button class="pill">ออกจากระบบ</button>
      <button class="icon" data-page="cart" aria-label="ตะกร้า">🛒</button>
      <button class="icon" data-action="theme" aria-label="เปลี่ยนธีม">${state.dark ? '☾' : '☼'}</button>
    </nav>
  </header>`;
}

function shop() {
  const statItems = [
    ['ผู้ใช้งานทั้งหมด', 'ผู้ใช้งานทั้งหมด', '4K'],
    ['ผู้ใช้งานวันนี้', 'ผู้ใช้งานวันนี้', '1.3K'],
    ['ยอดซื้อทั้งหมด', 'ยอดซื้อทั้งหมด', '10K'],
    ['ยอดขายวันนี้', 'ยอดขายวันนี้', '420'],
  ];

  return `<main class="container shop">
    <section class="hero" aria-label="แบนเนอร์โปรโมชั่น">
      <button aria-label="ก่อนหน้า">←</button>
      <div></div>
      <button aria-label="ถัดไป">→</button>
    </section>
    <section class="stats" aria-label="สถิติร้านค้า">
      ${statItems.map(([label, title, value]) => `<article><small>${label}</small><strong>${title}<em>${value}</em></strong></article>`).join('')}
    </section>
    <section class="grid" aria-label="รายการสินค้า">
      ${products.map((item) => `<article class="card" data-modal="${item.id}" tabindex="0">
        <div class="thumb"><span>${item.popular ? 'สินค้ายอดนิยม' : ''}</span></div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <b>${money(item.price)}</b>
      </article>`).join('')}
    </section>
  </main>`;
}

function modal() {
  return `<div class="overlay"><dialog open class="modal">
    <button class="close" data-close aria-label="ปิด">×</button>
    <div class="modal-img"></div>
    <h2>${product.name}</h2>
    <p>${product.desc}</p>
    <div class="buyline"><strong>${money(product.price)}</strong><span>จำนวนคงเหลือ ${product.stock} ชิ้น</span></div>
    <div class="actions"><input id="qty" type="number" min="1" max="${product.stock}" value="1"><button data-add>🛒 หยิบใส่ตะกร้า</button><button data-buy>▣ สั่งซื้อ</button></div>
  </dialog></div>`;
}

function topup() {
  return `<main class="center"><h1>💳 เติมเงินและเพิ่มแต้ม</h1><input placeholder="ลิงค์อั่งเปา"><button>เติมเงิน</button></main>`;
}

function cart() {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return `<main class="container cart"><h1>ตะกร้าสินค้า</h1>${state.cart.map((item) => `<article class="cart-row"><div><h2>${item.name}</h2><p>${item.desc}</p><small>จำนวน ${item.qty}</small></div><strong>${money(item.price * item.qty)}</strong></article>`).join('') || '<p>ยังไม่มีสินค้าในตะกร้า</p>'}<h3>ราคารวมทั้งหมด <b>${money(total)}</b></h3><div class="cart-actions"><button data-order>▣ สั่งซื้อทั้งหมด</button><span></span><button data-page="topup">💸 เติมเงิน</button><button data-page="orders">▣ คำสั่งซื้อ</button></div></main>`;
}

function orders() {
  return `<main class="container orders"><h1>รายการคำสั่งซื้อ</h1>${state.orders.map((order) => `<section class="order"><div class="order-head"><div><h2>รหัสคำสั่งซื้อ: ${order.id}</h2><p>วันที่: ${order.date}</p><p>การชำระเงิน: <b class="${order.status === 'ยกเลิกแล้ว' ? 'red' : 'blue'}">${order.status}</b></p></div><small>รหัสธุรกรรม:<br>${order.tx}</small></div>${order.items.map((item) => `<article class="order-item"><div><h3>${item.name}</h3><p>จำนวน: ${item.qty}</p></div><strong>${money(item.price * item.qty)}<small>(${item.price.toFixed(2)} x ${item.qty})</small></strong></article>`).join('')}<div class="order-actions"><button data-cancel="${order.id}">ยกเลิกคำสั่งซื้อ</button><button>ชำระเงิน</button></div></section>`).join('')}</main>`;
}

function render() {
  root.innerHTML = `<div class="app ${state.dark ? 'dark' : ''}">${header()}${state.page === 'shop' ? shop() : state.page === 'topup' ? topup() : state.page === 'cart' ? cart() : orders()}<footer><button data-page="topup">เติมเงิน</button><button data-page="orders">คำสั่งซื้อ</button></footer></div>`;
  bind();
}

function bind() {
  document.querySelectorAll('[data-page]').forEach((button) => { button.onclick = () => setPage(button.dataset.page); });
  document.querySelector('[data-action="theme"]')?.addEventListener('click', toggleTheme);
  document.querySelectorAll('[data-modal]').forEach((card) => {
    card.onclick = () => {
      document.body.insertAdjacentHTML('beforeend', modal());
      bindModal();
    };
    card.onkeydown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') card.click();
    };
  });
  document.querySelector('[data-order]')?.addEventListener('click', createOrder);
  document.querySelectorAll('[data-cancel]').forEach((button) => {
    button.onclick = () => {
      state.orders = state.orders.map((order) => (order.id === button.dataset.cancel ? { ...order, status: 'ยกเลิกแล้ว' } : order));
      render();
    };
  });
}

function bindModal() {
  const overlay = document.querySelector('.overlay');
  const qty = document.getElementById('qty');
  const close = () => overlay.remove();
  overlay.onclick = (event) => { if (event.target === overlay) close(); };
  document.querySelector('[data-close]').onclick = close;
  document.querySelector('[data-add]').onclick = () => { addCart(Math.max(1, +qty.value || 1)); close(); };
  document.querySelector('[data-buy]').onclick = () => { addCart(Math.max(1, +qty.value || 1), true); close(); };
}

render();
