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


def server_objectives(course):
    items.clear()
    raw = Path('site/course.js').read_text(encoding='utf-8')
    course = json.loads(raw.split(' = ', 1)[1].rstrip().removesuffix(';'))
    byid = {l['id']:l for c in course['chapters'] for l in c['lessons']}
    for id in ['project-json-error-page', 'project-pg-ejs-route']:
        l = byid[id]
        add('exam-bridge-'+id, l['title'], 'server', deepcopy(l['task']),
            hint=l['hint'], steps=l.get('walkthrough') or [l['explain']], rubric=[l['task']['prompt']])
    for id in ['reason-query', 'reason-escape-empty']:
        l = byid[id]
        add('exam-transfer-'+id, l['title'], 'server', deepcopy(l['task']),
            hint=l['hint'], steps=[l['reasoning']['explanation']], rubric=l['reasoning']['questions'])

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

    return items


def build_exam(course):
    from exam_tickets import build_tickets
    output = build_tickets(server_objectives(course))
    Path('site/exam-data.js').write_text('window.TW_EXAM = '+json.dumps(output,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    print(len(output['tickets']), 'complete exam tickets;', len(output['exercises']), 'checked objectives')
