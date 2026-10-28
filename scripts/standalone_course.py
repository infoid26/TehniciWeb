from course_model import chapters,html,exact,attr,count

def requirements(test):
 selector='`'+test.get('selector','')+'`'
 kind=test['kind']
 if kind=='text':return f'{selector}: textul trebuie să fie `{test["value"]}`.'
 if kind=='textContains':return f'{selector}: textul include `{test["value"]}`.'
 if kind=='attr':return f'{selector}: atributul `{test["name"]}` are valoarea `{test["value"]}`.'
 if kind=='count':return f'Include cel puțin {test["min"]} elemente care corespund selectorului {selector}.'
 if kind=='absent':return f'Nu include elemente care corespund selectorului {selector}.'
 if kind in ('style','custom'):return f'{selector}: proprietatea `{test["name"]}` trebuie să aibă valoarea calculată `{test["value"]}`.'
 if kind=='columns':return f'La o lățime de {test["viewport"]}px, {selector} trebuie să aibă {test["count"]} coloane egale.'
 if kind=='cssIncludes':return f'Include în CSS construcția `{test["value"]}`.'
 if kind=='pseudo':return f'Pentru {selector}{test["pseudo"]}, `{test["name"]}` include `{test["includes"]}`.'
 if kind=='value':return f'{selector}: valoarea controlului trebuie să fie `{test["value"]}`.'
 if kind=='doctype':return 'Declară documentul HTML modern cu `<!doctype html>`.'
 return test.get('label','Respectă structura indicată.')

