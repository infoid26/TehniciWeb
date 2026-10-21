function readTheme() {
  try { return localStorage.getItem('sweet-corner-theme'); } catch { return null; }
}
document.body.classList.toggle('light', readTheme() === 'light');
document.querySelector('#themeButton')?.addEventListener('click', () => {
  const light = document.body.classList.toggle('light');
  try { localStorage.setItem('sweet-corner-theme', light ? 'light' : 'dark'); } catch {}
});
