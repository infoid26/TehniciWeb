"""Build a separate exam bank; do not alter course IDs or course progress."""
import json
from copy import deepcopy
from pathlib import Path
from course_model import css, dom, js, express, ejs, prop, exact, count, attr

items = []


def add(id, title, category, task=None, minutes=15, hint='', steps=None, answer='', rubric=None, lesson_id=None, level='Bilet practic'):
    item = dict(id=id, title=title, category=category, minutes=minutes, level=level,
                hint=hint, steps=steps or [], answer=answer, rubric=rubric or [], lessonId=lesson_id)
    if task:
        item['task'] = task
        task['id'] = id
        task.setdefault('starter', '')
    items.append(item)
    return item


def build_exam(course):
    items.clear()
    raw = Path('site/course.js').read_text(encoding='utf-8')
    course = json.loads(raw.split(' = ', 1)[1].rstrip().removesuffix(';'))
    byid = {l['id']:l for c in course['chapters'] for l in c['lessons']}
    # Carefully bounded foundations: real, independently runnable exercises, linked
    # back to their explanations. They are labelled as foundations, not full tickets.
    groups = {
        'css': ['css-basics', 'css-selectors-complete', 'css-layout', 'css-effects-complete', 'css-details', 'scss'],
        'client': ['js-arrays', 'js-text', 'dom', 'json', 'storage'],
        'server': ['node', 'node-files-complete', 'express', 'http-routing-complete', 'ejs'],
        'sql': ['sql', 'sql-schema-complete', 'sql-queries-complete'],
    }
    for category, chapter_ids in groups.items():
        for chapter_id in chapter_ids:
            chapter = next(c for c in course['chapters'] if c['id'] == chapter_id)
            eligible = [l for l in chapter['lessons'] if l['task']['mode'] != 'text']
            for l in eligible[:4]:
                add('exam-foundation-' + l['id'], l['title'], category, deepcopy(l['task']),
                    minutes=8, hint=l['hint'], steps=l.get('walkthrough') or [l['intro'], l['explain']],
                    rubric=[l['task']['prompt'], 'Explică de ce ai ales această soluție.'],
                    lesson_id=l['id'], level='Fundamente')

    for id in ['css-first-letter', 'css-fixed-viewport', 'css-scale-horizontal', 'scss-bootstrap',
               'dulc-filter-dom', 'project-sort', 'project-json-error-page', 'project-pg-ejs-route']:
        l = byid[id]
        category = 'css' if l['task']['mode'] in ('css', 'scss') else 'server' if l['task']['mode'] == 'express' else 'client'
        add('exam-bridge-' + id, l['title'], category, deepcopy(l['task']), minutes=20 if category == 'server' else 15,
            hint=l['hint'], steps=l.get('walkthrough') or [l['explain']], lesson_id=id,
            rubric=['Rezolvă cerința fără erori.', 'Verifică și cazul opus.', 'Explică fiecare etapă.'])

    welcome = '#welcome { display: inline-block; transition: transform 1s; }\n#welcome:hover { transform: scale(2); }'
    add('exam-css-hover-transition', 'Text dublat gradual și revenire', 'css',
        css('Doar prin CSS, fă textul Welcome să devină de două ori mai mare în o secundă la hover și să revină gradual când cursorul pleacă. Păstrează HTML-ul.',
            welcome, '<h1><span id="welcome">Welcome</span></h1>',
            [prop('#welcome', 'transition-duration', '1s'), prop('#welcome', 'display', 'inline-block'),
             dict(kind='cssIncludes', value='#welcome:hover', label='Există starea hover.'),
             dict(kind='cssIncludes', value='scale(2)', label='Mărirea este dublă.')]),
        hint='Pune transition pe regula de bază, nu numai pe :hover.',
        steps=['inline-block permite transformarea textului.', 'Regula de bază definește durata în ambele sensuri.', ':hover schimbă numai transform.'],
        rubric=['Verifică trecerea în ambele sensuri în previzualizare.', 'Textul își păstrează forma și se dublează.'])

    table = '<table id="hours"><thead><tr><th>Day</th><th>Morning</th><th>Break</th><th>Evening</th></tr></thead><tbody>' + ''.join('<tr><th>'+day+'</th><td>10-12</td><td>12-14</td><td>14-20</td></tr>' for day in ['Monday','Tuesday','Wednesday','Thursday']) + '</tbody></table>'
    code = '#hours tbody tr:nth-child(-n+3) th:hover ~ td:nth-child(2),\n#hours tbody tr:nth-child(-n+3) th:hover ~ td:nth-child(4) {\n  background: blue;\n}'
    add('exam-css-timetable', 'Hover numai pe zi și numai pe anumite coloane', 'css',
        css('În primele trei rânduri ale tabelului, hover pe celula cu ziua colorează albastru numai Morning și Evening. Hover pe oră, pauză sau Thursday nu are efect. Nu modifica HTML-ul.', code, table,
            [dict(kind='cssIncludes', value='th:hover', label='Starea este pe celula zilei.'),
             dict(kind='cssIncludes', value='nth-child(-n+3)', label='Sunt restrânse primele trei rânduri.'),
             dict(kind='cssIncludes', value='background:blue', label='Este definit albastrul.')]),
        hint='~ selectează frații ulteriori ai celulei cu ziua.',
        steps=['Limitează rândurile în tbody.', 'Aplică :hover pe th, nu pe tr.', 'Selectează celulele 2 și 4 dintre frații ulteriori.'],
        rubric=['Verifică manual toate cele patru zile.', 'Pauza și ziua rămân necolorate.', 'Hover pe altă celulă nu produce efect.'])

    grid = '#topics { display: grid; grid-template-rows: repeat(3, auto); grid-auto-flow: column; counter-reset: topic; }\n#topics li { counter-increment: topic; }\n#topics li::after { content: " (" counter(topic) ")"; }'
    add('exam-css-columns-counter', 'Două coloane și numere generate prin CSS', 'css',
        css('Aranjează cele șase elemente în două coloane, primele trei pe coloana stângă. După fiecare text generează numărul între paranteze prin CSS, fără tabel sau numere scrise în HTML.', grid,
            '<ol id="topics">'+''.join('<li>'+name+'</li>' for name in ['HTML','CSS','JavaScript','Node','EJS','SQL'])+'</ol>',
            [prop('#topics', 'grid-auto-flow', 'column'), dict(kind='cssIncludes', value='counter-increment:topic', label='Numerotarea folosește contor.'), dict(kind='pseudo', selector='#topics li', pseudo='::after', name='content', includes='counter', label='Numărul este generat în pseudo-element.')]),
        hint='Trei rânduri și grid-auto-flow: column păstrează primele trei elemente pe aceeași coloană.',
        steps=['Definește cele trei rânduri.', 'Lasă Grid să umple coloana înainte de următoarea.', 'Resetează contorul, incrementează-l și afișează-l în ::after.'],
        rubric=['Ordinea vizuală este 1–3 la stânga și 4–6 la dreapta.', 'Numerotarea este generată, nu adăugată în HTML.'])

    desc_fixture = '<label>Description <input id="description"></label><button id="filter">Filter</button><article id="first" data-description="Blue paper notebook">Notebook</article><article id="second" data-description="Black ink pen">Pen</article>'
    desc = '''document.querySelector("#filter").onclick = function () {
  const term = document.querySelector("#description").value.trim().toLowerCase();
  for (const card of document.querySelectorAll("article")) {
    const description = card.dataset.description.toLowerCase();
    card.hidden = !description.includes(term);
  }
};'''
    add('exam-client-description', 'Un filtru nou pentru descriere', 'client',
        dom('La click pe Filter păstrează articolele a căror descriere conține termenul introdus, fără diferențe de majuscule și ignorând spațiile de la capete. Termenul gol afișează tot.', desc, desc_fixture,
            [prop('#first','display','block'), prop('#second','display','none')],
            [dict(type='fill', selector='#description', value=' BLUE '), dict(type='click', selector='#filter')],
            variants=[dict(label='Filtru gol', actions=[dict(type='click', selector='#filter')], tests=[prop('#first','display','block'), prop('#second','display','block')]),
                      dict(label='Altă descriere', actions=[dict(type='fill', selector='#description', value='ink'),dict(type='click',selector='#filter')],tests=[prop('#first','display','none'),prop('#second','display','block')])]),
        hint='dataset.description citește data-description. Șirul gol este inclus în orice text.',
        steps=['Citește termenul la click.', 'Normalizează termenul și descrierea la fel.', 'Schimbă hidden pentru fiecare articol.'],
        rubric=['Nu confunda textul numelui cu descrierea.', 'Filtrul gol și literele mari funcționează.'])

    slider_fixture = '<input id="price" type="range" min="0" max="100" value="0"><output id="value"></output><p id="previous"></p>'
    slider = '''const slider = document.querySelector("#price");
const output = document.querySelector("#value");
const previous = Number(localStorage.getItem("priceChanges") || "0");
document.querySelector("#previous").textContent = "Previous changes: " + previous;
function updateValue() {
  const value = Number(slider.value);
  output.textContent = slider.value;
  output.style.fontWeight = "bold";
  output.style.color = value > (Number(slider.min) + Number(slider.max)) / 2 ? "red" : "black";
}
updateValue();
slider.addEventListener("input", function () {
  const total = Number(localStorage.getItem("priceChanges") || "0");
  localStorage.setItem("priceChanges", String(total + 1));
  updateValue();
});'''
    add('exam-client-slider-storage', 'Slider, culoare și contor după reîncărcare', 'client',
        dom('Afișează valoarea sliderului îngroșat, roșie peste mijloc și neagră în rest. La fiecare input crește priceChanges în localStorage. Paragraful Previous changes afișează doar valoarea citită la încărcare, fără actualizare în timp ce muți sliderul.',slider,slider_fixture,
            [exact('#value','90'),prop('#value','font-weight','700'),prop('#value','color','rgb(255, 0, 0)'),exact('#previous','Previous changes: 3'),dict(kind='storage',key='priceChanges',value='5',label='Două evenimente au incrementat contorul.')],
            [dict(type='fill',selector='#price',value='40'),dict(type='fill',selector='#price',value='90')],
            storage={'priceChanges':'3'},
            variants=[dict(label='După reîncărcare',storage={'priceChanges':'5'},actions=[],tests=[exact('#previous','Previous changes: 5'),prop('#value','color','rgb(0, 0, 0)')])]),
        minutes=15, hint='Citește contorul o dată pentru paragraf. La input salvează separat noua valoare.',
        steps=['Citirea inițială actualizează paragraful.', 'updateValue schimbă numai output.', 'Evenimentul input incrementează stocarea virtuală.'],
        rubric=['La prima vizită contorul pornește de la zero.', 'Valoarea salvată se schimbă, paragraful rămâne fix.', 'Reîncărcarea citește noul total.'])

    radio_fixture = '<fieldset>'+''.join('<label><input type="radio" name="productType" value="'+x+'"'+(' checked' if x=='all' else '')+'>'+x+'</label>' for x in ['books','stationery','accessories','all'])+'</fieldset><input type="radio" name="other" checked><button id="filter">Filter</button><article id="book" data-type="books">Book</article><article id="pen" data-type="stationery">Pen</article>'
    radio = '''const saved = localStorage.getItem("productType");
for (const option of document.querySelectorAll('input[name="productType"]')) {
  if (option.value === saved) option.parentElement.style.border = "2px solid blue";
}
document.querySelector("#filter").onclick = function () {
  const selected = document.querySelector('input[name="productType"]:checked').value;
  localStorage.setItem("productType", selected);
  for (const card of document.querySelectorAll("article")) {
    card.hidden = selected !== "all" && card.dataset.type !== selected;
  }
};'''
    add('exam-client-radio-storage','Grup radio, filtrare și ultima opțiune','client',
        dom('La Filter afișează tipul selectat sau toate articolele pentru all. Salvează alegerea sub productType. La încărcare marchează cu border albastru eticheta opțiunii salvate. Nu schimba grupul radio other.',radio,radio_fixture,
            [prop('#book','display','none'),prop('#pen','display','block'),count('input[name="other"]:checked'),dict(kind='storage',key='productType',value='stationery',label='Alegerea este salvată.')],
            [dict(type='check',selector='input[value="stationery"]',checked=True),dict(type='click',selector='#filter')],
            variants=[dict(label='Opțiune salvată',storage={'productType':'books'},actions=[],tests=[prop('input[value="books"]','display','inline-block'),prop('label:has(input[value="books"])','border-top-color','rgb(0, 0, 255)')])]),
        hint='Folosește același name numai pentru cele patru opțiuni de produse.',
        steps=['Citește preferința la încărcare.', 'La click citește opțiunea :checked.', 'Aplică condiția și salvează alegerea.'],
        rubric=['Grupurile nu se influențează.', 'all afișează toate articolele.', 'Marcajul se face la încărcare.'])

    # Boundary-driven server tasks, with all JSON and EJS files supplied.
    gallery_files = {
        'gallery.json':json.dumps({'images':[{'name':'First','periods':['start']},{'name':'Middle','periods':['middle']},{'name':'Last','periods':['end']},{'name':'Always','periods':['always']},{'name':'Hidden'}]}),
        'views/gallery.ejs':'<h1>Gallery</h1><ul><% for (const image of images) { %><li><%= image.name %></li><% } %></ul>'}
    gallery = '''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
app.get("/gallery", function (request, response) {
  const data = JSON.parse(fs.readFileSync("gallery.json", "utf8"));
  const minute = new Date().getUTCMinutes();
  let period = "end";
  if (minute < 20) period = "start";
  else if (minute < 40) period = "middle";
  const images = data.images.filter(function (image) {
    return Array.isArray(image.periods) &&
      (image.periods.includes("always") || image.periods.includes(period));
  });
  response.render("gallery", { images: images });
});
module.exports = app;'''
    gallery_task = express('La /gallery citește gallery.json. Folosește minutele UTC ale timpului curent: [0,20) start, [20,40) middle, [40,60) end. always se afișează mereu. Lipsa periods exclude imaginea. Randează gallery.ejs. Sunt verificate granițele intervalelor.',gallery,[dict(path='/gallery',bodyExpected='<h1>Gallery</h1><ul><li>First</li><li>Always</li></ul>')])
    gallery_task.update(files=gallery_files,now='2026-10-25T10:00:00Z',variants=[])
    for minute,name in [(19,'First'),(20,'Middle'),(39,'Middle'),(40,'Last'),(59,'Last')]:
        gallery_task['variants'].append(dict(label='Minutul '+str(minute),now='2026-10-25T10:'+str(minute).zfill(2)+':00Z',requests=[dict(path='/gallery',bodyExpected='<h1>Gallery</h1><ul><li>'+name+'</li><li>Always</li></ul>')]))
    add('exam-server-gallery-periods','Galerie JSON filtrată pe intervale de minute','server',gallery_task,20,
        hint='Calculează intervalul o dată. Verifică existența vectorului înainte de includes.',
        steps=['Citește și parsează JSON.', 'Calculează perioada din minute.', 'Filtrează lista fără să modifici datele.', 'Oferă lista către EJS.'],
        rubric=['Minutele 0,19,20,39,40,59 sunt corecte.', 'always și lipsa proprietății sunt tratate.'])

    vowels = '''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
app.get("/vowel-errors", function (request, response) {
  const data = JSON.parse(fs.readFileSync("errors.json", "utf8"));
  const errors = data.errors.filter(function (error) {
    const matches = error.message.match(/[aeiou]/gi);
    return (matches ? matches.length : 0) > 7;
  });
  response.render("errors", { errors: errors });
});
module.exports = app;'''
    task = express('La /vowel-errors afișează o listă ordonată cu id și message pentru erorile cu mai mult de 7 vocale în message. Nu număra vocalele din title. Consideră vocalele engleze a,e,i,o,u fără diferență de majuscule.',vowels,[dict(path='/vowel-errors',bodyExpected='<h1>Vowel errors</h1><ol><li>3: AEIOUaei</li></ol>')])
    task['files']={'errors.json':json.dumps({'errors':[{'id':1,'title':'AEIOUAEIOU','message':'rhythm'},{'id':2,'title':'No','message':'aeiouae'},{'id':3,'title':'No','message':'AEIOUaei'}]}),'views/errors.ejs':'<h1>Vowel errors</h1><ol><% for (const error of errors) { %><li><%= error.id %>: <%= error.message %></li><% } %></ol>'}
    add('exam-server-vowel-errors','Erori din JSON cu peste șapte vocale','server',task,20,
        hint='match poate întoarce null; tratează acest caz ca zero potriviri.',
        steps=['Citește errors.json.', 'Numără numai în message.', 'Păstrează strict peste 7.', 'Randează ol cu id și mesaj.'],
        rubric=['Exact 7 este exclus.', 'Lipsa vocalelor nu produce eroare.', 'Titlul nu intră în numărătoare.'])

    offers = '''<ul>
<% for (const offer of offers) {
  const date = new Date(offer.date);
  const label = date.getUTCDate() + " " + months[date.getUTCMonth()] + " " + date.getUTCFullYear();
%>
  <li><time datetime="<%= date.toISOString() %>" style="color:red"><%= label %></time>
  <% if (offer.text.includes("Attention")) { %><strong><%= offer.text %></strong><% } else { %><span><%= offer.text %></span><% } %></li>
<% } %>
</ul>'''
    months=['January','February','March','April','May','June','July','August','September','October','November','December']
    task=ejs('Afișează ofertele în ul. Data, fără oră, apare roșie în time, folosind vectorul months. datetime include timpul ISO. Îngroașă tot textul doar dacă include Attention case-sensitive. Exemplele de antrenament au texte în engleză.',offers,
             dict(months=months,offers=[dict(date='2026-10-25T09:30:00Z',text='Attention: new stock'),dict(date='2026-01-02T11:00:00Z',text='Regular offer')]),
             [exact('time','25 October 2026'),attr('time','datetime','2026-10-25T09:30:00.000Z'),prop('time','color','rgb(255, 0, 0)'),exact('strong','Attention: new stock'),exact('li:nth-child(2) span','Regular offer')])
    task['variants'] = [
        dict(label='Lista goală', data=dict(months=months,offers=[]), tests=[dict(kind='absent',selector='li',label='Lista nu are oferte.')]),
        dict(label='Diferență de majuscule', data=dict(months=months,offers=[dict(date='2026-01-02T11:00:00Z',text='attention: ordinary text')]), tests=[exact('li span','attention: ordinary text'),dict(kind='absent',selector='strong',label='Nu îngroașă attention cu literă mică.')])]
    add('exam-server-offers-time','Oferte, time și evidențiere condiționată','server',task,20,
        hint='Lunile încep de la indexul 0. Separă formatul vizibil de atributul datetime.',
        steps=['Construiește obiectul Date.', 'Folosește luna ca index în months.', 'Păstrează timpul complet în datetime.', 'Testează Attention pe întregul text.'],
        rubric=['Luna vine din vector.', 'Nu se îngroașă doar cuvântul Attention.', 'Data vizibilă nu include ora.'])

    clock = '''const express = require("express");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
function showTime(request, response) {
  const now = new Date();
  const minute = now.getUTCMinutes();
  const period = minute < 20 ? "Start" : minute < 40 ? "Middle" : "End";
  if (request.path.endsWith("/folder")) {
    fs.mkdirSync("temp/" + Math.floor(now.getTime() / 1000), { recursive: true });
  }
  response.render("clock", { time: now.toISOString().slice(11, 19), period: period });
}
app.get("/server-time", showTime);
app.get("/server-time/folder", showTime);
module.exports = app;'''
    task=express('Creează /server-time și /server-time/folder. Afișează ora UTC HH:mm:ss și Start pentru minute [0,20), Middle pentru [20,40), End pentru [40,60). Numai ruta cu folder creează temp/<timestamp în secunde>. Folosește template-ul cu header/footer furnizat.',clock,[dict(path='/server-time',includes='10:20:30',fileAbsent='temp/1792923630'),dict(path='/server-time/folder',includes='Middle',fileExists='temp/1792923630')])
    task.update(now='2026-10-25T10:20:30Z',files={'views/clock.ejs':'<%- include("header") %><h1>Server time</h1><p><%= time %> - <%= period %></p><%- include("footer") %>','views/header.ejs':'<header>Catalog</header>','views/footer.ejs':'<footer>Contact</footer>'})
    add('exam-server-clock-folder','Ora serverului și director cu timestamp','server',task,20,
        hint='Date folosește milisecunde; împarte la 1000 și aplică Math.floor pentru secunde.',
        steps=['Citește timpul la fiecare cerere.', 'Calculează perioada.', 'Creează directorul numai pe ruta cerută.', 'Păstrează fragmentele comune.'],
        rubric=['Formatul include zerouri.', 'Timestamp-ul are secunde.', 'Pagina păstrează antetul și subsolul.'])

    # Transfer tasks are available to the random simulation without publishing a bank.
    for chapter in course['chapters']:
        for l in chapter['lessons']:
            if not l.get('challenge'):
                continue
            mode = l['task']['mode']
            if mode not in ('css','scss','dom','js','node','express','ejs','sql'):
                continue
            category = 'css' if mode in ('css','scss') else 'server' if mode in ('node','express','ejs') else 'sql' if mode == 'sql' else 'client'
            item = add('exam-transfer-' + l['id'], l['title'].removeprefix('Provocare: '), category,
                       deepcopy(l['task']), minutes=20 if category=='server' else 15,
                       hint=l['hint'], steps=[l['reasoning']['explanation'],l['reasoning']['counterexample']],
                       rubric=l['reasoning']['questions'], lesson_id=l['id'], level='Raționament')
            item['reasoning'] = deepcopy(l['reasoning'])

    # Reuse the course's independently runnable contracts, with stable exam IDs.
    # A lesson already represented by a foundation/transfer ticket is not copied twice.
    represented = {item.get('lessonId') for item in items}
    supported = {'html','css','scss','js','json','dom','node','express','ejs','sql'}
    for chapter in course['chapters']:
        for lesson in chapter['lessons']:
            if lesson['id'] in represented or lesson['task']['mode'] not in supported:
                continue
            mode = lesson['task']['mode']
            category = ('css' if mode in ('html','css','scss') else
                        'server' if mode in ('node','express','ejs') else
                        'sql' if mode == 'sql' else 'client')
            item = add('exam-curriculum-' + lesson['id'], lesson['title'], category,
                       deepcopy(lesson['task']), minutes=20 if category == 'server' else 15,
                       hint=lesson['hint'], steps=lesson.get('walkthrough') or [lesson['explain']],
                       rubric=[lesson['task']['prompt'], 'Explică alegerea și verifică un caz diferit.'],
                       lesson_id=lesson['id'], level='Bilet practic')
            if lesson.get('reasoning'):
                item['reasoning'] = deepcopy(lesson['reasoning'])
            represented.add(lesson['id'])
    lesson_chapters = {lesson['id']:chapter for chapter in course['chapters'] for lesson in chapter['lessons']}
    for item in items:
        if item.get('task'):
            mode = item['task']['mode']
            item['category'] = ('css' if mode in ('html','css','scss') else 'server' if mode in ('node','express','ejs') else 'sql' if mode == 'sql' else 'client')
        chapter = lesson_chapters.get(item.get('lessonId'))
        if chapter:
            item.update(chapterId=chapter['id'], chapterTitle=chapter['title'])

    # Oral rehearsals model the explanation, not a keyword-scored text quiz.
    oral = [
        ('html-tag','Ce exprimă un tag HTML?','Explică diferența dintre element, tag de deschidere, conținut și tag de închidere. Dă un exemplu cu p.','Un element precum <p>Hello</p> marchează un paragraf: <p> deschide, Hello este conținutul și </p> închide. Există și elemente fără tag final, de exemplu img.',['Identifică p.','Explică textul vizibil.','Menționează elementele fără închidere.'],'html-tags'),
        ('html-validate','Validează HTML în direct','Descrie pașii pentru validarea fișierului și remedierea erorilor.','Deschid validatorul HTML înainte de prezentare, încarc fișierul sau lipesc sursa, citesc prima eroare cu linia indicată, corectez cauza și validez din nou. Un afișaj aparent corect în browser nu dovedește validitatea.',['Validator deschis.','Fișierul corect.','Corectare și reverificare.'],'validation-html'),
        ('css-variable','Variabilă CSS și utilizarea ei','Arată unde declari o variabilă CSS și unde o folosești.','Declar --accent: navy în :root și folosesc color: var(--accent) pe selectorul dorit. Proprietățile personalizate se moștenesc și participă la cascadă; variabila Sass este evaluată la compilare.',['Declarație.','var().','Diferență față de Sass.'],'css-variables'),
        ('css-swap','Inversează vizual două secțiuni','Cum schimbi ordinea vizuală a secțiunilor prin CSS?','În containerul Grid schimb grid-template-areas sau coordonatele grid-row; în Flexbox pot folosi order. Ordinea din HTML și de citire rămâne aceeași, deci verific și accesibilitatea.',['Containerul potrivit.','Proprietate concretă.','Ordine DOM versus vizuală.'],'css-grid-areas'),
        ('css-selector','Descompune un selector combinat','Explică #hours tbody tr:nth-child(-n+3) th:hover ~ td:nth-child(4).','#hours identifică tabelul; spațiile cer descendenți; tbody restrânge corpul tabelului; nth-child(-n+3) păstrează primele trei rânduri; th:hover cere cursorul pe zi; ~ alege frați ulteriori; td:nth-child(4) cere a patra celulă din rând.',['Fiecare segment.','Rolul ~.','Poziții numărate de la 1.'],'css-scale-horizontal'),
        ('css-fixed','Link la 100px față de viewport','Cum poziționezi linkul în stânga, la 100px de sus?','Selectez linkul și aplic position: fixed; top: 100px; left: 0. În pagina simplă referința este viewport-ul. Verific dacă vreun strămoș transformat schimbă blocul de referință.',['fixed.','top și left.','Referință corectă.'],'css-fixed-viewport'),
        ('bootstrap-h1','H1 implicit de 40px','Cum personalizezi Bootstrap fără a rescrie manual h1 după compilare?','În SCSS atribui $h1-font-size: 40px înaintea importului Bootstrap. Pentru exact 40px pe toate lățimile dezactivez RFS în acest exercițiu. Compilez apoi în CSS și încarc CSS-ul generat.',['Variabilă înainte de import.','Compilare.','CSS încărcat.'],'scss-bootstrap'),
        ('css-tabs','Taburi centrate față de iframe','Cum centrezi grupul de taburi față de iframe?','Pun taburile și iframe-ul într-un container comun de aceeași lățime. Grupul taburilor primește display:flex și justify-content:center; iframe-ul are width:100%. Centrarea se raportează astfel la aceeași zonă.',['Container comun.','Flex și justify-content.','Aceeași lățime.'],'css-flex'),
        ('node-error','Adaugă o eroare personalizată','Descrie traseul de la condiția invalidă până la pagina erorii.','Adaug intrarea în JSON-ul erorilor, aleg identificatorul în validarea parametrilor, setez statusul HTTP și transmit datele către template-ul comun. return încheie ruta după trimiterea răspunsului.',['Intrare JSON.','Condiție.','Status, render și return.'],'project-json-error-page'),
        ('ejs-shared','Imagine comună tuturor paginilor','Cum adaugi același fragment EJS fără a duplica markup-ul imaginii?','Creez un partial cu img și îl includ în footer-ul comun, iar paginile includ footer-ul. Folosesc <%- include(...) %> pentru HTML-ul controlat al fragmentului. URL-ul imaginii este unul public, nu o cale locală de pe PC.',['Partial.','Include comun.','URL de resursă.'],'ejs-include'),
        ('json-gallery','Explică citirea galeriei rând cu rând','Ce fac readFileSync, utf8, JSON.parse și filter?','readFileSync primește calea și citește textul când specific utf8. JSON.parse transformă textul JSON în obiect JavaScript. Accesez vectorul de imagini, apoi filter creează o listă nouă pe baza condiției. Transmit rezultatul template-ului.',['Text versus obiect.','Proprietatea vectorului.','Filtrare și render.'],'node-json-file'),
        ('scss-compile','Când se compilează SCSS?','Distinge compilarea manuală, watch și compilarea la pornire.','Browserul nu execută SCSS. O comandă manuală compilează o dată. --watch urmărește schimbările și recompilă. Un script de pornire poate compila înainte să pornească serverul, numai dacă a fost configurat explicit. nodemon repornește Node și nu înlocuiește automat Sass watch.',['CSS rezultat.','Trei situații.','Rolul nodemon.'],'scss-compile'),
        ('pg-list','Rută nouă cu nume din PostgreSQL','Explică cerere → SQL → rânduri → EJS → HTML.','Adaug app.get pentru cale, execut SELECT name cu pool.query și await, transmit result.rows ca products către render, apoi parcurg vectorul în EJS pentru li. Tratez și tabelul gol și eroarea de interogare.',['result.rows.','render.','Buclă EJS și erori.'],'project-pg-ejs-route'),
        ('client-sort','Explică comparatorul rând cu rând','Cum sortezi numeric după preț, apoi după nume, în ambele sensuri?','Copiez vectorul, convertesc prețurile cu Number și scad al doilea preț din primul, first-second. Dacă diferența este zero, compar numele normalizate cu localeCompare. Înmulțesc rezultatul cu sign. sort modifică vectorul, deci copia protejează intrarea.',['Comparator negativ/zero/pozitiv.','Preț numeric.','Criteriu secundar și sign.'],'project-sort'),
        ('client-description','Adaugă filtrarea descrierii','Ce modifici în date, template și script?','Asigur câmpul description în datele primite, îl afișez sau îl expun într-un data attribute în EJS, adaug input text și citesc valoarea la filtrare. Normalizez ambele texte și verific includes. Combin rezultatul cu filtrele existente.',['Date.','EJS și control.','Condiție combinată.'],'project-filter'),
        ('storage-reload','Salvare versus afișare la reîncărcare','De ce contorul salvat poate diferi de cel afișat în paragraf?','La încărcare citesc totalul și actualizez paragraful o dată. În eveniment incrementez numai valoarea salvată. La următoarea încărcare, paragraful va citi totalul nou. getItem întoarce text sau null, deci convertesc numeric.',['Două momente distincte.','Text în stocare.','Cazul primei vizite.'],'storage-model'),
        ('callback-return','De ce return din callback nu returnează din solve?','Arată cine apelează callback-ul și ce funcție încheie return.','Callback-ul rulează separat când operația termină. return încheie acea funcție, nu funcția exterioară deja întoarsă. Pentru rezultat asincron returnez o promisiune pe care o îndeplinesc cu resolve și o resping cu reject.',['Funcție exterioară versus callback.','Ordine.','Promise.'],'node-read-callback'),
        ('nodemon','De ce pornești cu nodemon?','Explică fișierul de intrare, scriptul și reluarea după salvare.','Instalez nodemon ca dependență de dezvoltare și definesc dev: nodemon app.js în scripts din package.json. npm run dev pornește aplicația și repornește Node la schimbări. Reîncarc pagina separat. Ctrl+C oprește procesul.',['Instalare locală.','Script.','Browser versus server.'],'express-nodemon'),
        ('sql-order','SELECT și ordinea rândurilor','De ce ordinea din tabel nu garantează ordinea rezultatului?','SELECT alege coloanele, FROM sursa, WHERE filtrează și ORDER BY stabilește ordinea rezultatului. Fără ORDER BY, SQL nu garantează ordinea rândurilor. Nu confund filtrarea cu ștergerea.',['Rolul clauzelor.','Ordine explicită.','Datele originale rămân.'],'sql-order'),
        ('pg-params','Parametri SQL versus concatenare','Cum trimiți un tip de produs în query în siguranță?','Validez tipul față de opțiunile acceptate și folosesc WHERE type = $1 cu vectorul [type] ca al doilea argument query. Valorile nu se concatenează în SQL; numele coloanelor nu pot fi înlocuite astfel cu parametri de valori.',['Validare.','$1 și vector.','Valori versus identificatori.'],'sql-parameters'),
        ('ejs-escape','<%= versus <%-','Ce se întâmplă cu un nume de produs care conține taguri?','<%= îl escapează și îl afișează ca text, prevenind interpretarea ca markup. <%- inserează HTML neescapat și îl rezerv fragmentelor controlate precum include. Nu îl folosesc pe text furnizat de utilizator.',['Escapare.','Partial de încredere.','Text necontrolat.'],'ejs-escape'),
        ('radio','De ce grupurile radio au name diferit?','Ce determină exclusivitatea opțiunilor?','Butoanele radio cu același name și același proprietar de formular formează un grup exclusiv. Aleg un name comun numai opțiunilor filtrului de tip, diferit de celelalte grupuri. citesc :checked la aplicarea filtrului.',['name.','Separarea grupurilor.','Citirea opțiunii.'],'project-filter'),
        ('timestamp','Timestamp în secunde','Cum construiești numele directorului din ora curentă?','Date.now() sau getTime() oferă milisecunde de la epocă. Math.floor(timestamp / 1000) produce numărul întreg de secunde. Construiesc calea în directorul temp și creez directorul numai când ruta o cere.',['Milisecunde.','Împărțire și floor.','Locul și momentul creării.'],'node-mkdir-sync'),
        ('periods','Intervalele [0,20), [20,40), [40,60)','Cum tratezi minutele 20 și 40 fără goluri?','Folosesc minute < 20 pentru început, else if minute < 40 pentru mijloc, altfel final. Minutul 20 intră în mijloc, iar 40 în final. Verific separat always și lipsa proprietății de perioade.',['Limite.','else if.','Date absente.'],'js-if'),
    ]
    for id,title,prompt,answer,rubric,lesson_id in oral:
        item=add('exam-oral-'+id,title,'oral',minutes=2,hint='Spune ce fișier deschizi, de ce și ce efect are fiecare linie.',answer=answer,rubric=rubric,lesson_id=lesson_id,level='Prezentare orală')
        item['prompt']=prompt
    output = dict(version=1,sourceLabel='Exerciții de antrenament din programa cursului.',
                  exercises=items)
    Path('site/exam-data.js').write_text('window.TW_EXAM = '+json.dumps(output,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    print(len(items),'exam exercises;',sum('task' in x for x in items),'with editor and checks')
