"""Beginner progression, explicit prerequisites and small independent SQL exercises."""
from copy import deepcopy
from course_model import lesson, q, text, sql, js

BASIC_ROWS=[{'id':1,'name':'Cake','price':12},{'id':2,'name':'Tea','price':4},{'id':3,'name':'Cookie','price':6}]
BASIC_SEED="""CREATE TABLE products (id integer, name text, price integer);
INSERT INTO products VALUES (1,'Cake',12),(2,'Tea',4),(3,'Cookie',6);"""

def improve(chapters):
    cs={c['id']:c for c in chapters}
    ls={l['id']:l for c in chapters for l in c['lessons']}
    def reorder(cid,front):
        c=cs[cid];byid={l['id']:l for l in c['lessons']}
        c['lessons']=[byid[i] for i in front]+[l for l in c['lessons'] if l['id'] not in front]
    def move(id,destination):
        for c in chapters:c['lessons']=[l for l in c['lessons'] if l['id']!=id]
        cs[destination]['lessons'].append(ls[id])
    def edit(id,**values):
        l=ls[id];task_values=values.pop('task',{})
        l.update(values)
        if task_values:
            l['task'].update(task_values)
            l['task']['revision']=max(3,l['task'].get('revision',1)+1)
        l['quiz']['explanation']=l['explain']

    # Syntax and simple data precede combinations, library details and integration.
    reorder('html-start',['html-tags','html-paragraphs','html-headings','html-attributes','html-links','html-tree','html-lists','html-nested-lists','html-doctype','html-head-body'])
    reorder('css-basics',['css-rule','css-class','css-id','css-colors','css-units','css-type','css-box','design-hierarchy','design-color','design-engines'])
    reorder('css-layout',['css-display','css-flex','css-flex-axes','css-flex-sizing','css-grid','css-grid-lines','css-grid-areas','css-responsive','css-variables','css-position','css-stack'])
    move('object-properties','js-start')
    move('array-index','js-start')
    reorder('js-start',['js-return','js-input','js-text','js-number','js-const','js-let','js-types','array-index','js-convert','js-compare','js-if','js-logic','object-properties','js-function','js-arrow','js-scope'])
    reorder('node',['node-run','node-npm','node-package','node-require','node-join','node-basename','node-dirname','node-read','node-buffer','node-json-file','node-exists','node-write','node-event-loop'])
    reorder('dates-complete',['date-full-getUTCFullYear','date-full-getUTCMonth','date-full-getUTCDate','date-full-getUTCDay','date-full-getUTCHours','date-full-getUTCMinutes','date-full-getUTCSeconds','date-full-getUTCMilliseconds'])

    c=cs['sql'];c['title']='SQL · de la primul tabel la primele interogări'
    c['subtitle']='Citește un tabel, alege coloane, filtrează și sortează; apoi creează și modifică date.'
    table=lesson(c,'sql-read-table','Citește un tabel: rânduri și coloane',
        'O bază de date păstrează informații organizate. Un tabel seamănă cu o foaie de calcul: coloanele descriu proprietăți, iar fiecare rând descrie un element. Nu scriem încă SQL.',
        'products\nid | name   | price\n1  | Cake   | 12\n2  | Tea    | 4\n3  | Cookie | 6',
        'În products sunt trei produse. Coloana name conține numele, iar price prețul. La intersecția rândului Tea cu coloana price citim 4. Numele products, name și price sunt alegeri pentru exemplu, nu cuvinte SQL.',
        q('Ce reprezintă un rând din tabelul products?','Un produs cu toate valorile sale','Numele unei coloane','O comandă SQL'),
        text('Privește tabelul products. Cum se numește coloana care conține valorile Cake, Tea și Cookie? Scrie doar numele coloanei.','name'))
    table['task']['tables']=[{'name':'products','columns':['id','name','price'],'rows':deepcopy(BASIC_ROWS),'totalRows':3}]
    table['exampleTables']=deepcopy(table['task']['tables']);table['example']=''
    table['hint']='Citește antetul coloanei de deasupra numelor de produse.'
    all_rows=lesson(c,'sql-read-all','Prima comandă SQL: citește tot tabelul',
        'SQL este limbajul prin care ceri date bazei de date. O interogare este o astfel de cerere. Tabelul products este deja pregătit: acum înveți doar să îl citești.',
        'SELECT *\nFROM products;',
        'SELECT înseamnă alegerea coloanelor. Simbolul * cere toate coloanele. FROM products indică tabelul. Punctul și virgula încheie comanda. O linie nouă face codul mai lizibil; nu schimbă rezultatul. SELECT citește date, fără să le șteargă sau modifice.',
        q('Ce cere * după SELECT?','Toate coloanele tabelului','Ștergerea tabelului','Un singur rând'),
        sql('Tabelul products este deja creat. Scrie o singură comandă care afișează toate coloanele și toate cele trei produse.', 'SELECT * FROM products;',deepcopy(BASIC_ROWS),BASIC_SEED,starter='SELECT *\nFROM ;'))
    all_rows['task']['unordered']=True;all_rows['task']['expectedResult']=deepcopy(BASIC_ROWS)
    all_rows['hint']='După FROM trebuie numele tabelului din antetul afișat: products.'
    ls.update({table['id']:table,all_rows['id']:all_rows})
    edit('sql-select',title='Alege o singură coloană',
         intro='În loc de *, poți scrie numele unei coloane după SELECT. Tabelul rămâne același; schimbi doar informațiile afișate.',
         example='SELECT name\nFROM products;',
         explain='SELECT name afișează numai coloana numelor. FROM products citește datele din products. Pentru prețuri înlocuiești name cu price. Fără ORDER BY, SQL nu promite o anumită ordine a rândurilor.',
         hint='Înlocuiește name din exemplu cu numele coloanei care conține prețurile.',
         task=dict(prompt='Afișează numai coloana price din tabelul products, pentru toate produsele. Nu filtra și nu modifica datele.',solution='SELECT price FROM products;',expected=[{'price':12},{'price':4},{'price':6}],setup=BASIC_SEED,starter='SELECT\nFROM products;',unordered=True))
    edit('sql-select-columns',intro='Poți cere mai multe coloane enumerând numele lor după SELECT, separate prin virgulă.',example='SELECT id, name\nFROM products;',explain='Virgula separă coloanele. id, name afișează identificatorul și numele fiecărui produs. Exercițiul cere în schimb name și price: păstrezi FROM și schimbi lista de coloane.',hint='După SELECT scrie cele două nume, separate prin virgulă.',task=dict(prompt='Afișează coloanele name și price pentru toate produsele.',solution='SELECT name, price FROM products;',expected=[{'name':r['name'],'price':r['price']} for r in BASIC_ROWS],setup=BASIC_SEED,unordered=True,starter='SELECT\nFROM products;'))
    for id in ['sql-where','sql-order','sql-limit','sql-insert','sql-update','sql-delete','sql-count']:
        l=ls[id];l['task']['setup']=BASIC_SEED
    edit('sql-where',example='SELECT name\nFROM products\nWHERE price >= 10;',intro='WHERE păstrează doar rândurile pentru care condiția este adevărată. >= se citește mai mare sau egal.',explain='FROM indică tabelul, WHERE verifică prețul fiecărui produs, iar SELECT name afișează numele celor păstrate. Cake costă 12 și trece condiția; Tea și Cookie nu. Rândurile eliminate din rezultat rămân în tabel.',hint='Adaugă WHERE price >= 10 după FROM products.',task=dict(prompt='Afișează numai name pentru produsele cu price de cel puțin 10.',solution='SELECT name FROM products WHERE price >= 10;',starter='SELECT name\nFROM products\nWHERE ;',unordered=True))
    edit('sql-order',task=dict(prompt='Afișează name pentru toate produsele, ordonate după price de la cel mai mic la cel mai mare.',solution='SELECT name FROM products ORDER BY price ASC;',starter='SELECT name\nFROM products\nORDER BY ;'))
    edit('sql-limit',task=dict(prompt='Afișează name pentru cele mai ieftine două produse. Sortează crescător după price, apoi limitează rezultatul la două rânduri.'))
    edit('sql-create',example='CREATE TABLE notes (\n  title text\n);',intro='Până acum tabelele erau pregătite. CREATE TABLE creează un tabel gol. În paranteze declari coloanele: numele, apoi tipul valorilor.',explain='notes este numele noului tabel. title este numele coloanei, iar text înseamnă că acea coloană păstrează texte. CREATE TABLE nu inserează rânduri. Verificarea adaugă automat un rând de probă pentru a confirma structura creată.',hint='Scrie CREATE TABLE notes, apoi coloana title de tip text în paranteze.',task=dict(prompt='Creează un tabel gol numit notes, cu o singură coloană: title de tip text. Nu adăuga INSERT sau SELECT; verificarea le execută pentru tine.',solution='CREATE TABLE notes (title text);',starter='CREATE TABLE notes (\n\n);'))
    edit('sql-insert',example="INSERT INTO products (id, name, price)\nVALUES (4, 'Bread', 8);",intro='INSERT INTO adaugă un rând într-un tabel existent. Scrii coloanele, apoi valorile în aceeași ordine. Textele SQL stau între ghilimele simple.',explain="id, name, price sunt cele trei coloane. 4, 'Bread', 8 sunt valorile noi, în aceeași ordine. Textul Bread are ghilimele, numerele nu. În exercițiu citești tabelul de pornire, apoi adaugi rândul cerut.",hint='Păstrează ordinea id, name, price și pune textul Bread între ghilimele simple.',task=dict(prompt='Adaugă în products produsul cu id 4, name Bread și price 8. Verificarea citește automat rândul adăugat.',solution="INSERT INTO products (id, name, price) VALUES (4, 'Bread', 8);"))
    edit('sql-update',task=dict(prompt='Schimbă price la 15 doar pentru produsul cu name Cake. Verificarea citește automat produsul modificat.',expected=[{'name':'Cake','price':'15'}]))
    edit('sql-delete',task=dict(prompt='Șterge doar rândul produsului cu name Tea. Celelalte două produse trebuie să rămână în tabel.'))
    edit('sql-count',title='Numără rândurile cu COUNT',example='SELECT COUNT(*) AS count\nFROM products;',intro='COUNT(*) numără rândurile. Rezultatul nu mai are câte un rând pentru fiecare produs, ci un rând cu numărul calculat.',explain='COUNT(*) calculează 3 pentru cele trei produse. AS count dă numele count coloanei rezultate. AS nu redenumește nicio coloană din tabelul original.',hint='Folosește COUNT(*) și numește coloana rezultată count cu AS.',task=dict(prompt='Numără toate rândurile din products și numește coloana rezultatului count.',solution='SELECT COUNT(*)::int AS count FROM products;',expected=[{'count':3}],starter='SELECT COUNT(*)::int AS count\nFROM ;'))
    ls['sql-count']['task']['solution']='SELECT COUNT(*) AS count FROM products;'
    ls['sql-count']['task']['expected']=[{'count':3}]
    ls['sql-count']['task']['starter']='SELECT COUNT(*) AS count\nFROM ;'
    for id in ['sql-numeric','sql-default','sql-arrays','sql-enum']:move(id,'sql-schema-complete')
    for id in ['sql-parameters','pg-rows']:move(id,'sql-queries-complete')
    move('sql-select-columns','sql')
    reorder('sql',['sql-read-table','sql-read-all','sql-select','sql-select-columns','sql-where','sql-order','sql-limit','sql-create','sql-insert','sql-update','sql-delete','sql-count','sql-group'])
    for c in chapters:
        for l in c['lessons']:
            t=l['task']
            if t['mode']=='sql':
                t['contextCode']=t.get('setup','');t['contextLabel']='Baza de date de la care pornești';t['expectedResult']=deepcopy(t['expected'])
    move('node-pg-connect','sql-queries-complete')
    repair_concept_jumps(cs,ls,edit,reorder)
    from course_assessment import repair_assessment
    repair_assessment(chapters, cs, ls, edit, reorder, move)
    add_guidance(cs,ls)
    explain_notation(cs)