def adapt():
 for chapter in chapters:
  if chapter['lessons'] and chapter['lessons'][0].get('reading'):continue
  for lesson in chapter['lessons']:
   task=lesson['task'];prompt=task['prompt']
   task['requirements']=[requirements(test) for test in task.get('tests',[])]
   for test,item in zip(task.get('tests',[]),task['requirements']):test['label']=item.replace('`','')
   if any(phrase in prompt.lower() for phrase in ['din exemplu','exemplul afișat','formula afișată','structura din exemplu','exact ca în exemplu']):
    task['prompt']={
     'html':'Construiește un fragment HTML care respectă cerințele de mai jos.',
     'css':'Stilizează HTML-ul furnizat pentru a obține aspectul descris mai jos.',
     'scss':'Scrie SCSS pentru HTML-ul furnizat și obține stilurile descrise mai jos. Compilarea în CSS este făcută automat.',
     'dom':'Scrie JavaScript care modifică HTML-ul furnizat conform cerințelor de mai jos.',
     'ejs':'Construiește un template EJS care folosește datele furnizate și produce elementele descrise mai jos.',
     'sql':'Scrie SQL pentru baza de antrenament descrisă mai jos. Obține rezultatul cerut fără să folosești o bază de date proprie.',
     'express':'Construiește rutele care răspund cererilor de mai jos. Exportă aplicația cu `module.exports = app`; nu apela `app.listen`.',
    }.get(task['mode'],prompt)
   if task['mode']=='sql':
    task['contextCode']=task.get('setup','')
    task['contextLabel']='Baza de date de la care pornești'
    task['expectedResult']=task['expected']
   if task['mode']=='ejs':
    task['inputData']=task.get('data',{})
   if task['mode']=='text' and any(s in prompt.lower() for s in ['din exemplu','afișat','afișării']):
    task['contextCode']=lesson['example'];task['contextLabel']='Datele exercițiului'
  # Source citations remain available, but the chapter introduces a transferable skill.
  chapter['subtitle']=chapter['subtitle'].replace('folosite în filtre, sortare și coș','utile pentru filtre, sortare și coș')
 lessons={l['id']:l for c in chapters for l in c['lessons']}
 # Keep the final-project media examples aligned with our own published assets.
 video=lessons['project-video']
 for field in ['intro','example','explain','hint']:
  video[field]=video[field].replace('bakery.mp4','bakery.webm').replace('video/mp4','video/webm')
 for field in ['prompt','solution','starter']:
  video['task'][field]=video['task'][field].replace('bakery.mp4','bakery.webm').replace('video/mp4','video/webm')
 for test in video['task']['tests']:
  if test.get('value')=='video/mp4':test['value']='video/webm'
  test['label']=test['label'].replace('video/mp4','video/webm')
 video['task']['requirements']=[item.replace('video/mp4','video/webm') for item in video['task']['requirements']]
 video['task']['revision']=2
 picture=lessons['project-picture']
 for field in ['example']:
  picture[field]=picture[field].replace('cake-small.webp','cake-300.webp').replace('cake.webp','cake-600.webp')
 picture['task']['solution']=picture['task']['solution'].replace('cake-small.webp','cake-300.webp').replace('cake.webp','cake-600.webp')
 folder=lessons['start-folder']
 folder.update(intro='O cale relativă spune browserului unde găsește o resursă pornind de la fișierul paginii. Numele folderelor sunt alegeri ale autorului site-ului, nu nume obligatorii de memorat.',example='my-website/\n  index.html\n  images/\n    logo.svg\n\n<!-- Inside index.html -->\n<img src="images/logo.svg" alt="Site logo">',explain='Pagina index.html și folderul images sunt în același director. De aceea src începe cu images/. Pentru o altă organizare a folderelor, se schimbă și calea.',hint='Pornește din folderul lui index.html, intră în images și indică fișierul logo.svg. Atributul src conține calea relativă, iar alt descrie imaginea.')
 folder['task']=html('În site-ul imaginar de mai jos, adaugă în index.html o imagine pentru logo. Folosește calea relativă corectă și textul alternativ `Site logo`. Nu trebuie să ai aceste fișiere pe calculator; exersăm scrierea tagului.', '<img src="images/logo.svg" alt="Site logo">',[attr('img','src','images/logo.svg'),attr('img','alt','Site logo')])
 folder['task'].update(id='start-folder',revision=2,contextLabel='Structura site-ului pentru acest exercițiu',contextCode='my-website/\n  index.html  ← pagina în care scrii tagul\n  images/\n    logo.svg',requirements=['Folosește un element `img`.','În `src`, scrie calea relativă de la `index.html` la `logo.svg`.','Textul alternativ trebuie să fie `Site logo`.'])
 lessons['start-file']['task']['prompt']='O pagină de intrare într-un site este numită, prin convenție, `index.html`. Scrie acest nume, cu extensia corectă. Convenția nu înseamnă că orice pagină HTML trebuie să aibă acest nume.'
 lessons['start-request']['task'].update(prompt='În cererea HTTP de mai jos, identifică resursa solicitată. Scrie numai calea, fără metoda GET sau versiunea HTTP.',contextCode='GET /products HTTP/1.1',contextLabel='Cererea HTTP')
 lessons['start-url']['task'].update(prompt='Identifică domeniul din URL-ul de mai jos. Scrie doar domeniul, fără protocol, cale, query sau fragment.',contextCode='https://example.com/products?type=cake#offers',contextLabel='Adresa analizată')
 lessons['express-static']['task'].update(prompt='Un server publică folderul `public` la prefixul URL `/assets`, folosind configurația de mai jos. Ce fișier local răspunde la cererea `/assets/images/cake.svg`? Scrie calea relativă din proiect.',contextCode='app.use("/assets", express.static("public"));\n\nGET /assets/images/cake.svg',contextLabel='Configurația și cererea de analizat')
 wildcard=lessons['express-wildcard']
 wildcard['task'].update(prompt='În Express 5, wildcard-ul trebuie să aibă un nume. Scrie expresia de rută care folosește numele `page` și cuprinde inclusiv adresa rădăcină `/`.',solution='/{*page}',revision=2,contextCode='app.get("/{*page}", (req, res) => {\n  res.status(404).send("Not found");\n});',contextLabel='Forma wildcard-ului în Express 5')
 wildcard['hint']='Acoladele fac opțională partea wildcard; numele este precedat de *. Exemplu de structură: /{*name}.'
 # The final project is our independent training website, not a file-memory test.
 for l in lessons.values():
  if l.get('reading'):continue
  for field in ['intro','explain','hint']:
   l[field]=l[field].replace('În proiectul profesoarei','Într-un site de prezentare și produse').replace('Proiectul profesoarei','Un site de prezentare și produse').replace('exemplul profesoarei','site-ul pe care îl construim').replace('din materialele profesoarei','pe care îl construim pas cu pas')
 for name in ['html-headings','html-header-footer','html-nav','html-main-section','html-article-aside','html-paragraphs','html-pre-code','html-lists','html-nested-lists','html-emphasis','html-inline-semantics','html-time','html-links','html-text-details']:
  l=lessons[name];l['task']['prompt']='Construiește structura HTML descrisă în cerințele de mai jos. Alege tagurile potrivite pentru rolul fiecărui element.'
 # Explain the technology directly rather than referring to course administration.
 lessons['scss-bootstrap']['intro']=lessons['scss-bootstrap']['explain']='Bootstrap oferă componente stilizate și variabile Sass configurabile. Setează culorile și dimensiunile dorite înainte de compilarea componentelor, apoi încarcă CSS-ul rezultat în pagină.'
 lessons['express-wildcard']['intro']='În Express 5, wildcard-ul unei rute trebuie numit. Forma `/{*page}` acceptă atât adresa rădăcină `/`, cât și căile cu mai multe segmente. Pentru un fallback simplu poți folosi și `app.use` după rutele concrete.'
 lessons['math-display']['intro']='MathML afișează formule în interiorul textului sau într-un bloc separat. MathJax este o bibliotecă pentru randarea formulelor în mai multe formate; formulele simple pot folosi direct suportul MathML al browserului.'
 for l in lessons.values():
  if l.get('reading'):continue
  if l['id'].startswith('css-detail-'):
   l['explain']=l['intro']+' În regula CSS, selectorul alege elementul, iar perechea proprietate: valoare îi stabilește aspectul.'
  if l['id'].startswith('math-detail-'):
   l['explain']=l['intro']+' Elementul `math` încadrează formula. Ordinea elementelor din interior stabilește rolul lor în expresie.'
   if l['task'].get('note'):l['task']['note']='Unele extensii MathML istorice nu sunt randate nativ în toate browserele. Verificarea urmărește structura formulei.'
  if l['id']=='start-three':l['explain']='HTML, CSS și JavaScript se scriu în fișiere separate și se leagă din pagina HTML. Nu pune declarații CSS în corpul unui fișier JavaScript.'
  if l['id']=='js-default-rest':l['explain']='Rest strânge argumentele la definirea funcției; spread desface o colecție la apel. `reduce` combină valorile unei colecții într-un singur rezultat.'
  l['quiz']['explanation']=l['explain']
  if 'profesoarei' in l['task']['prompt'] or 'materialele' in l['task']['prompt']:raise ValueError('Task still depends on external teaching material: '+l['id'])
 for c in chapters:
  if c['id']=='project':c['subtitle']='Construiește propriul site de prezentare și produse: pagini, galerie, filtre, coș și server.'
