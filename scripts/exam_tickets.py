"""Fixed practical tickets, separate from the interactive lesson bank."""
from copy import deepcopy
from pathlib import Path
import json
from itertools import combinations
from course_model import css, dom, express, prop, exact


def build_tickets(server_objectives):
    source = {x['id']: x for x in server_objectives}
    exercises, tickets = [], []
    def objective(key, title, category, task):
        item = dict(id=key, title=title, category=category, level='Bilet practic', task=task,
                    hint='Verifică fiecare cerință, inclusiv cazurile în care efectul nu trebuie să apară.',
                    steps=['Identifică datele și elementele furnizate.', 'Aplică modificarea cerută.', 'Verifică rezultatul și un caz opus.'],
                    rubric=['Respectă toate cerințele enunțului.', 'Păstrează funcționalitățile existente.'])
        task['id'] = key
        exercises.append(item)
        return key
    def ticket(category, number, title, ids, bonus=None):
        item = dict(id=f'{category}-{number:02}', category=category, number=number,
                    title=title, ids=ids, minutes=20 if category=='server' else 15)
        if bonus: item['bonusIds'] = [bonus]
        tickets.append(item)
    page = Path('project-reference/views/pagini/index.ejs').read_text(encoding='utf8')
    start = page.index('<section id="orar">')
    timetable = page[start:page.index('</section>', start)+10]
    # The original rowspan structure is retained; nth-child indexes differ per row.
    base_style = '<style>body{font:16px Arial;padding:16px;color:#e6e9f2;background:#10141f;color-scheme:dark}a{color:#b8adff}input,button,fieldset{color:inherit;background:#1b2232;border:1px solid #566079;border-radius:6px}button{padding:8px 14px}fieldset{margin:12px 0}label{margin-right:12px}#menu{padding:12px;background:#1b2232;border:1px solid #566079;border-radius:8px;margin-bottom:16px}#menu a{margin:0 8px}table{border-collapse:collapse}td,th{border:1px solid #566079;padding:8px}#words{display:flex;gap:8px}#words p{background:#456;color:white;padding:12px}#topics{list-style:none;padding:0}#topics li{padding:6px}.product{padding:12px;border:1px solid #566079}#products{display:grid;gap:12px}</style>'
    common = base_style+'<nav id="menu" aria-label="Meniul paginii"><strong>Meniu:</strong> <a href="#orar">Orar</a><a href="#products">Produse</a></nav><h1><span id="welcome">Bine ați venit</span></h1>'+timetable+'''
<p>Vă mulțumim că ne vizitați site-ul!</p><div id="words"><p>Plăcere</p><p>Bunătate</p><p>Prospețime</p><p>Pasiune</p><p>Sinceritate</p></div>
<ol id="topics"><li>Ciocolată</li><li>Frișcă</li><li>Fructe</li><li>Dulceață</li><li>Înghețată</li><li>Regrete</li></ol>

<div id="products"><article class="product"><h2>Tort</h2><p class="price">80 lei</p></article><article class="product"><h2>Tartă</h2><p class="price">20 lei</p></article><article class="product"><h2>Ecler</h2><p class="price">12 lei</p></article></div>
<a id="back" href="#welcome">Sus</a><div id="video"><nav><a href="#">Video 1</a><a href="#">Video 2</a></nav><iframe title="Video" src="about:blank"></iframe></div>'''
    def style_task(key, title, prompt, solution, tests, **extra):
        return objective('ticket-css-'+key, title, 'css', css(prompt, solution, common, tests, **extra))
    hover = style_task('welcome','Text mărit gradual','În pagina furnizată, la hover pe „Bine ați venit”, textul se mărește gradual de două ori în 1 secundă. La ieșire revine gradual. Nu modifica HTML-ul.',
        '#welcome{display:inline-block;transition:transform 1s}#welcome:hover{transform:scale(2)}',
        [prop('#welcome','transition-duration','1s'),dict(kind='cssIncludes',value='scale(2)',label='Mărire de două ori'),dict(kind='cssIncludes',value='#welcome:hover',label='Efect pe text, la hover')])
    columns = style_task('columns','Lista de torturi pe două coloane','Așază lista #topics pe două coloane: primele trei elemente în stânga, următoarele trei în dreapta. Adaugă prin CSS numărul între paranteze după fiecare element. Fără tabele și fără numere scrise în HTML.',
        '#topics{display:grid;grid-template-rows:repeat(3,auto);grid-auto-flow:column;counter-reset:item}#topics li{counter-increment:item}#topics li::after{content:" (" counter(item) ")"}',
        [prop('#topics','grid-auto-flow','column'),dict(kind='pseudo',selector='#topics li',pseudo='::after',name='content',includes='counter',label='Numerotare CSS')])
    selectors = '#tab-orar tbody tr:first-child td:nth-child(3):hover ~ td:nth-child(4),#tab-orar tbody tr:first-child td:nth-child(3):hover ~ td:nth-child(6),#tab-orar tbody tr:nth-child(n+2):nth-child(-n+3) td:nth-child(2):hover ~ td:nth-child(3),#tab-orar tbody tr:nth-child(n+2):nth-child(-n+3) td:nth-child(2):hover ~ td:nth-child(5)'
    schedule = style_task('timetable','Orarul din proiect','Păstrează forma tabelului #tab-orar, inclusiv rowspan. Numai la hover pe numele Luni, Marti sau Miercuri, colorează blue celulele Interval dimineață și Interval seară din același rând. Pauza, ziua și celelalte rânduri rămân neschimbate; hover pe ore nu produce efect.',
        selectors+'{background-color:blue}',[dict(kind='hoverStyle',hover='#tab-orar tbody tr:nth-child(2) td:nth-child(2)',selector='#tab-orar tbody tr:nth-child(2) td:nth-child(3)',name='background-color',value='rgb(0, 0, 255)',label='Marti: dimineață albastră'),dict(kind='hoverStyle',hover='#tab-orar tbody tr:nth-child(2) td:nth-child(2)',selector='#tab-orar tbody tr:nth-child(2) td:nth-child(5)',name='background-color',value='rgb(0, 0, 255)',label='Marti: seară albastră'),prop('#tab-orar tbody tr:nth-child(2) td:nth-child(4)','background-color','rgba(0, 0, 0, 0)')],
        actions=[dict(type='hover',selector='#tab-orar tbody tr:nth-child(2) td:nth-child(2)')],
        variants=[dict(label='Hover pe oră nu schimbă rândul',actions=[dict(type='hover',selector='#tab-orar tbody tr:nth-child(2) td:nth-child(3)')],tests=[prop('#tab-orar tbody tr:nth-child(2) td:nth-child(3)','background-color','rgba(0, 0, 0, 0)')]),dict(label='Joi nu este selectat',actions=[dict(type='hover',selector='#tab-orar tbody tr:nth-child(4) td:nth-child(2)')],tests=[prop('#tab-orar tbody tr:nth-child(4) td:nth-child(3)','background-color','rgba(0, 0, 0, 0)')])])
    words = style_task('words','Dreptunghiuri și prima literă','La #words, rotunjește numai colțurile inferioare ale fiecărui dreptunghi la 16px. Elementele de pe poziții pare sunt micșorate doar pe orizontală la jumătate. Prima literă a fiecărui cuvânt are 32px, iar restul textului 16px. Fără modificări HTML.',
        '#words p{font-size:16px;border-radius:0 0 16px 16px}#words p:nth-child(even){transform:scaleX(.5)}#words p::first-letter{font-size:32px}',
        [prop('#words p','border-bottom-left-radius','16px'),prop('#words p','border-top-left-radius','0px'),prop('#words p:nth-child(2)','transform','matrix(0.5, 0, 0, 1, 0, 0)'),dict(kind='pseudo',selector='#words p',pseudo='::first-letter',name='font-size',includes='32px',label='Prima literă dublă')])
    responsive = style_task('responsive','Catalog adaptabil','Pentru #products folosește Grid cu trei coloane egale de la 800px inclusiv, două între 500 și 799px și una sub 500px. Spațiul dintre produse este 12px. Fără modificarea HTML-ului.',
        '#products{display:grid;grid-template-columns:1fr;gap:12px}@media(min-width:500px){#products{grid-template-columns:repeat(2,1fr)}}@media(min-width:800px){#products{grid-template-columns:repeat(3,1fr)}}',
        [dict(kind='columns',selector='#products',count=3,viewport=900,label='Trei coloane la 900px'),dict(kind='columns',selector='#products',count=2,viewport=650,label='Două coloane la 650px'),dict(kind='columns',selector='#products',count=1,viewport=420,label='O coloană la 420px')])
    fixed = style_task('fixed','Legătură fixă și meniu','Fixează #back la 100px de marginea de sus și 0px de stânga ferestrei, inclusiv când derulezi. În partea de sus a paginii furnizate, meniul este elementul nav cu id menu și legăturile Orar și Produse. Așază conținutul lui pe un rând folosind Flex, centrează-l pe orizontală și lasă 16px între elemente.',
        '#back{position:fixed;top:100px;left:0}#menu{display:flex;justify-content:center;gap:16px}',[prop('#back','position','fixed'),prop('#back','top','100px'),prop('#menu','justify-content','center'),prop('#menu','gap','16px')])
    cards = style_task('cards','Preț la hover și efect reversibil','Prețul .price din fiecare .product are opacity:0. La hover numai pe cardul respectiv apare cu opacity:1, gradual în 0.5 secunde. Cardul primește atunci contur outline solid blue de 2px, fără schimbarea dimensiunilor. Ieșirea ascunde din nou prețul gradual.',
        '.product .price{opacity:0;transition:opacity .5s}.product:hover .price{opacity:1}.product:hover{outline:2px solid blue}',
        [dict(kind='hoverStyle',hover='.product:first-child',selector='.product:first-child .price',name='opacity',value='1',label='Preț vizibil la hover'),prop('.product:nth-child(2) .price','opacity','0'),dict(kind='hoverStyle',hover='.product:first-child',selector='.product:first-child',name='outline-width',value='2px',label='Contur fără modificarea dimensiunilor'),prop('.price','transition-duration','0.5s')],actions=[dict(type='hover',selector='.product:first-child')])
    video = style_task('video','Taburi centrate față de iframe','Containerul #video are lățimea 560px, dar nu depășește lățimea disponibilă. Iframe-ul umple containerul. Centrează legăturile din nav față de iframe folosind Flex și spațiu 12px între ele. Nu centra față de toată pagina.',
        '#video{width:560px;max-width:100%}#video iframe{width:100%}#video nav{display:flex;justify-content:center;gap:12px}',[prop('#video','max-width','100%'),prop('#video nav','display','flex'),prop('#video nav','justify-content','center'),prop('#video nav','gap','12px')])
    css_by_id={x['id']:x['task'] for x in exercises}
    schedule_task=css_by_id[schedule]
    for hover_selector, target, expected, label in [
        ('#tab-orar tbody tr:first-child td:nth-child(3)','#tab-orar tbody tr:first-child td:nth-child(4)','rgb(0, 0, 255)','Luni ține cont de rowspan'),
        ('#tab-orar tbody tr:nth-child(2) td:nth-child(2)','#tab-orar tbody tr:nth-child(2) td:nth-child(4)','rgba(0, 0, 0, 0)','Pauza nu se colorează'),
        ('#tab-orar tbody tr:nth-child(2) td:nth-child(3)','#tab-orar tbody tr:nth-child(2) td:nth-child(3)','rgba(0, 0, 0, 0)','Hover pe oră nu produce efect'),
        ('#tab-orar tbody tr:nth-child(4) td:nth-child(2)','#tab-orar tbody tr:nth-child(4) td:nth-child(3)','rgba(0, 0, 0, 0)','Joi nu produce efect')]:
        schedule_task['tests'].append(dict(kind='hoverStyle',hover=hover_selector,selector=target,name='background-color',value=expected,label=label))
    from exam_more import more_css, more_server
    extra_css=more_css(style_task)
    css_pairs = [(schedule,words),(hover,columns),(responsive,cards),(fixed,video),(schedule,columns),(words,responsive),(cards,video),(hover,fixed)]
    css_pairs+= [pair for pair in combinations([schedule,words,hover,columns,responsive,cards,fixed,video]+extra_css,2) if set(pair) not in [set(old) for old in css_pairs]]
    for i, ids in enumerate(css_pairs,1): ticket('css',i,'Modificări în pagina cofetăriei',list(ids))

    # Existing advanced runtime contracts are retained, not foundation/lesson drills.
    server_ids = ['exam-server-offers-time','exam-server-clock-folder','exam-server-gallery-periods','exam-server-vowel-errors','exam-bridge-project-json-error-page','exam-bridge-project-pg-ejs-route','exam-transfer-reason-query','exam-transfer-reason-escape-empty']
    for key in server_ids:
        item=deepcopy(source[key]);item.pop('lessonId',None);item['level']='Bilet practic';exercises.append(item)
    offers = next(x for x in exercises if x['id']=='exam-server-offers-time')['task']
    offers['prompt']='Completează fragmentul EJS al paginii principale: imediat după orarul furnizat afișează ofertele în ul, într-o secțiune cu id offers. Data fără oră apare roșie în time, cu luna în română din vectorul months; datetime păstrează valoarea ISO completă. Textul apare în dreapta datei. Dacă include Atentie (case-sensitive), îngroașă întregul text. Datele sunt citite din JSON și transmise template-ului.'
    offers['fixture']=base_style+timetable
    offers['starter']=timetable+'\n<!-- Add the offers below the timetable. -->\n'
    offers['solution']=timetable+'\n<section id="offers">'+offers['solution']+'</section>'
    offers['data']['months']=['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie']
    offers['solution']=offers['solution'].replace('Attention','Atentie')
    for offer in offers['data']['offers']: offer['text']=offer['text'].replace('Attention','Atentie')
    for group in [offers]+offers.get('variants',[]):
        if group.get('data'): group['data']['months']=offers['data']['months']
        for test in group.get('tests',[]):
            if test.get('selector'): test['selector']='#offers '+test['selector']
            if isinstance(test.get('value'),str): test['value']=test['value'].replace('October','octombrie').replace('January','ianuarie').replace('Attention','Atentie')
    offers['contextCode']=json.dumps(offers['data'],ensure_ascii=False,indent=2)
    offers['contextLabel']='oferte.json — date furnizate template-ului'
    offers['partials'] = offers.get('partials',{})
    server_ids+=more_server(objective)
    server_pairs=[(0,1),(2,3),(4,5),(6,7),(0,2),(1,4),(3,7),(5,6)]
    server_pairs+=[pair for pair in combinations(range(len(server_ids)),2) if set(pair) not in [set(old) for old in server_pairs]]
    for i,(a,b) in enumerate(server_pairs,1):ticket('server',i,'Rute, fișiere și pagini generate',[server_ids[a],server_ids[b]])

    products=[dict(id=1,name='Tort',type='cofetarie',price=80,weight=800,stock=5,description='ciocolata neagra',allergen='lapte',promo=True),dict(id=2,name='Corn',type='patiserie',price=8,weight=100,stock=0,description='unt proaspat',allergen='gluten',promo=False),dict(id=3,name='Sorbet',type='gelaterie',price=15,weight=150,stock=8,description='fructe de padure',allergen='none',promo=True),dict(id=4,name='Ecler',type='cofetarie',price=12,weight=120,stock=2,description='crema de vanilie',allergen='gluten',promo=False)]
    fields='id,name,type,price,weight,stock,description,allergen,promo'
    setup='CREATE TABLE products(id int,name text,type text,price int,weight int,stock int,description text,allergen text,promo boolean);INSERT INTO products VALUES '+','.join('('+','.join(('true' if v else 'false') if isinstance(v,bool) else str(v) if isinstance(v,int) else "'"+v+"'" for v in p.values())+')' for p in products)+';'
    specs=[('type','Tipul produsului','p.type===choice','type=$1','cofetarie'),('price','Preț maxim','p.price<=Number(choice)','price<=$1','15'),('weight','Gramaj minim','p.weight>=Number(choice)','weight>=$1','150'),('stock','Stoc minim','p.stock>=Number(choice)','stock>=$1','3'),('description','Text în descriere','p.description.toLowerCase().includes(choice.toLowerCase())',"description ILIKE '%' || $1 || '%'",'CREMA'),('allergen','Excluderea unui alergen','p.allergen!==choice','allergen<>$1','gluten'),('promo','Produse la promoție','String(p.promo)===choice','promo=$1','true'),('name','Începutul numelui','p.name.toLowerCase().startsWith(choice.toLowerCase())',"name ILIKE $1 || '%'",'S')]
    base_specs=list(specs)
    for size in [2,3]:
        for group in combinations(base_specs,size):
            key='-'.join(spec[0] for spec in group)
            conditions=[]; clauses=[]
            for index,spec in enumerate(group):
                conditions.append('('+spec[2].replace('choice',f'choice.split("|")[{index}]')+')')
                parameter=f"split_part($1,'|',{index+1})"
                if spec[0] in ['price','weight','stock']: parameter+='::int'
                if spec[0]=='promo': parameter+='::boolean'
                clauses.append('('+spec[3].replace('$1',parameter)+')')
            specs.append((key,' + '.join(spec[1] for spec in group),'&&'.join(conditions),' AND '.join(clauses),'|'.join(spec[4] for spec in group)))
    for number,(field,title,condition,where,value) in enumerate(specs,1):
        key=f'ticket-client-{field}'
        matches={
            'type':lambda p,v:p['type']==v,
            'price':lambda p,v:p['price']<=int(v),
            'weight':lambda p,v:p['weight']>=int(v),
            'stock':lambda p,v:p['stock']>=int(v),
            'description':lambda p,v:v.lower() in p['description'].lower(),
            'allergen':lambda p,v:p['allergen']!=v,
            'promo':lambda p,v:str(p['promo']).lower()==v,
            'name':lambda p,v:p['name'].lower().startswith(v.lower())
        }
        wanted=[p for p in products if all(matches[f](p,v) for f,v in zip(field.split('-'),value.split('|')))]
        descriptions={'type':'tip egal cu','price':'preț cel mult','weight':'gramaj cel puțin','stock':'stoc cel puțin','description':'descriere care conține, fără diferențe de majuscule,','allergen':'alergen diferit de','promo':'promoție egală cu','name':'nume care începe, fără diferențe de majuscule, cu'}
        constraints='; '.join(descriptions[f]+' '+v for f,v in zip(field.split('-'),value.split('|')))
        value_format='Pentru criterii multiple, valorile sunt separate prin |, în ordinea criteriilor din titlu. ' if '-' in field else ''
        route=express(f'În catalog, adaugă GET /products?value=... pentru filtrul „{title}”. Citește tabela products prin pg și întoarce toate coloanele ca JSON în ordinea id. Fără value întoarce toate produsele. Criteriile se aplică simultan: {constraints}. {value_format}Folosește parametri SQL; nu concatena valoarea în interogare. Exemplu: value={value}.',
            'const express=require("express");const {Pool}=require("pg");const app=express();const pool=new Pool();\napp.get("/products",async(req,res)=>{const v=req.query.value;const result=await pool.query("SELECT '+fields+' FROM products"+(v?" WHERE '+where+'":"")+" ORDER BY id",v?[v]:[]);res.json(result.rows);});module.exports=app;',
            [dict(path='/products',json=products),dict(path='/products?value='+value,json=wanted)])
        route.update(database=setup,tables=[dict(name='products',rows=products,columns=list(products[0]))])
        api=objective(key+'-api',title+' — date din PostgreSQL','client',route)
        alternates={'type':'patiserie','price':'8','weight':'800','stock':'8','description':'fructe','allergen':'lapte','promo':'false','name':'T'}
        alternate='|'.join(alternates[f] for f in field.split('-'))
        options=['all',value,alternate]+(['gelaterie'] if field=='type' else [])
        fixture=base_style+'<label>Caută după nume <input id="search"></label><fieldset id="choices"><legend>'+title+'</legend>'+''.join('<label><input type="radio" name="catalog-filter" value="'+v+'"'+(' checked' if v=='all' else '')+'>'+v+'</label>' for v in options)+'</fieldset><label><input type="radio" name="other" checked>Alt grup</label><button id="filter">Filtrează</button><p id="count"></p><div id="catalog">'+''.join('<article class="product" data-id="'+str(p['id'])+'"><h2>'+p['name']+'</h2><p>'+p['type']+'</p></article>' for p in products)+'</div>'
        code='const products='+json.dumps(products)+';\n'
        # JSON booleans are valid JavaScript.
        code+='document.querySelector("#filter").onclick=()=>{const choice=document.querySelector("[name=catalog-filter]:checked").value;const term=document.querySelector("#search").value.trim().toLowerCase();let total=0;for(const p of products){const visible=(choice==="all"||('+condition+'))&&p.name.toLowerCase().includes(term);document.querySelector(`[data-id="${p.id}"]`).hidden=!visible;if(visible)total++;}document.querySelector("#count").textContent=String(total);};'
        tests=[prop(f'[data-id="{p["id"]}"]','display','block' if p in wanted else 'none') for p in products]+[exact('#count',str(len(wanted))),dict(kind='count',selector='[name=other]:checked',min=1,label='Celălalt grup nu se modifică')]
        task=dom(f'Continuă catalogul biletului: afișează tipul fiecărui produs (deja furnizat), păstrează grupul radio separat de other și opțiunea all implicită. La Filtrează aplică filtrul „{title}” (pentru alegerea {value}: {constraints}). {value_format}Combină rezultatul cu textul din #search, căutat în nume fără diferențe de majuscule și ignorând spațiile de la capete. Actualizează #count. All dezactivează numai filtrul radio. În browser primești aceleași produse ca din ruta PostgreSQL, în variabila products; nu trebuie să faci fetch.',code,fixture,tests,[dict(type='click',selector='[name=catalog-filter][value="'+value+'"]'),dict(type='click',selector='#filter')],starter='const products='+json.dumps(products)+';\n// Complete the filter handler.\n',variants=[dict(label='All păstrează filtrul de nume',actions=[dict(type='fill',selector='#search',value=' ECL '),dict(type='click',selector='#filter')],tests=[prop('[data-id="4"]','display','block'),prop('[data-id="1"]','display','none'),exact('#count','1')]),dict(label='Căutare fără rezultate',actions=[dict(type='fill',selector='#search',value='zzz'),dict(type='click',selector='#filter')],tests=[exact('#count','0')])])
        client=objective(key+'-dom',title+' — filtrare în pagină','client',task)
        bonus_solution=code.replace('let total=0;','localStorage.setItem("catalogChoice",choice);let total=0;')+'\nconst saved=localStorage.getItem("catalogChoice");for(const radio of document.querySelectorAll("[name=catalog-filter]")){if(radio.value===saved)radio.parentElement.style.border="2px solid blue";}'
        bonus_task=dom('Continuă filtrul realizat la proba BD + JavaScript client. La click pe Filtrează salvează alegerea radio în localStorage sub catalogChoice. La reîncărcare marchează eticheta opțiunii salvate cu border:2px solid blue. Nu modifica grupul other și nu elimina filtrarea sau contorul. În simulare, codul de pornire este răspunsul tău de la filtrarea în pagină; completează-l fără să elimini funcționalitatea existentă.',bonus_solution,fixture,[prop('[name=catalog-filter][value="'+value+'"]','outline-style','none'),dict(kind='storage',key='catalogChoice',value=value,label='Alegerea este salvată')],[dict(type='click',selector='[name=catalog-filter][value="'+value+'"]'),dict(type='click',selector='#filter')],starter=code,storage={'catalogChoice':value})
        # Border is tested on the label rather than the input.
        bonus_task['tests'][0]=prop('#choices label:nth-of-type(2)','border-top-color','rgb(0, 0, 255)')
        bonus_task['tests'].append(exact('#count',str(len(wanted))))
        bonus_task['variants']=[
            dict(label='Prima vizită salvează alegerea',storage={},actions=[dict(type='click',selector='[name=catalog-filter][value="'+value+'"]'),dict(type='click',selector='#filter')],tests=[dict(kind='storage',key='catalogChoice',value=value,label='Salvare după filtrare'),exact('#count',str(len(wanted)))]),
            dict(label='Reîncărcare cu altă alegere salvată',storage={'catalogChoice':alternate},actions=[],tests=[prop('#choices label:nth-of-type(3)','border-top-color','rgb(0, 0, 255)')])]

        bonus=objective(key+'-bonus',title+' — memorarea opțiunii','bonus',bonus_task)
        ticket('client',number,title,[api,client],bonus)
    from exam_fragments import focus_fragments
    focus_fragments(exercises,common,base_style)
    from exam_starters import prepare_starters
    prepare_starters(exercises,base_style)
    return dict(version=2,sourceLabel='Bilete practice pe categorii.',tickets=tickets,exercises=exercises)