# Each chapter declares what it teaches and which earlier lesson provides its base.
# These are actual learning dependencies, not assumed knowledge of an external project.
GUIDES={
'start':('Nu ai nevoie de cunoștințe de programare. Începi cu un titlu afișat în browser.',[],['Un site este alcătuit din pagini. Browserul este programul care le afișează.','În exemplu, h1 marchează titlul. Textul dintre taguri este ceea ce vezi în pagină.','În exercițiu schimbi doar textul titlului; structura tagurilor va fi explicată separat.']),
'web-foundations':('Înțelegi drumul unei pagini de la server la browser.',['start-request'],['Internetul este rețeaua care transportă date între calculatoare.','Web-ul este un serviciu al internetului: browserul cere resurse folosind HTTP.','Nu ai de configurat o rețea: identifici rolurile din exemplul oferit.']),
'html-start':('Înveți să construiești conținutul unei pagini, începând cu un singur element.',['start-browser'],['Un element HTML este o bucată de conținut marcată cu taguri.','În <p>Hello</p>, <p> deschide paragraful, Hello este textul, iar </p> îl închide.','Scrii conținutul între taguri; nu ai nevoie încă de CSS sau JavaScript.']),
'html-semantics-complete':('Alegi tagul după sensul textului, după ce știi structura unui element HTML.',['html-paragraphs','html-emphasis'],['b marchează o porțiune care trebuie să atragă atenția în text.','Tagul de închidere </b> delimitează sfârșitul acelei porțiuni.','Sensul diferă de strong: o evidențiere nu înseamnă automat importanță semantică.']),
'html-media':('Adaugi resurse în pagină; începi cu o singură imagine.',['html-attributes'],['img introduce o imagine și nu are tag de închidere.','src spune unde se găsește imaginea; alt descrie conținutul ei prin text.','Exercițiul furnizează datele necesare: nu presupune că ai o galerie pe calculator.']),
'html-controls-complete':('Extinzi formularele simple cu tipuri de câmpuri și reguli.',['html-labels','html-form'],['textarea este un câmp în care se pot scrie mai multe rânduri.','label explică ce completezi; for indică id-ul câmpului.','Textul inițial se scrie între <textarea> și </textarea>, nu în value.']),
'mathml':('Reprezinți o formulă pornind de la un număr, un nume și un operator.',['html-tags'],['math este elementul care conține formula.','mi reprezintă un nume precum x; mn un număr precum 2; mo un operator precum +.','Formulele mai complexe se construiesc ulterior din aceste elemente mici.']),
'mathml-details':('Exersezi separat elementele formulelor, după primele formule MathML.',['math-tokens'],['mi este un element MathML pentru un identificator matematic.','În interiorul math, <mi>x</mi> reprezintă numele x.','Nu ai de calculat valoarea lui x; exercițiul verifică felul în care îl descrii.']),
'css-basics':('Scrii prima regulă CSS și observi ce element schimbă.',['html-tags','html-attributes'],['Selectorul dinaintea acoladelor spune ce elemente stilizezi.','În acolade, proprietatea spune ce schimbi, iar valoarea arată noul aspect.','Două puncte separă proprietatea de valoare; punctul și virgula încheie declarația.']),
'css-selectors-complete':('Extinzi selectorii simpli cu potriviri pe atribute.',['css-class','css-attributes'],['Un atribut HTML are un nume și o valoare, precum href și adresa unei legături.','[href^="https"] selectează elementele al căror href începe cu textul https.','Declarațiile din acolade se aplică doar elementelor selectate; atributul nu este modificat.']),
'css-layout':('Înțelegi cum ocupă elementele spațiul, apoi le așezi cu Flexbox și Grid.',['css-rule','css-box'],['display stabilește felul în care un element participă la așezarea paginii.','block și inline descriu comportamente de bază; none elimină cutia din așezare.','visibility: hidden păstrează spațiul ocupat, deși conținutul nu se vede.']),
'css-effects-complete':('Construiești efecte după ce știi declarații, culori și fundaluri.',['css-colors','css-backgrounds'],['Un gradient este o tranziție între culori, folosită ca imagine de fundal.','radial-gradient pornește dintr-un centru și se extinde spre exterior.','Îl atribui proprietății background-image; nu ai nevoie de un fișier imagine.']),
'css-details':('Exersezi câte o proprietate; baza rămâne aceeași regulă CSS.',['css-rule','css-backgrounds'],['Fundalul este desenat într-o zonă a elementului.','background-attachment stabilește dacă imaginea se deplasează cu pagina sau rămâne fixă.','Compară scroll cu fixed; proprietatea nu fixează elementul HTML în sine.']),
'js-start':('Începi prin a returna o valoare; funcția de lucru este furnizată.',['start-symbols'],['solve este funcția pe care o execută verificarea. Nu trebuie să o construiești de la zero la primul pas.','Acoladele delimitează corpul funcției. return trimite rezultatul către verificare.','La început schimbi doar valoarea de după return; parametrii și funcțiile vin pe rând.']),
'js-scope-complete':('Înțelegi unde pot fi folosite variabilele, după let, const și funcții.',['js-let','js-scope'],['Scope înseamnă zona codului în care un nume poate fi folosit.','Un bloc este delimitat de acolade, de exemplu în interiorul unui if.','var nu este limitat la acel bloc; compară comportamentul cu let.']),
'js-functions-complete':('Aprofundezi funcțiile și apelurile, după declararea și apelarea unei funcții simple.',['js-function','object-properties'],['O declarație de funcție leagă un nume de un corp de instrucțiuni.','Dacă declari de două ori același nume în contextul exemplului, trebuie urmărită declarația folosită la apel.','Nu sunt două execuții simultane: se apelează funcția asociată numelui.']),
'js-arrays':('Lucrezi cu o listă, pornind de la poziția unui singur element.',['array-index','js-const'],['Un vector, numit Array în JavaScript, păstrează mai multe valori într-o ordine.','Parantezele pătrate construiesc lista; [0] citește primul element.','length este numărul de elemente. Ultimul indice al unei liste ne-goale este length - 1.']),
'js-collections-complete':('Aprofundezi operațiile pe liste, după acces, adăugare, filtrare și sortare.',['array-index','array-splice'],['Un indice reprezintă o poziție din vector.','delete elimină valoarea acelei proprietăți, dar nu mută elementele următoare.','Pentru eliminarea unei poziții și compactare folosești splice, studiat anterior.']),
'js-text':('Prelucrezi texte prin operații mici, începând cu eliminarea spațiilor de la capete.',['js-text','object-properties'],['Un șir este o valoare text între ghilimele.','O metodă este o operație apelată cu punct și paranteze: text.trim().','trim întoarce un text nou, fără spațiile de la început și sfârșit; interiorul rămâne intact.']),
'regex-complete':('Aprofundezi modelele de text după prima expresie regulată și test.',['regex-basic','regex-quantifiers'],['O expresie regulată este un model pentru căutare în text.','new RegExp construiește modelul dintr-un șir; forma /.../ îl scrie direct în cod.','La construirea dintr-un șir, backslash-ul trece prin două niveluri de interpretare.']),
'dates-complete':('Citești și modifici pe rând componentele unui moment în timp.',['date-utc','date-time'],['new Date(input) construiește un obiect care reprezintă momentul primit.','UTC este reperul comun folosit de exerciții, ca rezultatul să nu depindă de țara calculatorului.','getUTCFullYear citește anul complet, de exemplu 2026; nu modifică obiectul.']),
'js-details':('Exersezi câte o metodă după lucrul cu texte, liste și funcții.',['string-search','js-function'],['endsWith verifică dacă un text se termină cu fragmentul cerut.','Parantezele conțin fragmentul căutat, iar metoda returnează true sau false.','Comparația ține cont de litere mari și mici dacă nu normalizezi textul.']),
'dom':('Legi JavaScript de elementele unei pagini, începând cu găsirea unui element.',['css-id','js-function','object-properties'],['DOM este reprezentarea paginii HTML în memorie, accesibilă din JavaScript.','document reprezintă pagina. querySelector primește un selector CSS.','Rezultatul este primul element potrivit sau null dacă nu există; nu este textul HTML.']),
'browser-integration':('Combini operații DOM pe o pagină furnizată.',['dom-select','dom-create','dom-click'],['createElement creează un element în memorie, dar nu îl afișează încă.','appendChild atașează elementul ca ultim copil al părintelui ales.','Alegi părintele cu un selector și adaugi copilul; nu înlocuiești tot conținutul părintelui.']),
'storage':('Înțelegi întâi salvarea unui text; coșul și cookie-urile vin după aceea.',['js-text','js-function'],['localStorage este un spațiu de stocare al site-ului în browser.','O cheie este numele sub care salvezi o valoare. Cheile și valorile sunt texte.','Pentru obiecte și liste se folosește transformarea în JSON, explicată în capitolul dedicat.']),
'json':('Descrii date separat de cod, pornind de la un obiect mic.',['object-properties','array-index'],['JSON este un format text pentru date, nu un limbaj de instrucțiuni.','Un obiect folosește acolade; fiecare pereche are o cheie între ghilimele duble, apoi două puncte și valoarea.','Virgula separă perechile; nu pui virgulă după ultima pereche.']),
'json-complete':('Înțelegi regulile și limitele JSON după parse și stringify.',['json-syntax','json-parse','json-stringify'],['JSON poate descrie obiecte, vectori, texte, numere, true, false și null.','undefined și funcțiile JavaScript nu sunt valori JSON.','Distinge o valoare JavaScript de textul obținut prin JSON.stringify.']),
'scss':('Pornești de la CSS cunoscut și înveți ce adaugă SCSS.',['css-rule','css-class'],['Browserul înțelege CSS. SCSS este un limbaj sursă care trebuie transformat în CSS.','Compilatorul citește SCSS și produce declarațiile CSS finale.','În laborator compilarea este automată; nu trebuie să instalezi Sass ca să începi.']),
'scss-complete':('Reutilizezi stiluri după variabile, compilare și reguli SCSS simple.',['scss-compile','scss-variables'],['Un mixin este un grup de declarații căruia îi dai un nume.','@mixin definește grupul; $size este valoarea pe care o poate primi.','@include îl aplică într-un selector, înlocuind parametrul cu valoarea transmisă.']),
'node':('Înțelegi unde rulează Node înainte să folosești module sau fișiere.',['js-function','json-syntax'],['Node.js execută JavaScript în afara browserului, de exemplu într-un terminal.','node urmat de un nume de fișier cere executarea acelui fișier.','Exercițiul cere doar comanda; nu pornește un server și nu necesită instalarea Node.']),
'node-files-complete':('Aprofundezi fișierele după modulele path și fs.',['node-require','node-join','node-read'],['O cale descrie locul unei resurse; nu garantează că resursa există.','path.parse desparte calea în părți: director, nume și extensie.','Laboratorul folosește căi POSIX pentru rezultate stabile; nu îți citește fișierele personale.']),
'node-integration':('Combini fișiere și date după operații simple și tratarea asincronă.',['node-read','node-write','node-async-read'],['Un director grupează fișiere și alte directoare.','mkdirSync creează directorul înainte de continuarea codului.','recursive:true permite crearea părinților lipsă. Totul se întâmplă în fișierele virtuale.']),
'express':('Primești scheletul aplicației și adaugi prima rută care răspunde cu text.',['node-require','js-arrow','start-request'],['require("express") încarcă biblioteca; express() creează aplicația.','app.get asociază o adresă cu o funcție. req reprezintă cererea, res răspunsul.','res.send trimite textul. În laborator exportăm app; verificarea trimite cererile fără app.listen.']),
'http-routing-complete':('Extinzi rutele GET și POST după prima aplicație Express.',['express-first','express-method','express-status'],['Metoda HTTP arată operația cerută, iar calea arată resursa.','app.put tratează metoda PUT pentru calea indicată.','Funcția rutei produce răspunsul; o rută GET pe aceeași cale nu o înlocuiește.']),
'ejs':('Introduci o valoare într-un HTML simplu; condițiile și listele vin ulterior.',['html-tags','object-properties'],['Un template este un text HTML cu locuri care vor fi completate din date.','Datele exercițiului conțin cheia title. <%= title %> citește valoarea ei.','EJS produce HTML final înainte ca browserul să îl afișeze. Nu ai de configurat un server la primul pas.']),
 'templates-data-complete':('Combini EJS cu formulare după afișarea unei valori și o buclă simplă.',['ejs-output','ejs-conditions','ejs-loop','html-select'],['Un select conține opțiuni option, fiecare cu o valoare.','Bucla EJS generează câte un option pentru fiecare categorie.','Comparația cu selected decide pe care opțiune apare atributul selected.']),
'sql':('Începi fără cunoștințe SQL și fără instalare: citești un tabel, apoi scrii o singură comandă.',[],['Antetul tabelului conține numele coloanelor.','Fiecare rând conține valorile unui produs.','Citește numele coloanei cerute; comenzile SQL încep în lecția următoare.']),
'sql-schema-complete':('Construiești structuri după primele SELECT, CREATE TABLE și INSERT.',['sql-create','sql-insert'],['O cheie primară identifică unic un rând și nu poate lipsi.','serial pregătește atribuirea automată a unui număr când coloana id este omisă.','Exemplul combină crearea, inserarea și RETURNING; citește cele trei comenzi separat.']),
'sql-queries-complete':('Construiești interogări mai bogate după alegerea coloanelor, filtrare și sortare.',['sql-select-columns','sql-where','sql-order','sql-count'],['DISTINCT păstrează o singură apariție a fiecărei valori din rezultat.','SELECT DISTINCT kind citește tipurile fără repetări.','Conversia ::text schimbă tipul rezultatului, iar AS kind îi dă numele coloanei.']),
'dulcelind-setup':('Pregătești opțional un proiect pe calculator după exercițiile independente.',['node-run','express-first','sql-select'],['Browserul afișează pagina finală, dar nu execută codul Node sau interogarea PostgreSQL.','Express primește cererea, baza de date întoarce rânduri, iar EJS generează HTML.','Acesta este un capitol de integrare: revino la bazele indicate dacă un rol nu este clar.']),
'project':('Combini noțiuni deja exersate într-un catalog independent.',['html-head-body','css-grid','dom-click','ejs-loop'],['Documentul HTML oferă structura generală: head și body.','header, nav, main și footer sunt zonele paginii, nu funcții JavaScript.','Construiește mai întâi structura, apoi adaugă aspectul și comportamentul în pașii următori.']),
'dulcelind-azure':('Aplici SQL și Node la publicare după schema de date și interogări.',['sql-create','schema-reference','sql-parameters','dulc-workspace'],['O schemă PostgreSQL este un spațiu de nume în aceeași bază de date.','CREATE SCHEMA demo creează acel spațiu; demo.proba indică tabelul proba din el.','Nu creează un server Azure. Mai întâi exersezi SQL; configurarea Azure este un pas ulterior.'])
}

