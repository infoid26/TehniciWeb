(() => {
  'use strict';
  function readSaved(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch { return fallback; }
  }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  let cart = readSaved('sweet-corner-cart', []);
  if (!Array.isArray(cart)) cart = [];
  cart = [...new Set(cart.map(String))];
  function updateCart() { document.querySelector('#cart-count').textContent = cart.length; save('sweet-corner-cart', cart); }
  document.querySelectorAll('.cart-choice').forEach(box => {
    box.checked = cart.includes(box.dataset.id);
    box.addEventListener('change', () => {
      cart = box.checked ? [...new Set([...cart, box.dataset.id])] : cart.filter(id => id !== box.dataset.id);
      updateCart();
    });
  });
  updateCart();
  document.body.classList.toggle('light', readSaved('sweet-corner-theme', 'dark') === 'light');
  document.querySelector('#theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light'); save('sweet-corner-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
  const menuButton = document.querySelector('#menu-toggle');
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded)); document.querySelector('#main-menu').classList.toggle('open', !expanded);
  });
  const banner = document.querySelector('#cookie-banner');
  banner.hidden = document.cookie.split(';').some(part => part.trim() === 'sweet_consent=yes');
  document.querySelector('#accept-cookies').addEventListener('click', () => {
    document.cookie = 'sweet_consent=yes; Max-Age=2592000; Path=/; SameSite=Lax'; banner.hidden = true;
  });
  document.querySelector('#dismiss-cookies').addEventListener('click', () => { banner.hidden = true; });
  const form = document.querySelector('#filters');
  if (!form) return;
  const list = document.querySelector('#product-list');
  const cards = Array.from(list.querySelectorAll('.product-card'));
  function filterProducts() {
    const search = document.querySelector('#search-name').value.trim().toLowerCase();
    const maxPrice = Number(document.querySelector('#max-price').value);
    const minPrice = Number(document.querySelector('#min-price').value);
    const calories = document.querySelector('input[name="calories"]:checked').value;
    const [minCalories,maxCalories] = calories === 'all' ? [0,Infinity] : calories.split(':').map(Number);
    const category = document.querySelector('#category').value;
    const ingredient = document.querySelector('#ingredients').value.trim().toLowerCase();
    const diet = document.querySelector('input[name="diet"]:checked').value;
    let total = 0, count = 0;
    for (const card of cards) {
      const visible = card.dataset.name.startsWith(search) && Number(card.dataset.price) >= minPrice && Number(card.dataset.price) <= maxPrice && Number(card.dataset.calories) >= minCalories && Number(card.dataset.calories) < maxCalories && (category === 'all' || card.dataset.category === category) && card.dataset.ingredients.includes(ingredient) && (diet === 'all' || card.dataset.diabetic === 'true');
      card.hidden = !visible;
      if (visible) { total += Number(card.dataset.price); count++; }
    }
    document.querySelector('#summary').textContent = `${count} products · visible total: ${total.toFixed(2)} EUR`;
    document.querySelector('#empty-state').hidden = count !== 0;
    document.querySelector('#price-value').textContent = String(maxPrice);
    document.querySelector('#min-price-value').textContent = String(minPrice);
    const order = document.querySelector('#sort').value;
    const sorted = order === 'default' ? cards : [...cards].sort((a,b) => (order === 'asc' ? 1 : -1) * ((Number(a.dataset.price) - Number(b.dataset.price)) || a.dataset.name.localeCompare(b.dataset.name,'en')));
    for (const card of sorted) list.appendChild(card);
  }
  form.addEventListener('submit', event => { event.preventDefault(); filterProducts(); });
  form.addEventListener('input', filterProducts);
  form.addEventListener('change', filterProducts);
  form.addEventListener('reset', () => setTimeout(filterProducts, 0));
  let totalTimer;
  function showTotal() {
    const total=cards.filter(card=>!card.hidden).reduce((sum,card)=>sum+Number(card.dataset.price),0);
    const notice=document.querySelector('#total-notice');
    notice.textContent=`Visible total: ${total.toFixed(2)} EUR`;
    notice.hidden=false;
    clearTimeout(totalTimer);
    totalTimer=setTimeout(()=>{notice.hidden=true;},2000);
  }
  document.querySelector('#calculate-total').addEventListener('click',showTotal);
  document.addEventListener('keydown', event => { if (event.altKey && event.key.toLowerCase() === 'c') { event.preventDefault(); showTotal(); } });
  filterProducts();
})();
