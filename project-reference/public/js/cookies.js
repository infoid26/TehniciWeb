function getCookie(name) {
  const pair = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}
function setCookie(name, value, maxAge) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}
const banner = document.querySelector('#cookieBanner');
if (banner && getCookie('sweet-corner-notice') === 'yes') banner.hidden = true;
document.querySelector('#acceptCookies')?.addEventListener('click', () => {
  setCookie('sweet-corner-notice', 'yes', 86400 * 30);
  if (banner) banner.hidden = true;
});
