function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem('sweet-corner-cart') || '[]');
    return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string'))] : [];
  } catch { return []; }
}
function updateCartCount() { document.querySelector('#cartCount').textContent = String(readCart().length); }
for (const choice of document.querySelectorAll('.cart-choice')) {
  choice.checked = readCart().includes(choice.value);
  choice.addEventListener('change', () => {
    const current = readCart();
    const next = choice.checked ? [...new Set([...current, choice.value])] : current.filter(id => id !== choice.value);
    try { localStorage.setItem('sweet-corner-cart', JSON.stringify(next)); } catch {}
    updateCartCount();
  });
}
updateCartCount();