def add_guidance(cs,ls):
    for cid,(goal,prerequisites,steps) in GUIDES.items():
        c=cs[cid]
        c['learning']={'goal':goal,'prerequisites':prerequisites,'level':'De la zero' if not prerequisites else 'Continuare ghidată'}
        c['lessons'][0]['walkthrough']=steps
    # Avoid mixing array reductions into the first encounter with rest parameters.
    rest=ls['js-default-rest']
    rest['task'].update(solution='function solve(input) { function sum(...values) { let total = 0; for (const value of values) total += value; return total; } return sum(...input); }',revision=3)
    rest['hint']='Rest formează vectorul values. O buclă for...of, deja studiată, poate aduna valorile; nu ai nevoie de reduce.'
    rest['example']='function collect(first, ...others) {\n  return others;\n}\n\ncollect(1, 2, 3); // [2, 3]'
    rest['intro']='Un parametru poate avea o valoare implicită. Separat, ... înaintea ultimului parametru strânge argumentele rămase într-un vector. Aceste două reguli nu cer reduce sau sortare.'
    rest['explain']='first primește 1. Parametrul ...others strânge 2 și 3 în lista [2, 3]. Vectorii vor avea un capitol propriu; aici observi doar cum sunt adunate argumentele.'
    # Provide the surrounding syntax at the first encounter; do not make the learner
    # guess library boilerplate or a function signature before they have learned it.
    ls['js-return']['task']['starter']='function solve(input) {\n  return "";\n}\n'
    ls['js-input']['task']['starter']='function solve(input) {\n  return;\n}\n'
    ls['ejs-output']['task']['starter']='<h1></h1>'
    ls['dom-select']['task']['starter']='const heading = document.querySelector("#welcome");\nheading.textContent = "";\n'
    # Every core chapter has a concrete first example and explains its notation.
    for c in cs.values():
        for l in c['lessons']:
            l['quiz']['explanation']=l['explain']
            t=l['task']
            if t['mode']=='sql' and t.get('prompt','').startswith(('Scrie SQL pentru','Rulează SQL pe')):
                expected=t.get('expected',[])
                columns=', '.join('`'+k+'`' for k in (expected[0] if expected else {}))
                t['prompt']='Scrie comanda SQL descrisă în această lecție. '+('Rezultatul trebuie să aibă coloanele '+columns+' și valorile din tabelul rezultatului cerut.' if columns else 'Urmărește rezultatul cerut mai jos.')


