const grid = document.querySelector('#productGrid');
const form = document.querySelector('#filterForm');
const cards = () => Array.from(grid.querySelectorAll('.product-card'));
function showCount() {
  const count = cards().filter(card => !card.hidden).length;
  document.querySelector('#resultCount').textContent = `${count} products`;
  document.querySelector('#emptyState').hidden = count !== 0;
}
function filterProducts() {
  const query = document.querySelector('#searchName').value.trim().toLowerCase();
  const minimumPrice = Number(document.querySelector('#minPrice').value);
  const category = document.querySelector('#category').value;
  const calories = form.querySelector('[name="calories"]:checked').value;
  const [minimumCalories, maximumCalories] = calories === 'all' ? [0, Infinity] : calories.split(':').map(Number);
  for (const card of cards()) {
    const matchesName = card.dataset.name.toLowerCase().startsWith(query);
    const matchesPrice = Number(card.dataset.price) >= minimumPrice;
    const matchesCalories = Number(card.dataset.calories) >= minimumCalories && Number(card.dataset.calories) < maximumCalories;
    const matchesCategory = category === 'all' || card.dataset.category === category;
    card.hidden = !(matchesName && matchesPrice && matchesCalories && matchesCategory);
  }
  showCount();
}
form.addEventListener('submit', event => { event.preventDefault(); filterProducts(); });
form.addEventListener('reset', () => { setTimeout(() => { document.querySelector('#priceLabel').textContent = '0'; filterProducts(); }, 0); });
document.querySelector('#minPrice').addEventListener('input', event => { document.querySelector('#priceLabel').textContent = event.target.value; });
function sortProducts(direction) {
  const sorted = cards().sort((a, b) => direction * (Number(a.dataset.price) - Number(b.dataset.price) || a.dataset.name.localeCompare(b.dataset.name, 'en')));
  for (const card of sorted) grid.append(card);
}
document.querySelector('#sortAscending').addEventListener('click', () => sortProducts(1));
document.querySelector('#sortDescending').addEventListener('click', () => sortProducts(-1));
let noticeTimer;
function showTotal() {
  const total = cards().filter(card => !card.hidden).reduce((sum, card) => sum + Number(card.dataset.price), 0);
  const notice = document.querySelector('#totalNotice');
  notice.textContent = `Visible total: ${total.toFixed(2)} EUR`;
  notice.hidden = false;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { notice.hidden = true; }, 2000);
}
document.querySelector('#calculateTotal').addEventListener('click', showTotal);
document.addEventListener('keydown', event => { if (event.altKey && event.key.toLowerCase() === 'c') { event.preventDefault(); showTotal(); } });
showCount();
