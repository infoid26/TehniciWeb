"""Reproducible source files for the English reference project."""
from pathlib import Path
import json
root=Path('project-reference')
def write(name,text):
 p=root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text,encoding='utf8')
write('package.json',json.dumps({'name':'sweet-corner-reference','version':'1.0.0','private':True,'scripts':{'start':'node app.js'},'dependencies':{'express':'^5.1.0','ejs':'^3.1.10','pg':'^8.16.3','sass':'^1.93.2','sharp':'^0.34.4','@electric-sql/pglite':'^0.3.0'}},indent=2))
write('lib/assets.js','''const fs = require('fs/promises');
const path = require('path');
const sass = require('sass');
const sharp = require('sharp');
async function prepareAssets() {
  const publicFolder = path.join(__dirname, '../public');
  await fs.mkdir(path.join(publicFolder, 'css'), { recursive: true });
  const result = sass.compile(path.join(publicFolder, 'scss/site.scss'));
  await fs.writeFile(path.join(publicFolder, 'css/site.css'), result.css);
  for (const name of ['cake', 'tea', 'icecream']) {
    const source = path.join(publicFolder, 'images', name + '.svg');
    for (const width of [300, 600]) {
      await sharp(source).resize(width).webp().toFile(path.join(publicFolder, 'images', `${name}-${width}.webp`));
    }
  }
}
module.exports = { prepareAssets };
''')
write('data/products.sql', '''CREATE TYPE product_type AS ENUM ('cake', 'pastry', 'icecream');
CREATE TYPE product_category AS ENUM ('regular', 'special', 'diet');
CREATE TABLE IF NOT EXISTS products (
 id serial PRIMARY KEY, name varchar(50) UNIQUE NOT NULL, description text,
 price numeric(8,2) NOT NULL CHECK(price >= 0), weight integer NOT NULL CHECK(weight >= 0),
 type product_type DEFAULT 'cake', calories integer NOT NULL CHECK(calories >= 0),
 category product_category DEFAULT 'regular', ingredients varchar[],
 diabetic_friendly boolean NOT NULL DEFAULT false, image varchar(300),
 created_at timestamp DEFAULT current_timestamp
);
INSERT INTO products(name,description,price,weight,type,calories,category,ingredients,diabetic_friendly,image) VALUES
('Chocolate cake','Dark chocolate and a soft sponge.',12,200,'cake',400,'regular',ARRAY['flour','milk','chocolate'],false,'cake'),
('Fruit pastry','Fresh fruit on crisp pastry.',6,150,'pastry',280,'special',ARRAY['flour','fruit'],false,'tea'),
('Vanilla ice cream','A cool vanilla dessert.',8,120,'icecream',220,'regular',ARRAY['milk','vanilla'],false,'icecream'),
('Sugar-free cake','A cake made with sweetener.',10,180,'cake',250,'diet',ARRAY['flour','milk','sweetener'],true,'cake');
''')
write('data/users.sql', '''CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'member');
CREATE TABLE IF NOT EXISTS users (
 id serial PRIMARY KEY, username varchar(50) UNIQUE NOT NULL,
 last_name varchar(100) NOT NULL, first_name varchar(100) NOT NULL,
 password_hash varchar(500) NOT NULL, role user_role NOT NULL DEFAULT 'member',
 email varchar(100) NOT NULL, chat_color varchar(50) NOT NULL,
 created_at timestamp DEFAULT current_timestamp, confirmation_code varchar(200),
 email_confirmed boolean DEFAULT false, photo varchar(200)
);
CREATE TABLE IF NOT EXISTS visits (
 id serial PRIMARY KEY, ip varchar(100) NOT NULL,
 user_id integer NULL REFERENCES users(id), page varchar(500) NOT NULL,
 visited_at timestamp DEFAULT current_timestamp
);
''')
write('lib/products.js','''const fs = require('fs/promises');
const path = require('path');
async function createProductStore(databaseUrl) {
  let database, mode;
  if (databaseUrl) {
    const { Pool } = require('pg');
    database = new Pool({ connectionString: databaseUrl });
    mode = 'PostgreSQL';
    // Initialize a separate training database with data/products.sql before connecting.
  } else {
    const { PGlite } = await import('@electric-sql/pglite');
    database = new PGlite();
    await database.exec(await fs.readFile(path.join(__dirname, '../data/products.sql'), 'utf8'));
    mode = 'PostgreSQL in memory (training)';
  }
  return {
    mode,
    async list(type) { return (await database.query(type === 'all' ? 'SELECT * FROM products ORDER BY id' : 'SELECT * FROM products WHERE type = $1 ORDER BY id', type === 'all' ? [] : [type])).rows; },
    async find(id) { return (await database.query('SELECT * FROM products WHERE id = $1', [id])).rows[0]; },
    async categories() { return (await database.query('SELECT unnest(enum_range(NULL::product_category)) AS name')).rows.map(row => row.name); },
    async close() { if (databaseUrl) await database.end(); else await database.close(); }
  };
}
module.exports = { createProductStore };
''')
write('data/gallery.json',json.dumps({'images':[{'file':'cake','caption':'Chocolate cake'},{'file':'tea','caption':'Fresh fruit pastry'},{'file':'icecream','caption':'Vanilla ice cream'}]},indent=2))
write('data/errors.json',json.dumps({'400':{'title':'Invalid request','message':'Please check the address.'},'404':{'title':'Page not found','message':'This page does not exist.'},'500':{'title':'Server error','message':'The page could not be loaded.'}},indent=2))
write('views/fragments/header.ejs','''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Sweet Corner training bakery project"><title><%= title %> · Sweet Corner</title><link rel="icon" href="<%= basePath %>/assets/images/cake.svg"><link rel="stylesheet" href="<%= basePath %>/vendor/css/bootstrap.min.css"><link rel="stylesheet" href="<%= basePath %>/assets/css/site.css"><script src="<%= basePath %>/assets/js/site.js" defer></script></head>
<body><header class="site-header"><a class="brand" href="<%= basePath %>/">Sweet Corner<span>BAKERY & LITTLE JOYS</span></a><button id="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu">Menu</button><nav id="main-menu" aria-label="Main navigation"><ul><li><a href="<%= basePath %>/">Home</a></li><li><a href="<%= basePath %>/products">Products</a><ul><li><a href="<%= basePath %>/products?type=cake">Cakes</a></li><li><a href="<%= basePath %>/products?type=pastry">Pastries</a></li><li><a href="<%= basePath %>/products?type=icecream">Ice cream</a></li></ul></li><li><a href="<%= basePath %>/about">About</a></li></ul></nav><div class="header-actions"><span>Cart: <strong id="cart-count">0</strong></span><button id="theme-toggle" type="button">Change theme</button></div></header>
''')
write('views/fragments/footer.ejs','''<footer><p>Sweet Corner · Tehnici Web training project</p><small>Data: <%= dataMode %></small><a href="#top">Back to top ↑</a></footer><aside id="cookie-banner" aria-label="Cookie preferences"><p>This demo remembers your theme, cart and preference in this browser.</p><button id="accept-cookies" type="button">Remember preference</button><button id="dismiss-cookies" type="button">Dismiss</button></aside></body></html>''')
write('views/pages/home.ejs','''<%- include('../fragments/header') %><main id="top"><section class="hero"><div><p class="eyebrow">FRESH FROM THE OVEN</p><h1>A little sweetness,<br>every single day.</h1><p>Handmade cakes, pastries and ice cream. Explore the website you learn to build, one lesson at a time.</p><a class="btn btn-primary" href="<%= basePath %>/products">Explore our products →</a></div><img src="<%= basePath %>/assets/images/cake.svg" alt="Chocolate cake"></section>
<section><h2>Made to make you smile</h2><div class="gallery"><% for (const image of images) { %><figure><picture><source media="(max-width:600px)" srcset="<%= basePath %>/assets/images/<%= image.file %>-300.webp"><img src="<%= basePath %>/assets/images/<%= image.file %>-600.webp" alt="<%= image.caption %>" loading="lazy"></picture><figcaption><%= image.caption %></figcaption></figure><% } %></div></section>
<section class="info-grid"><div><h2>Our opening hours</h2><div class="table-scroll"><table><caption>Visit our bakery</caption><thead><tr><th scope="col">Day</th><th scope="col">Hours</th></tr></thead><tbody><tr><td>Monday–Friday</td><td>09:00–18:00</td></tr><tr><td>Saturday</td><td>10:00–16:00</td></tr><tr><td>Sunday</td><td>Closed</td></tr></tbody></table></div><p><label>Kitchen preparation <progress value="75" max="100">75%</progress></label></p></div><div id="faq"><h2>Good to know</h2><details><summary>How do I collect my order?</summary><p>Choose your treats and visit our bakery.</p></details><details><summary>Where can I find allergens?</summary><p>Each product page lists its ingredients.</p></details><details><summary>Is this a real shop?</summary><p>This is an educational demonstration. No payment is collected.</p></details></div></section>
<section><h2>Behind the scenes</h2><video controls preload="metadata" poster="<%= basePath %>/assets/images/cake.svg"><source src="<%= basePath %>/assets/media/bakery.mp4" type="video/mp4"><track kind="subtitles" srclang="en" label="English" src="<%= basePath %>/assets/media/captions.vtt" default></video><p><a href="<%= basePath %>/assets/media/captions.vtt">Read the captions</a></p></section></main><%- include('../fragments/footer') %>''')
write('views/pages/products.ejs','''<%- include('../fragments/header') %><main id="top"><p class="eyebrow">FIND YOUR FAVORITE</p><h1>Our products</h1><form id="filters"><label>Name<input id="search-name" type="search" placeholder="Search products"></label><label>Maximum price<input id="max-price" type="range" min="0" max="30" value="30"><output id="price-value">30</output></label><label>Category<select id="category"><option value="all">All</option><% for(const category of categories) { %><option value="<%= category %>"><%= category %></option><% } %></select></label><label>Ingredients<input id="ingredients" placeholder="For example: milk"></label><fieldset><legend>Diet</legend><label><input type="radio" name="diet" value="all" checked> All</label><label><input type="radio" name="diet" value="yes"> Sugar-free</label></fieldset><label>Sort<select id="sort"><option value="default">Default</option><option value="asc">Price: low to high</option><option value="desc">Price: high to low</option></select></label><button class="btn btn-primary" type="submit">Filter</button><button id="reset-filters" type="reset">Reset</button></form>
<p id="summary" role="status"></p><div id="product-list" class="products"><% for(const product of products) { %><article class="product-card" data-id="<%= product.id %>" data-name="<%= product.name.toLowerCase() %>" data-price="<%= product.price %>" data-category="<%= product.category %>" data-ingredients="<%= (product.ingredients || []).join(',').toLowerCase() %>" data-diabetic="<%= product.diabetic_friendly %>"><a href="<%= basePath %>/product/<%= product.id %>"><img src="<%= basePath %>/assets/images/<%= product.image %>-300.webp" alt="<%= product.name %>"><h2><%= product.name %></h2></a><p><%= product.description %></p><p><strong><%= Number(product.price).toFixed(2) %> EUR</strong> · <%= product.weight %> g</p><label><input type="checkbox" class="cart-choice" data-id="<%= product.id %>"> Add to cart</label></article><% } %></div><p id="empty-state" hidden>No products found.</p><noscript>Filters and the cart require JavaScript. Product links still work.</noscript></main><%- include('../fragments/footer') %>''')
write('views/pages/product.ejs','''<%- include('../fragments/header') %><main id="top"><a href="<%= basePath %>/products">← All products</a><article class="product-detail"><img src="<%= basePath %>/assets/images/<%= product.image %>-600.webp" alt="<%= product.name %>"><div><p class="eyebrow"><%= product.type %></p><h1><%= product.name %></h1><p><%= product.description %></p><strong><%= Number(product.price).toFixed(2) %> EUR</strong><dl><dt>Weight</dt><dd><%= product.weight %> g</dd><dt>Calories</dt><dd><%= product.calories %> kcal</dd><dt>Ingredients</dt><dd><%= (product.ingredients || []).join(', ') %></dd><dt>Category</dt><dd><%= product.category %></dd></dl><label><input class="cart-choice" type="checkbox" data-id="<%= product.id %>"> Add to cart</label></div></article></main><%- include('../fragments/footer') %>''')
write('views/pages/about.ejs','''<%- include('../fragments/header') %><main id="top"><p class="eyebrow">ABOUT THIS PROJECT</p><h1>Small steps. A complete website.</h1><p>This bakery brings HTML, CSS, JavaScript, SCSS, Express, EJS, JSON and PostgreSQL together.</p><section><h2>The recipe for a product page</h2><ol><li>Express receives the request.</li><li>PostgreSQL returns product data.</li><li>EJS builds the HTML.</li><li>The browser loads CSS and JavaScript.</li></ol></section><p>A simple MathML example: <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>p</mi><mo>=</mo><mfrac><mi>total</mi><mi>count</mi></mfrac></math></p></main><%- include('../fragments/footer') %>''')
write('views/pages/error.ejs','''<%- include('../fragments/header') %><main id="top"><p class="eyebrow">SWEET CORNER</p><h1><%= error.title %></h1><p><%= error.message %></p><a class="btn btn-primary" href="<%= basePath %>/">Back home</a></main><%- include('../fragments/footer') %>''')
write('public/scss/site.scss','''$accent: #9368ef;
$radius: 22px;
@mixin panel { border: 1px solid var(--line); border-radius: $radius; background: var(--panel); }
:root { color-scheme: dark; --bg:#13151e; --panel:#1e2130; --text:#f1edf8; --muted:#b6b0c4; --line:#3b374a; --accent:#bba1ff; }
body.light { color-scheme:light; --bg:#faf7f2; --panel:#fff; --text:#30293d; --muted:#6b6277; --line:#dfd6e8; --accent:#7150b5; }
* { box-sizing:border-box; } body { margin:0; background:var(--bg); color:var(--text); font:16px/1.75 system-ui,sans-serif; } a { color:var(--accent); } button,input,select { font:inherit; } button { cursor:pointer; } button,input,select { border:1px solid var(--line); border-radius:8px; padding:8px 12px; background:var(--panel); color:var(--text); } button:focus-visible,a:focus-visible { outline:3px solid $accent; outline-offset:4px; } [hidden] { display:none!important; }
.site-header { max-width:1220px; margin:auto; display:flex; align-items:center; gap:36px; padding:24px 32px; border-bottom:1px solid var(--line); } .brand { font-size:25px; font-weight:800; color:var(--text); text-decoration:none; letter-spacing:-1px; white-space:nowrap; span { display:block; font-size:8px; letter-spacing:2px; color:var(--muted); } } nav { flex:1; ul { display:flex; gap:24px; list-style:none; padding:0; margin:0; } li { position:relative; } a { color:var(--text); text-decoration:none; } ul ul { display:none; position:absolute; z-index:5; top:100%; left:0; min-width:160px; padding:14px; background:var(--panel); border:1px solid var(--line); border-radius:10px; } li:hover>ul,li:focus-within>ul { display:grid; gap:12px; } } .header-actions { display:flex; align-items:center; gap:18px; font-size:12px; } #menu-toggle { display:none; }
main { max-width:1160px; margin:auto; padding:48px 32px; min-height:65vh; } h1 { font-size:clamp(36px,5vw,64px); line-height:1.13; letter-spacing:-2px; margin:16px 0 24px; } h2 { font-size:27px; line-height:1.3; margin-bottom:24px; } p { color:var(--muted); } .eyebrow { color:var(--accent); font-size:11px; letter-spacing:2px; font-weight:700; } .hero { display:grid; grid-template-columns:1.2fr 1fr; align-items:center; gap:60px; min-height:460px; img { width:100%; max-height:370px; } } section { margin-bottom:70px; } .btn-primary { --bs-btn-bg:#7352b0; --bs-btn-border-color:#7352b0; --bs-btn-hover-bg:#8f6bc9; padding:12px 20px; border-radius:10px; }
.gallery,.products { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; } figure { @include panel; margin:0; overflow:hidden; img { width:100%; aspect-ratio:1.4; object-fit:cover; } figcaption { padding:16px; counter-increment:photo; &::before { content:counter(photo) '. '; color:var(--accent); } } } .gallery { counter-reset:photo; } .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; } table { width:100%; border-collapse:collapse; } td,th { border-bottom:1px solid var(--line); padding:12px; text-align:left; } caption { color:var(--muted); caption-side:top; } details { @include panel; padding:16px 20px; margin:12px 0; summary { cursor:pointer; } p { margin-bottom:0; } } video { width:100%; max-width:720px; max-height:420px; border-radius:$radius; } video::cue { color:white; background:#302244; }
#filters { @include panel; padding:24px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; margin:30px 0; label { display:grid; gap:8px; } fieldset { border:0; padding:0; } fieldset label { display:inline-flex; gap:8px; } legend { font-size:16px; } } .product-card { @include panel; padding:22px; img { width:100%; border-radius:14px; } a { text-decoration:none; } h2 { font-size:22px; margin:16px 0 10px; } &:hover { transform:translateY(-3px); transition:transform .2s; } } .product-detail { display:grid; grid-template-columns:1fr 1fr; gap:50px; margin-top:35px; img { width:100%; border-radius:$radius; } } footer { max-width:1160px; margin:auto; padding:24px 32px; border-top:1px solid var(--line); display:flex; gap:24px; justify-content:space-between; align-items:center; font-size:12px; p { margin:0; } }
#cookie-banner { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); width:calc(100% - 32px); max-width:660px; padding:22px; @include panel; box-shadow:0 12px 50px #0006; z-index:10; p { margin-top:0; } } @media(max-width:850px) { .site-header { flex-wrap:wrap; gap:20px; } .header-actions { margin-left:auto; } .hero { gap:20px; } .gallery,.products,#filters { grid-template-columns:repeat(2,minmax(0,1fr)); } } @media(max-width:600px) { main { padding:32px 20px; } .site-header { padding:20px; } #menu-toggle { display:block; margin-left:auto; } nav { display:none; flex-basis:100%; &.open { display:block; } ul { display:grid; } ul ul { position:static; display:grid; margin-top:12px; border:0; padding-left:20px; } } .header-actions { width:100%; justify-content:space-between; } .hero,.gallery,.products,.info-grid,.product-detail,#filters { grid-template-columns:1fr; } .hero img { max-height:240px; } .hero { min-height:0; } footer { flex-direction:column; align-items:start; } h1 { letter-spacing:-1px; } } @media print { nav,.header-actions,#filters,#cookie-banner { display:none; } body { background:white; color:black; } } @media(prefers-reduced-motion:reduce) { * { animation:none!important; transition:none!important; } }
''')
write('public/js/site.js','''(() => {
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
    const category = document.querySelector('#category').value;
    const ingredient = document.querySelector('#ingredients').value.trim().toLowerCase();
    const diet = document.querySelector('input[name="diet"]:checked').value;
    let total = 0, count = 0;
    for (const card of cards) {
      const visible = card.dataset.name.includes(search) && Number(card.dataset.price) <= maxPrice && (category === 'all' || card.dataset.category === category) && card.dataset.ingredients.includes(ingredient) && (diet === 'all' || card.dataset.diabetic === 'true');
      card.hidden = !visible;
      if (visible) { total += Number(card.dataset.price); count++; }
    }
    document.querySelector('#summary').textContent = `${count} products · visible total: ${total.toFixed(2)} EUR`;
    document.querySelector('#empty-state').hidden = count !== 0;
    document.querySelector('#price-value').textContent = String(maxPrice);
    const order = document.querySelector('#sort').value;
    const sorted = order === 'default' ? cards : [...cards].sort((a,b) => (order === 'asc' ? 1 : -1) * (Number(a.dataset.price) - Number(b.dataset.price)) || a.dataset.name.localeCompare(b.dataset.name));
    for (const card of sorted) list.appendChild(card);
  }
  form.addEventListener('submit', event => { event.preventDefault(); filterProducts(); });
  form.addEventListener('input', filterProducts);
  form.addEventListener('change', filterProducts);
  form.addEventListener('reset', () => setTimeout(filterProducts, 0));
  document.addEventListener('keydown', event => { if (event.altKey && event.key.toLowerCase() === 'c') { document.querySelector('#summary').textContent = `Cart: ${cart.length} products`; } });
  filterProducts();
})();
''')
for name,color,label in [('cake','#9463ad','CAKE'),('tea','#d49a69','PASTRY'),('icecream','#6fa5a3','ICE CREAM')]:
 write('public/images/'+name+'.svg',f'<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" rx="30" fill="#252237"/><ellipse cx="300" cy="345" rx="180" ry="28" fill="#151521"/><path d="M150 220 Q300 110 450 220 V310 Q300 380 150 310Z" fill="{color}"/><ellipse cx="300" cy="220" rx="150" ry="65" fill="#e8c7b4"/><path d="M155 225 Q300 280 445 225" fill="none" stroke="#6a3c51" stroke-width="18"/><circle cx="300" cy="170" r="20" fill="#b34874"/><text x="300" y="410" text-anchor="middle" fill="#e8daef" font-family="sans-serif" font-size="18" letter-spacing="6">{label}</text></svg>')
write('public/media/captions.vtt','WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nWelcome to Sweet Corner.\n\n00:00:05.000 --> 00:00:15.000\nFresh cakes, one small step at a time.\n')
write('README.md','''# Sweet Corner

Referință educațională cu identificatori în engleză, construită după funcționalitățile exemplului profesoarei.
Pornește din proiectul TehniciWeb cu `npm start` și deschide `/project/`.
Pentru rulare separată: instalează dependențele declarate și rulează `node app.js`.
Fără DATABASE_URL folosește PostgreSQL în memorie prin PGlite. Datele revin la seed la repornire.
Pentru PostgreSQL extern pregătește o bază de antrenament cu `data/products.sql` și setează DATABASE_URL.
Schema `users.sql` reproduce structura de utilizatori/accesări din material, fără a inventa autentificare care nu este implementată în exemplu.
SCSS este compilat cu Sass, iar imaginile WebP sunt generate cu sharp.
''')
print('Reference project sources written.')