def repair_concept_jumps(cs,ls,edit,reorder):
    # Generic instructions must not replace the operation the student is learning.
    edit('dom-select',task=dict(prompt='Găsește titlul cu id welcome și schimbă textul lui din Old title în Welcome. HTML-ul de pornire este furnizat.',starter='const heading = document.querySelector("#welcome");\nheading.textContent = "";\n'))
    for id,column in [('schema-varchar','name varchar(50)'),('schema-not-null','name text NOT NULL')]:
        t=ls[id]['task'];parts=t['solution'].split(';',1)
        edit(id,task=dict(prompt='Creează un tabel gol numit labels cu o singură coloană: '+column+'. Verificarea inspectează automat structura.',solution=parts[0]+';',checkQuery=parts[1].strip()))
        ls[id]['explain']+=' Nu trebuie să memorezi information_schema: această inspecție este făcută de verificare, după comanda ta.'
    edit('schema-serial',example='CREATE TABLE orders (\n  id serial PRIMARY KEY,\n  total numeric(8,2)\n);',explain='serial atribuie automat următorul număr când id este omis la inserare. PRIMARY KEY cere ca acel id să fie unic și nenul. numeric(8,2) descrie un număr cu până la opt cifre totale, dintre care două zecimale. Verificarea inserează automat o comandă și citește id-ul.',task=dict(prompt='Creează orders cu id serial PRIMARY KEY și total numeric(8,2). Nu insera rânduri: verificarea adaugă unul pentru a testa id-ul automat.',solution='CREATE TABLE orders (id serial PRIMARY KEY, total numeric(8,2));',checkQuery='INSERT INTO orders(total) VALUES (12.50) RETURNING id;'))
    # Keep aggregate coverage, but introduce each operation in its own small task.
    for id,title,fn,expected,idea in [
      ('sql-sum','Adună valorile cu SUM','SUM',[{'total':22}],'SUM(price) adună valorile din coloana price. Pentru 12, 4 și 6, totalul este 22.'),
      ('sql-avg','Calculează media cu AVG','AVG',[{'average':'7.3333333333333333'}],'AVG(price) adună prețurile și împarte suma la numărul de valori. Media poate avea mai multe zecimale.')]:
        alias='total' if fn=='SUM' else 'average'
        code=f'SELECT {fn}(price) AS {alias} FROM products;'
        l=lesson(cs['sql'],id,title,idea,code,idea+' AS dă numele coloanei din rezultat; tabelul original nu se schimbă.',q('Ce calculează '+fn+'?', 'Suma valorilor' if fn=='SUM' else 'Media valorilor','Numele tabelului','Numărul de coloane'),sql('Calculează '+('suma' if fn=='SUM' else 'media')+' prețurilor din products. Numește coloana rezultatului '+alias+'.',code,expected,BASIC_SEED))
        l['task'].update(contextCode=BASIC_SEED,expectedResult=deepcopy(expected));ls[id]=l
    reorder('sql',['sql-read-table','sql-read-all','sql-select','sql-select-columns','sql-where','sql-order','sql-limit','sql-create','sql-insert','sql-update','sql-delete','sql-count','sql-sum','sql-avg','sql-group'])
    # Storage tasks used JSON before the JSON chapter. The chapter order now fixes that.
    # Build a regular expression one piece at a time instead of starting with five operators.
    regex=ls['regex-basic'];old=deepcopy(regex)
    edit('regex-basic',title='Prima expresie regulată: caută un text',intro='O expresie regulată este un model de căutare. Începem cu text simplu între două bare: /tea/. Metoda test verifică dacă modelul apare în text și întoarce true sau false.',example='function solve(input) {\n  return /tea/.test(input);\n}',explain='/tea/ caută literele tea alăturate, oriunde în text. test primește textul de verificat. teapot conține tea; Cake nu. La acest pas nu folosim ancore, intervale sau număr de repetări.',hint='Modelul este /tea/, iar textul de verificat este input.',task=dict(prompt='Returnează true dacă input conține textul tea, cu litere mici, folosind /tea/.test(input).',solution='function solve(input) { return /tea/.test(input); }',cases=[{'input':v,'expected':e} for v,e in [('tea',True),('teapot',True),('Cake',False),('Tea',False)]],starter='function solve(input) {\n  return /tea/.test();\n}'))
    regex['quiz']={'question':'Ce întoarce /tea/.test("teapot")?','options':['true','false','Textul tea'],'correct':0,'explanation':regex['explain']}
    for id,title,idea,expression,cases,prompt in [
      ('regex-exact','Cere întregul text cu ^ și $','^ cere începutul textului; $ cere sfârșitul. Împreună, /^tea$/ acceptă numai textul tea, nu teapot.','/^tea$/',[('tea',True),('teapot',False),('a tea',False)],'Acceptă numai textul tea, folosind ancorele ^ și $.'),
      ('regex-digits','Alege o singură cifră','[0-9] acceptă o cifră între 0 și 9. Cu ancore, /^[0-9]$/ acceptă un text format din exact o cifră.','/^[0-9]$/',[('7',True),('12',False),('x',False)],'Acceptă un text format din exact o cifră de la 0 la 9.')]:
        code='function solve(input) { return '+expression+'.test(input); }'
        l=lesson(cs['js-text'],id,title,idea,code,idea,q('Ce verifică modelul?',prompt,'Modifică input','Sortează textul'),js(prompt,code,cases));ls[id]=l
    old['id']='regex-code-format';old['task']['id']=old['id'];old['title']='Combină litere, cifre și repetări';cs['js-text']['lessons'].append(old);ls[old['id']]=old
    ids=[l['id'] for l in cs['js-text']['lessons']];base=ids.index('regex-basic')
    front=ids[:base]+['regex-basic','regex-exact','regex-digits','regex-quantifiers','regex-groups','regex-code-format','regex-assertions']
    reorder('js-text',front)

    # A foreign key exercise should teach REFERENCES, not require an untaught JOIN.
    reference=ls['schema-reference'];join_example=reference['example'];join_rows=deepcopy(reference['task']['expected'])
    edit('schema-reference',example='CREATE TABLE messages (\n  user_id integer REFERENCES users(id)\n);',intro='O cheie străină leagă o valoare de un rând care există într-un alt tabel. REFERENCES users(id) cere ca user_id să indice un id existent în users.',explain='users este tabelul furnizat cu utilizatori. În noul tabel messages, coloana user_id este un număr întreg. REFERENCES users(id) adaugă legătura: nu poți folosi un id care lipsește din users. În acest pas creezi doar legătura; citirea datelor din două tabele apare în lecția JOIN.',hint='În declarația coloanei user_id, adaugă REFERENCES users(id).',task=dict(prompt='Creează messages cu o coloană user_id integer care referă users(id). Tabelul users este deja pregătit. Nu scrie o interogare JOIN.',solution='CREATE TABLE messages (user_id integer REFERENCES users(id));',expected=[{'has_reference':True}],checkQuery="SELECT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='messages'::regclass AND confrelid='users'::regclass AND contype='f') AS has_reference;"))
    join=lesson(cs['sql-queries-complete'],'sql-join','Citește date din două tabele cu JOIN','users păstrează numele utilizatorilor; visits păstrează paginile accesate și user_id. JOIN le poate citi împreună, potrivind cheia users.id cu visits.user_id.',join_example,'users.username înseamnă coloana username din users. visits.page vine din celălalt tabel. ON users.id = visits.user_id stabilește potrivirea dintre rânduri. Fiecare accesare a lui Alex apare separat, cu numele utilizatorului alături de pagină.',q('Ce condiție leagă utilizatorul de accesare?','users.id = visits.user_id','users.username = visits.page','products.price = visits.id'),sql('Afișează username și page pentru fiecare accesare. Leagă visits de users prin user_id și id, apoi sortează după visits.id.',join_example,join_rows,ls['sql-left-join']['task']['setup']))
    ls[join['id']]=join
    order=[l['id'] for l in cs['sql-queries-complete']['lessons'] if l['id']!='sql-join'];index=order.index('sql-count-user-visits')
    reorder('sql-queries-complete',order[:index]+['sql-join']+order[index:])
    # Node uses async/await later; establish promises using a value before adding fs.
    for id,title,idea,code,prompt in [
      ('node-promise-value','O promisiune pentru o valoare','Un Promise reprezintă un rezultat care poate deveni disponibil mai târziu. Promise.resolve construiește o promisiune deja îndeplinită cu valoarea dată. Nu creează automat un fir de execuție nou.','function solve(input) { return Promise.resolve(input); }','Returnează o promisiune îndeplinită cu valoarea input, folosind Promise.resolve(input).'),
      ('node-await-value','Așteaptă un rezultat cu await','O funcție async întoarce o promisiune. În interior, await așteaptă rezultatul unei promisiuni înainte de a continua acea funcție. Între timp, Node poate trata alte operații.','async function solve(input) { const value = await Promise.resolve(input); return value; }','Declară solve ca async. Așteaptă Promise.resolve(input) cu await și returnează valoarea obținută.')]:
        l=lesson(cs['node'],id,title,idea,code,idea,q('Ce reprezintă rezultatul așteptat?', 'Valoarea primită prin input','Un nume de fișier obligatoriu','Un element HTML'),js(prompt,code,[(7,7),('Hello','Hello')],mode='node'))
        ls[id]=l
    sequence=[l['id'] for l in cs['node']['lessons']]
    sequence=[id for id in sequence if id not in ('node-promise-value','node-await-value')]
    index=sequence.index('node-async-read')
    reorder('node',sequence[:index]+['node-promise-value','node-await-value']+sequence[index:])


