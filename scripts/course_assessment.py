"""Guided corrections from the supplied presentation and practical exam examples."""
from copy import deepcopy
from course_model import lesson, q, text, css, js, express, prop, exact


def repair_assessment(chapters, cs, ls, edit, reorder, move):
    def add(cid, id, title, intro, example, explain, task, steps):
        item = lesson(cs[cid], id, title, intro, example, explain,
                      q('Ce urmărește acest exemplu?', intro, 'Șterge toate datele.', 'Nu produce niciun rezultat.'), task)
        item['walkthrough'] = steps
        item['hint'] = steps[-1]
        ls[id] = item
        return item

    for id in ['node-listen-port', 'node-send-file', 'express-all-methods']:
        move(id, 'express')
    move('express-template-engine', 'ejs')
    move('storage-remove-one', 'storage')
    reorder('express', ['express-first', 'node-listen-port', 'express-method', 'express-json', 'express-status'])
    reorder('ejs', ['express-template-engine'])
    reorder('storage', ['storage-model', 'storage-restore', 'storage-remove-one'])
    edit('express-first',
         intro='Express este o bibliotecă Node.js pentru servere web. O aplicație primește o cerere HTTP și trimite un răspuns. O rută leagă o metodă și o adresă de funcția care răspunde.',
         example='const express = require("express");\nconst app = express();\n\napp.get("/", function (request, response) {\n  response.send("Hello");\n});\n\nmodule.exports = app;',
         explain='require încarcă biblioteca instalată. express() creează aplicația app. get răspunde metodei GET la /. request descrie cererea; response permite trimiterea răspunsului. send trimite Hello și încheie răspunsul. Express apelează funcția la fiecare cerere potrivită. În laborator exportăm aplicația, iar platforma trimite cererile de test; într-un proiect propriu adăugăm listen.')
    ls['express-first']['walkthrough'] = ['require încarcă pachetul.', 'express() construiește aplicația.', 'app.get înregistrează ruta fără să execute funcția.', 'La GET /, response.send trimite Hello.']

    callback = '''const fs = require("fs");

function solve(input) {
  return new Promise(function (resolve, reject) {
    fs.readFile("message.txt", "utf8", function (error, content) {
      if (error) {
        reject(error);
        return;
      }
      resolve(content);
    });
  });
}'''
    edit('node-read-callback',
         intro='Un callback este o funcție oferită altei funcții pentru a fi apelată mai târziu. fs.readFile citește fără să aștepte rezultatul pe loc; la terminare apelează callback-ul cu eroarea și conținutul.',
         example=callback,
         explain='readFile primește calea, codificarea utf8 și callback-ul. error este null la succes; content este textul citit. return din callback încheie numai callback-ul, fără să returneze textul din solve. De aceea solve returnează o promisiune: resolve(content) o îndeplinește, iar reject(error) o respinge. Verificarea așteaptă promisiunea. Nu este necesar să combinăm aici async și await.',
         task=dict(solution=callback, starter='const fs = require("fs");\n\nfunction solve(input) {\n  return new Promise(function (resolve, reject) {\n    // Read message.txt here.\n  });\n}',
                   prompt='Fișierul virtual message.txt conține Hello. Citește-l cu fs.readFile și callback. Returnează o promisiune îndeplinită cu textul; respinge promisiunea la eroare.'))
    ls['node-read-callback']['walkthrough'] = ['new Promise primește o funcție cu resolve și reject.', 'readFile pornește citirea.', 'La eroare, reject semnalează eșecul, iar return oprește callback-ul.', 'La succes, resolve(content) livrează Hello.']
    simple = 'function solve(input) {\n  function double(value) {\n    return value * 2;\n  }\n  return input.map(double);\n}'
    add('js-functions-complete', 'callback-named', 'Un callback cu nume',
        'Un callback este o funcție transmisă ca argument. Funcția care o primește decide când o apelează.', simple,
        'double este declarată înainte de folosire. map primește double fără paranteze și o apelează pentru fiecare număr. double(value) ar apela-o imediat, în loc să transmită funcția. Pentru [2, 3] rezultă [4, 6].',
        js('Returnează un vector nou cu dublul fiecărui număr. Definește double și transmite-o metodei map.', simple, [([2, 3], [4, 6]), ([], []), ([-1, 0], [-2, 0])]),
        ['double descrie operația pentru un număr.', 'input.map(double) transmite funcția.', 'map formează un vector nou.'])
    reorder('js-functions-complete', ['callback-named'])
    add('node', 'node-callback-order', 'Ordinea citirii asincrone',
        'Instrucțiunile de după readFile pot rula înaintea callback-ului.',
        'console.log("Before");\nfs.readFile("message.txt", "utf8", function (error, content) {\n  console.log("Read");\n});\nconsole.log("After");',
        'Before apare prima. readFile programează citirea și întoarce controlul; After apare înaintea callback-ului. Când citirea se termină, callback-ul afișează Read. Nu citim rezultatul imediat după apel.',
        text('Scrie mesajele în ordinea afișării, separate prin virgulă și spațiu.', 'Before, After, Read'),
        ['Before rulează imediat.', 'After nu așteaptă citirea.', 'Read apare în callback.'])
    sequence = [l['id'] for l in cs['node']['lessons'] if l['id'] != 'node-callback-order']
    at = sequence.index('node-promise-value')
    reorder('node', sequence[:at] + ['node-callback-order'] + sequence[at:])

    filter_code = """document.querySelector("#filter").onclick = function () {
  const prefix = document.querySelector("#name-prefix").value.trim().toLowerCase();
  for (const card of document.querySelectorAll(".product")) {
    const name = card.querySelector(".product-name").textContent.trim().toLowerCase();
    card.style.display = name.startsWith(prefix) ? "block" : "none";
  }
};"""
    edit('dulc-filter-dom', example=filter_code,
         task=dict(fixture='<input id="name-prefix" value="not"><button id="filter">Filter</button><article class="product" id="notebook"><span class="product-name">Notebook</span></article><article class="product" id="pen"><span class="product-name">Pen</span></article>',
                   solution=filter_code,
                   tests=[prop('#notebook', 'display', 'block'), prop('#pen', 'display', 'none')],
                   actions=[dict(type='click', selector='#filter')],
                   prompt='La click pe Filter citește prefixul, ignorând spațiile și majusculele. Cu not, afișează Notebook și ascunde Pen.'))
    sort = '''function solve(input) {
  const products = [...input.products];
  function compareProducts(first, second) {
    const priceDifference = Number(first.price) - Number(second.price);
    if (priceDifference !== 0) {
      return input.sign * priceDifference;
    }
    const firstName = first.name.toLowerCase();
    const secondName = second.name.toLowerCase();
    return input.sign * firstName.localeCompare(secondName);
  }
  products.sort(compareProducts);
  return products.map(function (product) {
    return product.id;
  });
}'''
    edit('project-sort',
         intro='Un comparator întoarce un număr negativ dacă primul element trebuie să vină înaintea celui de-al doilea, zero pentru egalitate și un număr pozitiv pentru ordinea inversă.',
         example=sort,
         explain='Copiem vectorul deoarece sort îl modifică. Number convertește prețurile din text în numere. Diferența de preț decide primul criteriu; numai la egalitate comparăm numele. toLowerCase elimină diferența de majuscule; localeCompare compară textele. sign=1 păstrează sensul crescător; sign=-1 inversează ambele criterii. map păstrează id-urile.',
         task=dict(solution=sort))
    ls['project-sort']['walkthrough'] = ['Copia protejează input.', 'Compară prețurile numeric.', 'La egalitate, compară numele.', 'Aplică sign ambelor criterii.', 'Returnează id-urile în ordine.']
    for item in cs['project']['lessons']:
        for field in ['intro', 'explain', 'hint']:
            item[field] = item[field].replace('calorii', 'stoc')
        item['task']['prompt'] = item['task']['prompt'].replace('calorii', 'stoc')
    edit('project-errors',
         intro='Un răspuns HTTP are un status și un corp. În acest prim exercițiu construim răspunsuri text pentru 404 și 500. Un exercițiu ulterior adaugă JSON și EJS.',
         explain='Ruta /defect produce o eroare prin next(error). După rutele cunoscute punem fallback-ul 404. Handler-ul cu patru parametri primește erorile și trimite 500. send nu folosește încă JSON sau EJS.')
    edit('css-first-letter',
         explain='p selectează paragraful. ::first-letter selectează prima literă a primei linii formatate, inclusiv unele semne de punctuație alăturate. color: navy o colorează; font-size: 32px stabilește dimensiunea.',
         task=dict(tests=ls['css-first-letter']['task']['tests'] + [dict(kind='pseudo', selector='p', pseudo='::first-letter', name='font-size', includes='32px', label='Prima literă are 32px.')]))
    ls['ejs-conditions']['task']['variants'] = [dict(label='Produs indisponibil', data={'available': False}, tests=[exact('p', 'Sold out')])]
    ls['ejs-conditions']['task']['prompt'] = 'Afișează Available când available este true și Sold out când este false. Sunt verificate ambele situații.'

    fixed = '#back {\n  position: fixed;\n  top: 100px;\n  left: 0;\n}'
    add('css-layout', 'css-fixed-viewport', 'Un link față de viewport',
        'Viewport-ul este suprafața în care browserul afișează pagina. fixed fixează elementul față de acesta în pagina simplă furnizată.', fixed,
        'top: 100px măsoară distanța de sus; left: 0 aliniază marginea stângă. La derulare linkul rămâne acolo. Un strămoș transformat poate schimba referința lui fixed; aici nu există un asemenea strămoș.',
        css('Fixează #back la stânga viewport-ului, la 100px de sus.', fixed, '<a id="back" href="#top">Back to top</a>', [prop('#back', 'position', 'fixed'), prop('#back', 'top', '100px'), prop('#back', 'left', '0px')]),
        ['#back selectează linkul.', 'fixed îl scoate din flux.', 'top și left dau distanțele.'])
    scale = '.words p:nth-child(even) { transform: scaleX(0.5); }\n.words p::first-letter { font-size: 2em; }'
    add('css-effects-complete', 'css-scale-horizontal', 'Înjumătățește lățimea vizuală',
        'transform modifică desenarea. scaleX(0.5) înjumătățește orizontal elementul, păstrând înălțimea.', scale,
        ':nth-child(even) selectează pozițiile 2, 4 etc., numărate de la 1. scaleX schimbă desenul, fără să elibereze loc în flux. ::first-letter selectează prima literă; 2em dublează fontul ei față de paragraf.',
        css('Comprimă numai paragrafele pare la jumătate orizontal. Prima literă a fiecărui paragraf are 32px, iar restul 16px.',
            '.words p { font-size: 16px; }\n' + scale,
            '<div class="words"><p>Alpha</p><p>Beta</p><p>Gamma</p><p>Delta</p></div>',
            [prop('.words p:nth-child(2)', 'transform', 'matrix(0.5, 0, 0, 1, 0, 0)'), prop('.words p', 'transform', 'none'), dict(kind='pseudo', selector='.words p', pseudo='::first-letter', name='font-size', includes='32px', label='Prima literă este dublă.')]),
        ['even înseamnă poziții pare.', 'scaleX(0.5) comprimă orizontal.', '2em dublează fontul.'])

    nodemon = '''// package.json
{
  "scripts": {
    "dev": "nodemon app.js"
  }
}

// Terminal (after creating app.js and package.json)
npm install --save-dev nodemon
npm run dev'''
    add('express', 'express-nodemon', 'Pornește cu nodemon',
        'nodemon pornește aplicația Node și o repornește când salvezi fișiere urmărite. Reîncarci browserul separat.', nodemon,
        'Creezi app.js cu aplicația și app.listen(8080). package.json este configurarea creată prin npm init -y; adaugi dev în scripts păstrând restul. npm install --save-dev nodemon instalează local unealta și o înregistrează la dependențe de dezvoltare. npm run dev execută scriptul. Ctrl+C oprește serverul. Aceste comenzi sunt pentru folderul tău, fără repository-ul platformei.',
        text('După instalarea și configurarea din exemplu, ce comandă pornește serverul urmărit?', 'npm run dev', contextCode=nodemon, contextLabel='Configurare și comenzi'),
        ['app.js este fișierul de intrare.', 'Instalarea adaugă nodemon local.', 'npm run dev pornește scriptul.'])

    bootstrap = '$h1-font-size: 40px;\n$enable-rfs: false;\n@import "bootstrap/scss/bootstrap";'
    edit('scss-bootstrap', title='Personalizează sursele Bootstrap',
         intro='Bootstrap este o bibliotecă de stiluri. Sursele SCSS au variabile implicite pe care le modifici înainte de import și compilare.',
         example=bootstrap,
         explain='$h1-font-size: 40px configurează h1. $enable-rfs: false dezactivează micșorarea responsivă în acest exercițiu, pentru exact 40px inclusiv pe ecrane mici. Importul încarcă sursele reale Bootstrap 5 furnizate virtual. În proiectul propriu instalezi bootstrap și sass cu npm, salvezi custom.scss, apoi rulezi npx sass --load-path=node_modules custom.scss custom.css și încarci custom.css prin link. Browserul citește CSS. Bootstrap 5 încă folosește @import; avertismentele de depreciere nu opresc compilarea.',
         hint='Setează variabilele înainte de import; nu rescrie manual h1 după el.',
         task=dict(solution=bootstrap, fixture='<h1>Catalog</h1><button class="btn btn-primary">Products</button>',
                   tests=[prop('h1', 'font-size', '40px'), prop('.btn', 'display', 'inline-block')],
                   prompt='Compilează sursele Bootstrap furnizate cu h1 implicit de 40px și RFS dezactivat. Butonul trebuie să primească stilurile bibliotecii. Nu scrie manual reguli h1 sau .btn.',
                   starter='$h1-font-size: ;\n$enable-rfs: false;\n@import "bootstrap/scss/bootstrap";', bootstrap=True))

    route = '''const express = require("express");
const { Pool } = require("pg");
const app = express();
const pool = new Pool();
app.set("view engine", "ejs");

app.get("/product-names", async function (request, response, next) {
  try {
    const result = await pool.query("SELECT name FROM products ORDER BY name");
    response.render("names", { products: result.rows });
  } catch (error) {
    next(error);
  }
});
module.exports = app;'''
    task = express('La GET /product-names citește numele din PostgreSQL alfabetic și transmite result.rows către names.ejs ca products. Conexiunea și datele de test sunt virtuale.', route,
                   [dict(path='/product-names', bodyExpected='<h1>Product names</h1>\n<ul><li>Notebook</li><li>Pen</li></ul>')])
    task.update(database="CREATE TABLE products (name text); INSERT INTO products VALUES ('Pen'), ('Notebook');",
                files={'views/names.ejs': '<h1>Product names</h1>\n<ul><% for (const product of products) { %><li><%= product.name %></li><% } %></ul>'})
    task['tables'] = [dict(name='products', columns=['name'], rows=[{'name':'Pen'},{'name':'Notebook'}], totalRows=2)]
    task['files']['schema.sql'] = task['database']
    task['variants'] = [
        dict(label='Alte date și escapare', database="CREATE TABLE products (name text); INSERT INTO products VALUES ('<Tea>');", requests=[dict(path='/product-names', includes='<li>&lt;Tea&gt;</li>')]),
        dict(label='Tabel gol', database='CREATE TABLE products (name text);', requests=[dict(path='/product-names', includes='<ul></ul>')])]
    add('project', 'project-pg-ejs-route', 'Din PostgreSQL până la pagina EJS',
        'Serverul primește cererea, interoghează baza și oferă rândurile unui template. Browserul primește HTML.', route,
        'Pool gestionează conexiuni PostgreSQL. Aici baza virtuală este configurată automat; în proiectul propriu configurezi datele de conectare. await așteaptă interogarea. result.rows este vectorul de rânduri. render alege views/names.ejs și oferă products. EJS construiește elementele li; <%= scapă caracterele HTML. catch transmite erorile prin next.', task,
        ['GET activează ruta.', 'SELECT citește numele; ORDER BY sortează.', 'result.rows conține obiectele.', 'render construiește HTML din template.'])

    errors = '''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
const messages = JSON.parse(fs.readFileSync("errors.json", "utf8"));

app.get("/products", function (request, response) {
  if (request.query.type === "unknown") {
    response.status(400).render("error", { error: messages.invalidType });
    return;
  }
  response.send("Products");
});
module.exports = app;'''
    task = express('Din errors.json și error.ejs furnizate, afișează eroarea invalidType cu status 400 pentru /products?type=unknown. Pentru /products răspunde Products cu 200.', errors,
                   [dict(path='/products?type=unknown', status=400, includes='<h1>Invalid type</h1>'), dict(path='/products', bodyExpected='Products')])
    task['files'] = {'errors.json': '{"invalidType":{"title":"Invalid type","message":"Choose a known type."}}',
                     'views/error.ejs': '<h1><%= error.title %></h1><p><%= error.message %></p>'}
    add('project', 'project-json-error-page', 'O eroare personalizată din JSON',
        'O eroare personalizată are o intrare în date, o condiție care o detectează și un template care o afișează.', errors,
        'errors.json asociază invalidType cu titlul și mesajul. readFileSync citește textul; JSON.parse construiește obiectul. Ruta detectează parametrul invalid, setează 400 și oferă intrarea template-ului. return împiedică al doilea răspuns. Pentru o eroare nouă adaugi datele și condiția, păstrând template-ul comun.', task,
        ['Datele sunt în JSON.', 'Condiția precedă răspunsul normal.', 'status stabilește codul HTTP.', 'render și return încheie tratarea.'])

    # Rebuild derived requirements after changing fixtures/tests.
    for id in ['css-first-letter', 'scss-bootstrap', 'dulc-filter-dom']:
        ls[id]['task']['requirements'] = [test['label'] for test in ls[id]['task'].get('tests', [])]
