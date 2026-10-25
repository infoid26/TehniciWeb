
"""Keep the course independent from the separately hosted reference application."""
from pathlib import Path
import json
import re

def generalize(chapters):
    replacements=[
        ('Cofetaria <span>Dulcelind','Demo <span>Catalog'),
        ('Cofetăria Dulcelind','Demo Catalog'),('Cofetaria Dulcelind','Demo Catalog'),
        ('Sweet Corner','Demo Catalog'),('Dulcelind','Demo Catalog'),('dulcelind','demo'),
        ('/project','/demo'),('categ_prajitura','product_category'),('tipuri_produse','product_type'),
        ('tip_produs','product_type'),('prajituri','products'),('produse','products'),('produs','product'),
        ('optiuni','options'),('semn','sign'),('pretMin','minPrice'),('calorii','stock'),('Calorii','Stock'),('caloric','stock'),
        ('ingrediente','tags'),('gramaj','weight'),('categorie','category'),('pret','price'),('nume','name'),
        ('cofetarie','books'),('patiserie','stationery'),('gelaterie','accessories'),
        ('Savarină','Notebook'),('Savarina','Notebook'),('Amandina','Pen'),('Nimic','Sticker'),
        ('comuna','standard'),('dietetica','limited'),('toate','all'),('faina','featured'),
        ('cos_virtual','cart_ids'),('schimba_tema','theme-toggle'),('acceptat_banner','banner_accepted'),
        ('briose-frisca','sample-image'),('macarons','sample'),('Chocolate','sample'),
    ]
    prose_keys={'title','subtitle','intro','explain','hint','prompt','question','explanation','points','label','requirements','contextLabel'}
    code_keys={'example','solution','starter','fixture','setup','checkQuery','contextCode','files','partials','data','inputData','expected','expectedResult','cases','tests','requests'}
    words=[('prajituri','products'),('categ_prajitura','product_category'),('tipuri_produse','product_type'),('tip_produs','product_type'),('cofetarie','books'),('patiserie','stationery'),('gelaterie','accessories'),('Savarină','Notebook'),('Savarina','Notebook'),('Amandina','Pen'),('Nimic','Sticker'),('cos_virtual','cart_ids'),('acceptat_banner','banner_accepted'),('schimba_tema','theme-toggle'),('inp-nume','inp-name'),('inp-pret','inp-price'),('val-nume','val-name'),('val-pret','val-price')]
    text_replacements=[('Cofetaria <span>Dulcelind','Demo <span>Catalog'),('Cofetăria Dulcelind','Demo Catalog'),('Cofetaria Dulcelind','Demo Catalog'),('Sweet Corner','Demo Catalog'),('Dulcelind','catalogul demonstrativ'),('dulcelind','demo'),('/project','/demo')]+words
    code_replacements=[('Cerere gresita','Invalid request'),('Produs inexistent','Product not found'),('Pagina inexistenta','Page not found'),('Eroare server','Server error'),('Bine ati venit','Welcome'),('Acasa','Home'),('Nume','Name'),('Pret','Price'),('Filtreaza','Filter'),('Contact','Contact'),('Produse','Products'),('lang="ro"','lang="en"'),('srclang="ro"','srclang="en"'),('label="romana"','label="English"'),('lei','USD'),('Retete','Tutorials'),('Promotii','Offers'),('Anunturi','News'),('Orar','Opening hours'),('Meniu','Menu'),('Intrebari frecvente','FAQ'),('Livrati la domiciliu?','Do you deliver?'),('Unde gasesc ingredientele?','Where can I find details?'),('Pe pagina produsului.','On the product page.'),('Da, prin curier.','Yes, by courier.'),('Briose cu frisca','Example image'),('Program','Opening hours'),('Luni','Monday'),('Marti','Tuesday'),('Interval','Hours'),('Zi','Day'),('Meniu','Menu'),('Reteta','Recipe'),('Retete video','Video tutorials'),('Prajitura insiropata','Example product'),('Tema','Theme'),('Cofetarie','Books'),('Patiserie','Stationery'),('Gelaterie','Accessories')]
    def transform(v,key='',code=False):
        if key=='id':return v
        if key in prose_keys:code=False
        elif key in code_keys:code=True
        if isinstance(v,str):
            for a,b in text_replacements:v=v.replace(a,b)
            if code:
                for a,b in replacements:
                    v=re.sub(r'\bnume\b',b,v) if a=='nume' else v.replace(a,b)
                for a,b in code_replacements:v=v.replace(a,b)
                v=re.sub(r'\bprod\b','product',v)
                v=re.sub(r'\btip\b','type',v)
                v=re.sub(r'\btabel\b','table_name',v)
                v=v.replace('Demo <span>catalogul demonstrativ','Demo <span>Catalog')
            return v
        if isinstance(v,list):return [transform(x,key,code) for x in v]
        if isinstance(v,dict):
            return {transform(k,'',True) if k not in ('id',) else k:transform(x,k,code) for k,x in v.items()}
        return v
    def brand_only(v):
        if isinstance(v,str):return v.replace('Cofetăria Dulcelind','Demo Catalog').replace('Cofetaria Dulcelind','Demo Catalog').replace('Sweet Corner','Demo Catalog')
        if isinstance(v,list):return [brand_only(x) for x in v]
        if isinstance(v,dict):return {k:brand_only(x) for k,x in v.items()}
        return v
    for c in chapters:
        c.update(transform(c) if c['id'] in ('project','dulcelind-setup','dulcelind-azure') else brand_only(c))
    byid={l['id']:l for c in chapters for l in c['lessons']}
    def edit(id,intro=None,example=None,explain=None,prompt=None,solution=None):
        l=byid[id]
        for k,v in [('intro',intro),('example',example),('explain',explain)]:
            if v is not None:l[k]=v
        if prompt is not None:l['task']['prompt']=prompt
        if solution is not None:l['task']['solution']=solution
        if l['task']['mode']=='text':
            l['task']['contextCode']=l['example']
        l['hint']=l['explain'];l['quiz']['explanation']=l['explain']
    edit('dulc-dependencies',explain='Păstrează package.json și package-lock.json în propriul Git. node_modules se regenerează. Nu trebuie să descarci repository-ul acestei platforme.')
    edit('dulc-start-script',example='{"scripts":{"start":"node app.js","build:assets":"node build-assets.mjs","setup:db":"node setup-db.cjs"}}',
        explain='În proiectul tău npm start rulează app.js. Celelalte două scripturi sunt definite aici și vor avea fișierele construite în lecțiile despre build și inițializarea bazei. Nu rula o comandă până nu creezi fișierul ei.')
    edit('dulc-pg-identity',explain='Verifică rezultatul și conexiunea selectată. Folosește baza ta de antrenament și o schemă demo. Nu ai nevoie de baza de date a platformei.')
    edit('dulc-static-mount',explain='Browserul cere /demo/resurse/css/general.css. Prefixează linkurile în propriile șabloane cu /demo. Resursele se publică de pe discul tău. Nu ai nevoie de codul serverului acestei platforme.')
    assets='''// Create build-assets.mjs in your project root.
import fs from "node:fs/promises";
import path from "node:path";
import * as sass from "sass";
import sharp from "sharp";
await fs.mkdir("resurse/css",{recursive:true});
await fs.mkdir("resurse/imagini/mediu",{recursive:true});
for(const name of await fs.readdir("resurse/scss")){
  if(name.endsWith(".scss")){
    const result=sass.compile(path.join("resurse/scss",name));
    await fs.writeFile(path.join("resurse/css",name.replace(/\\.scss$/,".css")),result.css);
  }
}
await sharp("resurse/imagini/sample.png").resize(300).webp()
  .toFile("resurse/imagini/mediu/sample.webp");
// Terminal: npm run build:assets'''
    edit('project-assets',intro='Build-ul transformă sursele SCSS și imaginile în fișiere publicate de server.',example=assets,
        explain='Creează resurse/scss/theme.scss cu body { color: navy; } și salvează o imagine PNG proprie ca resurse/imagini/sample.png. Creează build-assets.mjs cu exemplul complet. Scriptul build:assets a fost definit în package.json la pregătire. Rulează-l și verifică resurse/css/theme.css și resurse/imagini/mediu/sample.webp.',
        prompt='Ce comandă definită în package.json pregătește resursele proiectului tău?',solution='npm run build:assets')
    pool='''// Create db.cjs.
const {Pool}=require("pg");
const production=process.env.NODE_ENV==="production";
const common={connectionTimeoutMillis:5000,options:"-c search_path=demo"};
const config=process.env.PROJECT_DATABASE_URL
 ? {connectionString:process.env.PROJECT_DATABASE_URL}
 : {host:process.env.AZURE_POSTGRESQL_HOST,
    port:Number(process.env.AZURE_POSTGRESQL_PORT||5432),
    user:process.env.AZURE_POSTGRESQL_USER,
    password:process.env.AZURE_POSTGRESQL_PASSWORD,
    database:process.env.AZURE_POSTGRESQL_DATABASE};
const pool=new Pool({...common,...config,
  ...(production?{ssl:{rejectUnauthorized:true}}:{})});
module.exports=pool;'''
    edit('dulc-pool',example=pool,explain='Salvează db.cjs și importă-l în app.js cu const pool=require("./db.cjs"). Local folosești PROJECT_DATABASE_URL din pregătire; pentru Azure setezi câmpurile separate și NODE_ENV=production. Nu închide Pool după fiecare request. Exemplul local presupune un server de antrenament fără TLS.')
    edit('dulc-seed',explain='Baza temporară a exercițiului este furnizată integral în zona de date. Pentru lucru pe calculator, creează data/catalog.sql și copiază acolo SQL-ul de inițializare afișat, nu doar SELECT-ul soluției. Rulează-l în baza ta goală din Query Tool. Nu ai nevoie de fișierele aplicației separate.')
    setup='''// Create setup-db.cjs.
const fs=require("node:fs/promises");
const pool=require("./db.cjs");
async function main(){
 const client=await pool.connect();
 try{
  await client.query("BEGIN");
  await client.query("CREATE SCHEMA IF NOT EXISTS demo");
  await client.query("SET LOCAL search_path TO demo");
  const result=await client.query("SELECT to_regclass('demo.products') AS table_name");
  if(!result.rows[0].table_name){
   await client.query(await fs.readFile("data/catalog.sql","utf8"));
  }
  await client.query("COMMIT");
 }catch(error){await client.query("ROLLBACK");throw error;}
 finally{client.release();await pool.end();}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
// Terminal: npm run setup:db'''
    edit('dulc-permissions',example=setup,explain='Creează setup-db.cjs după ce ai db.cjs și data/catalog.sql din lecțiile anterioare. Scriptul setup:db este deja definit în package.json. Inițializarea importă date numai dacă tabelul lipsește; schema și drepturile nu sunt același lucru.',
        prompt='Ce comandă definită în proiectul tău inițializează baza?',solution='npm run setup:db')
    edit('dulc-azure-existing',intro='Pentru publicare folosește resursele Azure proprii sau cele alocate explicit ție.',
        explain='Dacă ai deja un server PostgreSQL, poți utiliza o schemă demo în propria bază. Altfel creează PostgreSQL Flexible Server și App Service Linux pentru Node.js, după verificarea costului. Nu folosi baza platformei de curs. Configurează pe App Service valorile proprii pentru câmpurile enumerate.')
    edit('dulc-azure-env',explain='Valorile aparțin aplicației tale. Salvarea poate reporni App Service. Nu publica parola în surse, capturi sau browser. NODE_ENV=production activează TLS în db.cjs. Nu este necesar accesul la configurația acestei platforme.')
    edit('dulc-azure-port',explain='Aplică acest app.listen în propriul app.js. Local NODE_ENV poate lipsi; în App Service setează production. Pentru routerul montat sub /demo pornești numai aplicația părinte. Nu ai nevoie de runtimeSettings sau de scripturile platformei.')
    edit('dulc-lazy',intro='Încarcă datele unui fișier numai când sunt cerute și reutilizează rezultatul.',
        example='// Create data/catalog.json containing [{"id":1,"name":"Notebook"}].\nconst fs=require("node:fs/promises");\nlet catalogPromise;\nfunction readCatalog(){return catalogPromise??=fs.readFile("data/catalog.json","utf8").then(JSON.parse);}',
        explain='Acest exemplu de cache este independent de PostgreSQL. Promisiunea evită citirile repetate; fișierul necesar este descris chiar în exemplu. Cache-ul trebuie invalidat dacă vrei să reîncarci date schimbate.',
        prompt='Ce fișier propriu este citit de exemplu?',solution='data/catalog.json')
    edit('dulc-pipeline',example='git status\ngit diff --check\n// Review and commit your files.\n// Your build command: npm run build:assets',
        explain='În repository-ul tău configurezi separat GitHub Actions și destinația de publicare. Un push nu publică automat fără workflow configurat. Instalează dependențele în runner Linux pentru App Service Linux; nu urca node_modules de Windows.')
    edit('dulc-health',example='app.get("/health",async(req,res,next)=>{try{const result=await pool.query("SELECT count(*)::int AS products FROM products");res.json({ready:true,database:"PostgreSQL",...result.rows[0]});}catch(error){next(error);}});',
        explain='Adaugă ruta în propriul app.js înainte de fallback. Cu montarea /demo o verifici la /demo/health. Nu afișa parola sau URL-ul de conectare. Un workflow verde nu confirmă că baza funcționează.')
    edit('dulc-live-debug',explain='Deschide logurile propriei aplicații și reproduce cererea. /demo/health este ruta pe care ai construit-o, nu un serviciu al platformei. Verifică separat serverul, rețeaua, autentificarea și schema.')
    edit('dulc-live-parity',intro='Verifică propriul site la mai multe lățimi și cu date cunoscute.',
        explain='Folosește testele de rutare, filtrare, sortare, stocare și SQL pentru a confirma comportamentul cerut. Exemplele cursului nu trebuie să reproducă aspectul unei aplicații anume. Site-ul separat este doar o demonstrație pe care o poți inspecta.',
        prompt='Este suficient HTTP 200 ca să confirmi toate funcțiile? Scrie yes sau no.',solution='no')
    for c in chapters:
        if c['id']=='dulcelind-setup':c.update(title='Mediul de lucru · propriul proiect',subtitle='Instalează uneltele și deosebește exercițiile din browser de pașii opționali pe calculator.')
        if c['id']=='project':c.update(title='Aplică noțiunile împreună',subtitle='Exemple independente de pagini, navigare, cataloage și interacțiuni. Nu ai nevoie de fișierele unui proiect extern.')
        if c['id']=='dulcelind-azure':c.update(title='PostgreSQL și publicare',subtitle='Construiește o bază de antrenament și publică propria aplicație Node.js.')
    for l in byid.values():
        if l['task']['mode']=='sql':
            l['task']['setup']=l['task']['setup'].replace('CREATE SCHEMA demo;','CREATE SCHEMA IF NOT EXISTS demo;')
            l['task']['contextCode']=l['task']['setup']
        # Distinguish terminal steps from browser checks on every setup/deployment lesson.
        if l['id'].startswith('dulc-') or l['id'].startswith('project-'):
            l['points']=['Exercițiul de mai jos se verifică în spațiul de lucru din browser.','Comenzile marcate Terminal sunt pași opționali pentru proiectul tău; editorul cursului nu le execută.']

    edit('dulc-gallery-json',intro='O galerie poate fi descrisă prin JSON cu file, description și months.',example='// data/gallery.json: [{"file":"sample.png","description":"Example image","months":[6,7,8]}]\nconst gallery=JSON.parse(await fs.readFile("data/gallery.json","utf8"));\nconst month=new Date().getMonth()+1;\nconst images=gallery.filter(image=>image.months.includes(month));',explain='Creează data/gallery.json cu lista din exemplu. months folosește valori 1–12, iar getMonth întoarce 0–11. Citește fișierul pe server și transmite images către EJS. În template afișezi description și file.',prompt='Ce expresie întoarce luna curentă ca număr de la 1 la 12?',solution='new Date().getMonth()+1')

    byid['project-filter']['task']['cases'][0]['input']['name']=' no '
    edit('project-filter',intro='Exemplul de catalog filtrează după prefixul numelui, stoc, preț minim și categorie.',explain='Folosește startsWith pentru prefix. Combină condițiile cu &&. Intervalul de stoc include limita inferioară și exclude limita superioară: 350 intră în 350–700, nu în 0–350. Acest exemplu este independent de orice aplicație externă.')
    edit('project-sort',intro='sign=1 sortează crescător, sign=-1 descrescător după preț și apoi nume.',explain='Copiază vectorul înainte de sortare. Convertește price cu Number și folosește name ca al doilea criteriu. Pentru carduri DOM, appendChild mută elementele în ordinea calculată.')
    edit('dulc-live-debug',prompt='Ce endpoint ai definit pentru verificarea bazei aplicației tale?',solution='/demo/health')
    edit('project-checklist',intro='Verifică exemplele și funcțiile pe care le-ai construit în propriul proiect.',example='GET /demo/ → 200\nGET /demo/products → catalogue\nGET /demo/product/1 → Notebook\nGET /demo/product/abc → 400\nGET /demo/product/999 → 404\nGET /demo/health → PostgreSQL',explain='Folosește datele de antrenament ale lecțiilor, apoi verifică navigarea, filtrele, sortarea, stocarea și cererile SQL. Aplicația separată de la /project/ este doar o demonstrație; nu ai nevoie de fișierele ei pentru exerciții.',prompt='Ce status HTTP aștepți pentru o resursă inexistentă?',solution='404')
    edit('dulc-assembly',intro='Combină tehnicile în propriul site, folosind fișiere create de tine.',explain='Lecțiile oferă exemple de componente. Pentru lucru local le salvezi în propriile fișiere și adaptezi aspectul și conținutul. Nu trebuie să descarci un proiect extern și nu urmărești reproducerea unei cofetării. Creează explicit un backend numai pentru funcțiile de care ai nevoie.')

    for l in byid.values():
        for test in l['task'].get('tests',[]):
            if test.get('name') in ('lang','srclang') and test.get('value')=='ro':test['value']='en'
    edit('dulc-user-tables',example="CREATE TYPE user_role AS ENUM ('admin','moderator','member');\nCREATE TABLE users(id serial PRIMARY KEY,username varchar(50) UNIQUE NOT NULL);\nCREATE TABLE visits(id serial PRIMARY KEY,user_id int REFERENCES users(id),page varchar(500));",intro='Un tabel users poate avea username unic, iar visits îl poate referi prin user_id.',explain='Acesta este un exemplu minimal de relație între tabele, nu un sistem de autentificare. Definirea unei coloane nu implementează hash-ul parolei, înregistrarea sau conectarea.',prompt='Ce tabel are cheia străină user_id?',solution='visits')

    edit('project-shell',intro='Documentul exemplului folosește lang="en" și texte în engleză. Explicațiile lecției rămân în română.',explain='Separă antetul, meniul, conținutul și subsolul. În exercițiu scrii codul și textele în engleză, exact ca în celelalte exemple ale cursului.')
    totals=byid['dulc-types-count']['task']
    totals['expected'].sort(key=lambda row:row['type'])
    totals['expectedResult']=totals['expected']
    for l in byid.values():
        if not (l['id'].startswith('dulc-') or l['id'].startswith('project-')):continue
        for t in l['task'].get('tests',[]):
            selector=t.get('selector','')
            if t['kind']=='attr':t['label']=f"{selector}: atributul {t['name']} trebuie să fie {t['value']}."
            elif t['kind']=='text':t['label']=f"{selector}: textul trebuie să fie {t['value']}."
            elif t['kind']=='count':t['label']=f"Există cel puțin {t['min']} elemente {selector}."
            elif t['kind']=='style':t['label']=f"{selector}: {t['name']} este {t['value']}."
            elif t['kind']=='columns':t['label']=f"La {t['viewport']}px, {selector} are {t['count']} coloane."
        if l['task'].get('tests'):l['task']['requirements']=[t['label'] for t in l['task']['tests']]

    edit('dulc-css-order',intro='Ordinea fișierelor CSS și media query influențează aspectul.',example='<link rel="stylesheet" href="/demo/public/css/theme.css">\n<link rel="stylesheet" href="/demo/public/css/layout.css">\n<link rel="stylesheet" href="/demo/public/css/mobile.css" media="(max-width:700px)">',explain='Acestea sunt fișierele tale: theme.css pentru culori, layout.css pentru poziționare și mobile.css pentru ajustări pe ecrane mici. Creează-le în public/css cu regulile exersate în capitolele CSS. Nu trebuie să existe fișierele unui site extern.',prompt='Ce extensie are stylesheet-ul cerut de browser?',solution='.css')
    edit('dulc-assembly',example='app.js: server and routes\ndb.cjs: PostgreSQL Pool\nsetup-db.cjs: database initialization\nbuild-assets.mjs: SCSS and image build\ndata/catalog.sql: training schema and rows\nviews/partials: head, header, footer\nviews/pages: index, products, product, error\npublic/css: theme, layout, mobile\npublic/js: filters, sorting, storage\npublic/images: your own images')
    file_words=[('views/pagini','views/pages'),('views/fragmente','views/partials'),('../fragmente','../partials'),('pagini/','pages/'),('resurse/','public/'),('/resurse','/public'),('imagini/','images/'),('/imagini','/images'),('subtitrari.vtt','captions.vtt'),('galerie.json','gallery.json')]
    def paths(v,key=''):
        if key=='id':return v
        if isinstance(v,str):
            for a,b in file_words:v=v.replace(a,b)
            return v
        if isinstance(v,list):return [paths(x) for x in v]
        if isinstance(v,dict):return {k:paths(x,k) for k,x in v.items()}
        return v
    for c in chapters:
        if c['id'] in ('project','dulcelind-setup','dulcelind-azure'):c.update(paths(c))

    byid={l['id']:l for c in chapters for l in c['lessons']}
    byid['project-table']['title']='Un tabel cu programul de lucru'
    byid['project-filter']['title']='Combină filtrele unui catalog'
    byid['dulc-enum']['title']='Tipuri definite cu ENUM'
    edit('project-grid',intro='În acest exemplu catalogul are două coloane, cu un spațiu de 1rem între carduri.')
    edit('project-ejs',intro='Serverul transmite products. Fiecare product are name, price, stock și category.')
    edit('dulc-product-page',explain='Pagina primește un singur product. Pentru tags null folosește o listă goală. Calea imaginii are prefixul /demo, iar valorile afișate sunt escapate. Alege câmpurile necesare propriului catalog.')
    edit('dulc-controls',explain='La click citești valorile și aplici condițiile din exercițiul despre filtre. input.value este text: convertește prețurile și limitele stocului înainte de comparații. Opțiunile categoriei pot veni din ENUM prin EJS.')
    edit('dulc-filter-dom',explain='Începe cu numele și apoi adaugă stocul, prețul și categoria. Filtrarea în browser schimbă doar afișarea cardurilor, nu rândurile din PostgreSQL.')
    edit('dulc-reset',intro='O resetare parțială golește numele, selectează întregul interval de stoc și reafișează cardurile.',explain='Fragmentul nu resetează sliderul și categoria. Pentru resetare completă adaugă explicit valorile inițiale pentru toate controalele și indicatorii lor. Aceste două comportamente trebuie testate separat.')
    edit('dulc-cookies',explain='La load citești document.cookie și separi perechile prin ;. Dacă există banner_accepted, ascunzi bannerul. Butonul ok_cookies confirmă alegerea; în acest exemplu cookie-ul expiră după un minut. localStorage nu are aceeași expirare automată.')
    edit('dulc-table',intro='Începe cu id serial, name unic, price numeric(8,2), weight și stock nenegative.',explain='Coloanele și constrângerile sunt ale catalogului tău de antrenament. Exercițiul verifică inserarea și citirea unui rând. Alte exemple adaugă product_type, category și tags.')
    edit('dulc-types-count',intro='Datele de antrenament includ 9 rânduri books, 7 stationery și 5 accessories.',explain='GROUP BY numără rândurile fiecărui tip, iar ORDER BY type sortează rezultatul alfabetic. Acestea sunt categoriile datelor furnizate în exercițiu.')
    edit('dulc-type-query',explain='Filtrul SQL se aplică înainte de randarea EJS. Filtrele din browser lucrează apoi cu cardurile primite. Valoarea type se transmite ca parametru separat și se validează față de lista allowed.')