# Explain the notation used in the current example, not every keyword in the setup.
# A learner opening a later lesson can recover the basic reading rules in place.
NOTATION=[
 ('function ',{'js','node'},'function declară o funcție: o bucată de cod pe care o poți apela. solve este numele folosit de verificarea exercițiilor.'),
 ('return ',{'js','node'},'return trimite valoarea calculată la apelant și încheie execuția curentă a funcției.'),
 ('const ',{'js','node','dom','express'},'const declară un nume pentru o valoare. Nu îl poți reasigna cu =; conținutul unui obiect poate fi totuși modificat.'),
 ('let ',{'js','node','dom'},'let declară o variabilă căreia îi poți atribui ulterior altă valoare.'),
 ('=>',{'js','node','dom','express'},'=> definește o funcție săgeată. Parametrii sunt în stânga, iar expresia sau corpul funcției în dreapta.'),
 ('input[',{'js','node'},'input[0] citește prima poziție din lista primită. Numărarea pozițiilor începe de la 0.'),
 ('input.',{'js','node'},'input.name citește proprietatea name a obiectului primit. Numele proprietăților vin din datele afișate în exercițiu.'),
 ('===',{'js','node','dom','ejs','express'},'=== compară atât valoarea, cât și tipul: numărul 10 diferă de textul "10".'),
 ('++',{'js','node','dom'},'index++ mărește index cu 1. Într-o buclă poate trece la următoarea poziție.'),
 ('+=',{'js','node','dom'},'total += value este forma scurtă pentru total = total + value.'),
 ('JSON.parse',{'js','node'},'JSON.parse citește un text JSON și construiește valoarea JavaScript descrisă de el. Textul invalid produce o eroare.'),
 ('JSON.stringify',{'js','node'},'JSON.stringify transformă o valoare JavaScript într-un text JSON, util la salvare sau transmitere.'),
 ('.map(',{'js','node'},'map parcurge un vector și construiește un vector nou cu rezultatul funcției pentru fiecare element.'),
 ('.filter(',{'js','node'},'filter construiește un vector nou păstrând elementele pentru care funcția întoarce true.'),
 ('.reduce(',{'js','node'},'reduce combină elementele într-un rezultat acumulat. Valoarea inițială stabilește punctul de pornire.'),
 ('.sort(',{'js','node'},'sort reordonează vectorul pe care este apelat. Pentru a păstra intrarea, sortează o copie; fără comparator, ordinea este textuală.'),
 ('Promise',{'node'},'O promisiune reprezintă un rezultat în așteptare, îndeplinit sau respins. Nu înseamnă automat un fir de execuție nou.'),
 ('await ',{'node'},'await așteaptă rezultatul unei promisiuni în funcția async curentă. Nu blochează întregul server până la terminarea operației.'),
 ('require(',{'node','express'},'require încarcă un modul CommonJS. Modulul poate fi inclus în Node sau instalat ca pachet.'),
 ('module.exports',{'express','node'},'module.exports stabilește valoarea pe care o primește alt modul când încarcă acest fișier. Laboratorul îl folosește pentru aplicația Express.'),
 ('querySelector',{'dom'},'querySelector primește un selector CSS și găsește primul element potrivit din pagină. Dacă nu există, întoarce null.'),
 ('addEventListener',{'dom'},'addEventListener înregistrează o funcție care va fi apelată când are loc evenimentul indicat, de exemplu click.'),
 ('textContent',{'dom'},'textContent citește sau înlocuiește textul elementului. Un text cu taguri nu este interpretat ca HTML.'),
 ('<%=',{'ejs'},'<%= expresie %> evaluează expresia și inserează valoarea ca text cu escapare HTML.'),
 ('<% ',{'ejs'},'<% instrucțiune %> execută JavaScript în template, fără să afișeze direct valoarea unei expresii.'),
 ('<%-',{'ejs'},'<%- expresie %> inserează HTML neescapat. Folosește-l numai pentru markup controlat, precum un fragment include de încredere.'),
 ('SELECT ',{'sql'},'SELECT alege informația care va apărea în rezultat. Nu modifică rândurile stocate.'),
 ('FROM ',{'sql'},'FROM indică tabelul din care citești. Numele tabelului trebuie să corespundă celui furnizat.'),
 ('WHERE ',{'sql'},'WHERE păstrează numai rândurile pentru care condiția este adevărată. În UPDATE și DELETE limitează rândurile modificate.'),
 ('ORDER BY ',{'sql'},'ORDER BY stabilește ordinea rezultatului: ASC crescător, DESC descrescător. Fără el ordinea rândurilor nu este garantată.'),
 ('::',{'sql'},':: cere o conversie de tip în PostgreSQL: ::text produce text, iar ::int un număr întreg. Nu modifică tipul coloanei originale.'),
 (' AS ',{'sql'},'AS dă un nume coloanei sau sursei din interogare. Numele este un alias în rezultat, fără să redenumească tabelul original.'),
 ('RETURNING ',{'sql'},'RETURNING afișează valorile rândurilor afectate de INSERT, UPDATE sau DELETE, în aceeași comandă.'),
 ('GROUP BY ',{'sql'},'GROUP BY formează grupuri de rânduri care au aceeași valoare, pentru calcule precum COUNT sau SUM în fiecare grup.'),
 ('JOIN ',{'sql'},'JOIN combină rânduri din două surse. Condiția ON arată cum se potrivesc valorile lor.'),
 ('PRIMARY KEY',{'sql'},'PRIMARY KEY definește cheia primară: o valoare sau o combinație de valori care identifică unic un rând și nu poate fi NULL.'),
 ('@include',{'scss'},'@include aplică declarațiile unui mixin definit cu @mixin. Argumentele înlocuiesc parametrii acelui mixin.'),
 ('@use',{'scss'},'@use încarcă un modul Sass. Membrii săi se folosesc prin spațiul de nume, precum list.length.'),
]

def explain_notation(cs):
    for c in cs.values():
        previous=None
        for l in c['lessons']:
            source=l['example'];mode=l['task']['mode']
            if mode=='sql':l['task'].update(contextCode=l['task'].get('setup',''),expectedResult=deepcopy(l['task']['expected']))
            l['notation']=[explanation for token,modes,explanation in NOTATION if mode in modes and token.lower() in source.lower()]
            l['prerequisites']=[previous] if previous else c['learning']['prerequisites'][:]
            previous=l['id']
