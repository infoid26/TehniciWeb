"""Transfer exercises: practical decisions with counterexamples, after the basics."""
import base64, struct, zlib
from course_model import lesson, q, html, css, js, dom, ejs, sql, express, attr, count, exact, prop, absent, cols

def add_reasoning(cs, ls):
    def add(cid, key, title, prereq, idea, example, explanation, question, task, questions, counterexample):
        item=lesson(cs[cid],'reason-'+key,'Provocare: '+title,idea,example,explanation,question,task)
        item.update(challenge=True,duration='8–15 min',reasoning=dict(prerequisites=prereq,questions=questions,explanation=explanation,counterexample=counterexample))
        item['hint']=questions[-1]
        if task['mode']=='ejs': task['inputData']=task['data']
        ls[item['id']]=item

    add('html-start','link-action','link sau buton?', ['html-links','html-attributes'],
        'Alege elementul după comportament: navigarea are o destinație; o acțiune în pagina curentă nu are nevoie de o adresă fictivă.',
        '<a href="/help">Help</a>\n<button type="button">Close</button>',
        'Linkul oferă o destinație care poate fi deschisă și într-un tab nou. Butonul declanșează acțiunea. type="button" îl împiedică să trimită accidental un formular.',
        q('Details deschide o altă pagină, iar Select alege cardul. Ce alegi?','Details este link, Select este buton.','Ambele sunt linkuri cu href="#".','Ambele sunt paragrafe stilizate.'),
        html('Construiește Details ca link către /items/7 și Select ca buton care nu trimite formularul. Nu utiliza href="#".','<a href="/items/7">Details</a><button type="button">Select</button>',
             [exact('a','Details'),attr('a','href','/items/7'),exact('button','Select'),attr('button','type','button'),absent('a[href="#"]')]),
        ['Care control are o destinație?','Ce se întâmplă dacă butonul este mutat într-un form?'],
        'Aspectul de buton nu schimbă rolul unui link. href="#" poate schimba poziția paginii fără să exprime selectarea.')

    # The fixture assets are inline and work without a separate resource folder.
    portrait='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="navy"/%3E%3C/svg%3E'
    wide='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="200"%3E%3Crect width="600" height="200" fill="teal"/%3E%3C/svg%3E'
    add('html-media','picture-choice','picture pentru altă compoziție', ['html-picture','html-srcset'],
        'Separă două nevoi: altă compoziție la o anumită lățime și aceeași compoziție la rezoluții diferite.',
        '<picture>\n  <source media="(max-width: 500px)" srcset="portrait.png">\n  <img src="wide.png" alt="City park">\n</picture>',
        'picture poate alege alt cadraj printr-o condiție media. img rămâne fallback-ul și poartă alt. CSS width redimensionează sursa aleasă, fără să aleagă singur o altă compoziție.',
        q('Pe telefon trebuie un cadraj portret, iar pe desktop unul panoramic. Ce alegi?','picture cu source media și img fallback.','Doar width:100% pe imaginea panoramică.','Două img fără condiții.'),
        html('Până la 500px inclusiv folosește Portrait; în rest Wide. Pune un img fallback cu alt="City park". URL-urile data sunt furnizate, fără fișiere externe.',
             '<picture><source media="(max-width: 500px)" srcset=\''+portrait+'\'><img src=\''+wide+'\' alt="City park"></picture>',
             [attr('picture > source','media','(max-width: 500px)'),attr('source','srcset',portrait),attr('picture > img','src',wide),attr('img','alt','City park')],
             contextCode='Portrait: '+portrait+'\nWide: '+wide,contextLabel='Imaginile furnizate'),
        ['Se schimbă rezoluția sau compoziția?','Unde trebuie textul alternativ?','De ce nu este suficient doar width:100%?'],
        'Două versiuni ale aceleiași fotografii, cu aceeași compoziție, nu impun automat picture.')

    add('html-media','img-enough','când nu este necesar picture?', ['html-picture','html-srcset'],
        'Nu alege un element mai complex doar fiindcă există. img are deja un mecanism pentru variante de rezoluție.',
        '<img src="small.jpg" srcset="small.jpg 400w, large.jpg 800w" sizes="400px" alt="Park">',
        'Dacă se schimbă numai rezoluția, img cu srcset și sizes poate fi suficient. Descrierile w trebuie să corespundă lățimilor reale. Pentru alt cadraj sau pentru surse condiționate explicit de media, picture devine util.',
        q('Aceeași fotografie are variante de 400 și 800px, ocupând 400px CSS. Este obligatoriu picture?','Nu; img cu srcset și sizes poate rezolva cerința.','Da; două fișiere cer întotdeauna picture.','Nu; width:400px descarcă automat o altă rezoluție.'),
        js('Pentru fiecare caz, input are differentCrop și differentFormat. Returnează "picture" dacă cel puțin una este true, altfel "img". Cazurile modelează alegerea structurii, nu detectarea automată a ecranului.',
           'function solve(input) { return input.differentCrop || input.differentFormat ? "picture" : "img"; }',
           [({'differentCrop':False,'differentFormat':False},'img'),({'differentCrop':True,'differentFormat':False},'picture'),({'differentCrop':False,'differentFormat':True},'picture')],
           note='Acest exercițiu de decizie este rezolvat prin chestionar; codul JavaScript de mai jos este înlocuit cu un răspuns scurt la generare.'),
        ['Sunt diferite imaginile sau doar numărul de pixeli?','Ce poate face deja un img?'],
        'Faptul că ai două fișiere nu spune singur dacă trebuie picture.')
    # The decision is followed by actual HTML, without assuming JavaScript.
    item=ls['reason-img-enough']
    def raster(width,height):
        row=b'\x00'+bytes((40,110,160))*(width//2)+bytes((235,190,70))*(width-width//2)
        def chunk(name,data):
            return struct.pack('>I',len(data))+name+data+struct.pack('>I',zlib.crc32(name+data)&0xffffffff)
        data=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',width,height,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(row*height))+chunk(b'IEND',b'')
        return 'data:image/png;base64,'+base64.b64encode(data).decode()
    small,large=raster(400,200),raster(800,400)
    item['task']=html('Imaginile furnizate au aceeași compoziție, la 400 și 800 pixeli. Construiește un singur img cu srcset 400w/800w, sizes="400px", fallback-ul mic și alt="Color study". Nu folosi picture sau source.',
        '<img src="'+small+'" srcset="'+small+' 400w, '+large+' 800w" sizes="400px" alt="Color study">',
        [attr('img','src',small),attr('img','srcset',small+' 400w, '+large+' 800w'),attr('img','sizes','400px'),attr('img','alt','Color study'),absent('picture'),absent('source')],
        contextCode='Small (400 x 200): '+small+'\nLarge (800 x 400): '+large,contextLabel='Fișiere raster furnizate, cu aceeași compoziție')
    item['task']['id']=item['id']

    add('html-controls-complete','readonly','blocat, dar inclus la submit', ['form-disabled-readonly','html-labels'],
        'readonly și disabled nu sunt interschimbabile la trimiterea formularului.',
        '<input name="code" value="A7" readonly>',
        'Un input readonly cu name poate fi inclus în datele trimise. Un control disabled este omis. Niciunul nu înlocuiește validarea serverului.',
        q('Codul trebuie vizibil, needitabil și trimis la submit. Ce alegi?','input cu name și readonly.','input disabled fără name.','Doar placeholder în loc de value.'),
        html('Creează un form cu un input text având name="reference", value="AB7" și readonly, fără disabled.','<form><input type="text" name="reference" value="AB7" readonly></form>',
             [attr('form input','name','reference'),attr('input','value','AB7'),count('input[readonly]'),absent('input[disabled]')]),
        ['Trebuie trimisă valoarea?','Ce rol are name?'],
        'disabled ar elimina valoarea din datele formularului.')

    fixture='<main id="catalog"><article data-state="ready"><p class="price">12</p></article><article data-state="ready" class="featured"><p class="price">20</p></article><article data-state="draft"><p class="price">5</p></article><div><article data-state="ready"><p class="price">9</p></article></div></main><aside><p class="price">7</p></aside>'
    selector='#catalog > article[data-state="ready"]:not(.featured) > .price'
    add('css-selectors-complete','selector','combină condițiile fără selectări în plus', ['css-descendant','css-attributes','selector-not'],
        'Un selector combinat poate exprima poziția, atributele și excluderile. Verifică și elementele care seamănă cu ținta, dar nu respectă toate cerințele.',
        '#news > article[data-state="published"]:not(.pinned) { color: navy; }',
        '> cere copil direct; atributul verifică starea; :not exclude clasa. Spațiul în loc de > poate include descendenți nedoriți.',
        q('Vrei prețurile articolelor ready, copii direcți ai #catalog, dar nu featured. Ce selector este suficient de precis?',selector,'#catalog article .price','article[data-state="ready"] .price'),
        css('Colorează navy numai prețul 12. Celelalte patru prețuri rămân negre. Nu modifica HTML-ul și nu selecta după textul numărului.',
            '.price { color: black; }\n'+selector+' { color: navy; }',fixture,
            [prop('#catalog > article:first-child .price','color','rgb(0, 0, 128)'),prop('.featured .price','color','rgb(0, 0, 0)'),prop('[data-state="draft"] .price','color','rgb(0, 0, 0)'),prop('#catalog > div .price','color','rgb(0, 0, 0)'),prop('aside .price','color','rgb(0, 0, 0)')]),
        ['Unde este necesar copil direct?','Ce condiție exclude fiecare element apropiat?','Poți explica fiecare segment al selectorului?'],
        'Un selector prea larg ar colora și prețul 9 din containerul intermediar.')

    add('css-selectors-complete','nth-type','a doua poziție dintre ce elemente?', ['selector-nth-type','selector-nth-even'],
        'nth-child numără toți copiii; nth-of-type numără numai elementele de același tip.',
        'section > p:nth-of-type(2) { color: navy; }',
        'Titlul și aside intră în numărătoarea tuturor copiilor, dar nu în numărătoarea paragrafelor.',
        q('În h2, p, aside, p, p, ce selectează p:nth-child(2)?','Primul paragraf.','Al doilea paragraf.','Al doilea p indiferent de ceilalți copii.'),
        css('Colorează navy numai paragraful Second. First și Third trebuie să rămână negre.',
            '#notes p { color: black; }\n#notes > p:nth-of-type(2) { color: navy; }','<section id="notes"><h2>Notes</h2><p>First</p><aside>Extra</aside><p>Second</p><p>Third</p></section>',
            [prop('#notes p:nth-of-type(1)','color','rgb(0, 0, 0)'),prop('#notes p:nth-of-type(2)','color','rgb(0, 0, 128)'),prop('#notes p:nth-of-type(3)','color','rgb(0, 0, 0)')]),
        ['Numeri toți frații sau numai paragrafele?','Ce se schimbă dacă apare încă un titlu?'],
        'p:nth-child(2) ar colora First în structura dată.')

    add('css-basics','cascade','de ce nu câștigă ultima regulă?', ['css-specificity','css-inherit'],
        'Ordinea în fișier nu este singurul criteriu al cascadei. În reguli obișnuite de aceeași origine și același strat, un selector mai specific poate câștiga deși apare înainte.',
        '#panel .note { color: navy; }\n.note { color: black; }',
        'Selectorul cu ID are specificitate mai mare. O excepție locală poate folosi aceeași specificitate și poate apărea după regula inițială, fără important.',
        q('Ce culoare primește .note din #panel în exemplu?','Navy, datorită selectorului mai specific.','Negru; ultima regulă câștigă întotdeauna.','Doar culoarea moștenită, fără cele două reguli.'),
        css('Păstrează regulile de pornire și adaugă o excepție fără !important: numai .urgent din #panel devine roșie; nota obișnuită rămâne navy.',
            '#panel .note { color: navy; }\n.note { color: black; }\n#panel .urgent { color: red; }','<div id="panel"><p class="note">Normal</p><p class="note urgent">Urgent</p></div>',
            [prop('.note:not(.urgent)','color','rgb(0, 0, 128)'),prop('.urgent','color','rgb(255, 0, 0)')],starter='#panel .note { color: navy; }\n.note { color: black; }\n'),
        ['De ce o simplă regulă .urgent poate pierde?','Ce compari înaintea ordinii?'],
        'Aplicarea important peste tot poate ascunde cauza fără să explice cascada.')

    add('css-layout','box','de ce depășește cardul containerul?', ['css-box','css-responsive'],
        'În content-box, padding-ul și bordura se adaugă lățimii declarate; în border-box sunt incluse.',
        '.card { width: 100%; padding: 20px; border: 5px solid; box-sizing: border-box; }',
        'Într-un container de 300px, un card content-box de 100% cu 40px padding și 10px bordură poate avea exteriorul de 350px.',
        q('Ce corectează cauza depășirii produse de padding și bordură?','box-sizing: border-box pe card.','Ascund orice depășire cu overflow:hidden.','Măresc arbitrar containerul.'),
        css('Containerul are 300px. Include padding 20px și bordură 5px în lățimea de 100% a cardului, fără să ascunzi conținutul.',
            '#container { width: 300px; }\n.card { width: 100%; padding: 20px; border: 5px solid navy; box-sizing: border-box; }','<div id="container"><article class="card">Details</article></div>',
            [prop('.card','box-sizing','border-box'),prop('.card','width','300px'),prop('.card','padding-left','20px'),prop('.card','border-left-width','5px')]),
        ['Ce include width în fiecare model?','Poți calcula dimensiunea exterioară înainte de corecție?'],
        'overflow:hidden poate tăia textul, fără să corecteze dimensiunea cardului.')

    add('css-layout','grid-boundary','verifică ambele părți ale limitei', ['css-grid','css-responsive'],
        'O schimbare responsive trebuie verificată la limită și imediat după limită, nu numai pe ecranul propriu.',
        '.cards { display: grid; grid-template-columns: repeat(2, 1fr); }\n@media (max-width: 500px) { .cards { grid-template-columns: 1fr; } }',
        'max-width include valoarea de 500px; regula de bază rămâne activă la 501px. Coloanele sunt egale prin 1fr.',
        q('Cerința spune o coloană până la 500px inclusiv și două peste 500px. Ce teste sunt importante?','500px și 501px, plus lățimi mai mici și mai mari.','Numai desktopul pe care scriu.','Numai numărul de carduri.'),
        css('Afișează două coloane egale la 800px și 501px, dar o coloană la 500px și 390px.',
            '.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }\n@media (max-width: 500px) { .cards { grid-template-columns: 1fr; } }','<div class="cards"><article>One</article><article>Two</article><article>Three</article></div>',
            [cols('.cards',2,800),cols('.cards',2,501),cols('.cards',1,500),cols('.cards',1,390)]),
        ['Ce înseamnă inclusiv la limită?','Ce regulă trebuie să câștige la 501px?'],
        'Un layout poate părea corect într-o singură captură și să fie greșit imediat lângă prag.')

    add('js-start','conversion','numere care vin ca texte', ['js-convert','js-if'],
        'Un text care arată ca număr rămâne text până la conversie. Decide conversia înaintea operației.',
        'Number("12") + Number("3"); // 15',
        '+ poate concatena texte. Conversia rezultatului concatenării este prea târzie.',
        q('Vrei suma numerică a textelor "10" și "2". Ce alegi?','Convertești ambele valori înainte de adunare.','Aduni textele, apoi convertești rezultatul.','Pui un spațiu între texte.'),
        js('input are price și fee ca texte. Returnează suma numerică fără să modifici input.','function solve(input) { return Number(input.price) + Number(input.fee); }',
           [({'price':'10','fee':'2'},12),({'price':'0','fee':'5'},5),({'price':'2.5','fee':'0.5'},3),({'price':'-2','fee':'3'},1)]),
        ['Ce tip au valorile înaintea operației?','Ce ar produce + fără conversie?'],
        'Number("10" + "2") produce 102, nu 12.')

    add('js-scope-complete','zero','zero nu este absență', ['nullish-values'],
        'O valoare falsy poate fi validă. Zero poate însemna stoc epuizat, nu informație lipsă.',
        'const stock = input.stock ?? 10;',
        '?? folosește alternativa numai pentru null și undefined. || o folosește și pentru 0.',
        q('stock=0 trebuie păstrat, iar stock=null trebuie înlocuit cu 10. Ce alegi?','stock ?? 10','stock || 10','stock + 10'),
        js('Păstrează input.stock dacă nu este null sau undefined. Numai pentru acestea întoarce 10.','function solve(input) { return input.stock ?? 10; }',[({'stock':0},0),({'stock':7},7),({'stock':None},10),({},10)]),
        ['Ce semnifică zero în această problemă?','Care valori activează fiecare operator?'],
        'stock || 10 ar transforma stocul epuizat în 10.')

    add('js-arrays','sort','sortare fără distrugerea sursei', ['array-sort','array-copy'],
        'Un comparator corect nu împiedică sort să modifice vectorul. Copierea și ordinea numerică sunt două decizii separate.',
        'const sorted = [...values].sort(function (a, b) { return a - b; });',
        'Copia păstrează intrarea; comparatorul evită ordinea textuală implicită a numerelor.',
        q('Catalogul trebuie să poată reveni la ordinea inițială. Ce păstrezi?','Vectorul inițial nemodificat și o copie sortată.','Numai vectorul sortat, fiindcă îl pot inversa.','Numai ordinea textuală implicită.'),
        js('Returnează numerele crescător, fără să modifici input.','function solve(input) { return [...input].sort(function (a, b) { return a - b; }); }',[([10,2,1],[1,2,10]),([],[]),([0,-3,2],[-3,0,2]),([2,2,1],[1,2,2])]),
        ['Ce metodă modifică sursa?','Ce se întâmplă cu 2 și 10 fără comparator?'],
        'Inversarea sortării nu reconstruiește ordinea inițială arbitrară.')

    add('js-collections-complete','missing-index','căutare fără rezultat', ['array-find-index','array-splice-removed'],
        'findIndex întoarce -1 când nu găsește elementul. Verifică semnificația rezultatului înainte să îl folosești pentru modificare.',
        'if (index !== -1) items.splice(index, 1);',
        'splice(-1,1) șterge ultimul element. Absența id-ului nu trebuie să elimine un element fără legătură.',
        q('Ce face splice(-1,1) pe un vector nevid?','Șterge ultimul element.','Nu face nimic.','Aruncă obligatoriu o eroare.'),
        js('Returnează o copie a input.items fără elementul cu id=input.id. Dacă id-ul lipsește, păstrează tot.',
           'function solve(input) { const items = [...input.items]; const index = items.findIndex(function (item) { return item.id === input.id; }); if (index !== -1) items.splice(index, 1); return items; }',
           [({'items':[{'id':1},{'id':2}],'id':9},[{'id':1},{'id':2}]),({'items':[{'id':1},{'id':2}],'id':1},[{'id':2}]),({'items':[],'id':1},[])]),
        ['Cum semnalează căutarea absența?','Cum interpretează splice un index negativ?'],
        'Testarea numai cu un id existent nu descoperă ștergerea accidentală a ultimului element.')

    add('js-text','search','căutare tolerantă la majuscule', ['string-trim','string-case','string-search'],
        'Normalizează după aceeași regulă termenul și textul în care cauți.',
        'name.toLowerCase().includes(term.trim().toLowerCase());',
        'trim elimină spațiile de la capetele termenului. Textul gol este inclus în orice text și poate reafișa toate rezultatele.',
        q('Ce nu ajunge pentru ca " PEN " să găsească "Blue pen"?','Normalizarea numai a numelui, nu și a termenului.','Conversia ambelor texte la litere mici.','Eliminarea spațiilor de la capetele termenului.'),
        js('Returnează textele din input.names care conțin input.term, ignorând majusculele și spațiile de la capetele termenului.',
           'function solve(input) { const term = input.term.trim().toLowerCase(); return input.names.filter(function (name) { return name.toLowerCase().includes(term); }); }',
           [({'names':['Blue pen','Notebook'],'term':' PEN '},['Blue pen']),({'names':['Tea','Cake'],'term':''},['Tea','Cake']),({'names':['Tea'],'term':'milk'},[])]),
        ['Ce normalizezi în fiecare parte?','Ce rezultat dorești pentru termenul gol?'],
        'startsWith ar respinge Blue pen pentru termenul pen, deși cerința cere apariția oriunde.')

    add('regex-complete','whole','format complet sau fragment?', ['regex-exact','regex-full-quant-exact'],
        'O potrivire găsită în interiorul textului nu validează automat textul întreg.',
        '/^[A-Z]{2}[0-9]{3}$/.test("AB123");',
        'Ancorele cer întregul text, iar cuantificatorii cer lungimi exacte.',
        q('De ce /[A-Z]{2}[0-9]{3}/ acceptă "xAB123y"?','Găsește un fragment valid; lipsesc ancorele.','Este necesar flagul g ca să respingă textul.','Nu permite combinarea literelor și cifrelor.'),
        js('Acceptă numai exact două litere mari A-Z și trei cifre. Returnează boolean.','function solve(input) { return /^[A-Z]{2}[0-9]{3}$/.test(input); }',[('AB123',True),('xAB123y',False),('ab123',False),('AB1234',False),('AB12',False),('',False)]),
        ['Validezi întregul text sau cauți o parte?','Ce exemple apropiate trebuie respinse?'],
        'Flagul g nu transformă o căutare de fragment într-o validare completă.')

    add('dates-complete','utc-month','luna se poate schimba după conversie', ['date-full-getUTCMonth','date-full-getUTCFullYear'],
        'Același moment poate aparține altei zile sau luni în alt fus orar. Folosește consecvent fusul cerut.',
        'new Date("2026-03-01T00:30:00+02:00").getUTCMonth(); // 1',
        'Momentul din exemplu este încă în februarie la UTC. getUTCMonth numără lunile de la 0.',
        q('Momentul 1 martie, 00:30, la +02:00 aparține cărei luni UTC?','Februarie.','Martie indiferent de offset.','Date nu poate reprezenta acest moment.'),
        js('Returnează luna UTC a momentului input, numerotată de la 1 la 12.','function solve(input) { return new Date(input).getUTCMonth() + 1; }',[('2026-03-01T00:30:00+02:00',2),('2026-01-01T00:30:00+02:00',12),('2026-07-15T12:00:00Z',7)]),
        ['Se cere timp local sau UTC?','Ce se schimbă la traversarea miezului nopții?'],
        'Extragerea caracterelor lunii din text ar ignora offsetul.')

    code='document.querySelector("#apply").onclick = function () { document.querySelector("#result").textContent = document.querySelector("#name").value; };'
    add('dom','event-time','când citești valoarea?', ['dom-click','dom-value'],
        'O valoare citită la încărcare este o captură a acelui moment. Citește valoarea curentă atunci când acțiunea o folosește.',
        'button.onclick = function () { output.textContent = input.value; };',
        'Handler-ul citește după modificările utilizatorului. Atributul HTML value poate rămâne neschimbat, deși proprietatea value a fost modificată.',
        q('Utilizatorul schimbă numele înainte de Apply. Unde citești .value?','În handler-ul click.','Numai la încărcare, înainte de handler.','Din atributul HTML value, fără proprietatea curentă.'),
        dom('La Apply afișează valoarea curentă din input în #result. Se testează și o altă valoare introdusă după încărcare.',code,
            '<input id="name" value="Old"><button id="apply">Apply</button><p id="result"></p>',[exact('#result','New')],
            [dict(type='fill',selector='#name',value='New'),dict(type='click',selector='#apply')],
            variants=[dict(label='Alt nume',actions=[dict(type='fill',selector='#name',value='Alex'),dict(type='click',selector='#apply')],tests=[exact('#result','Alex')])]),
        ['În ce moment se poate modifica valoarea?','Citești proprietatea curentă sau atributul inițial?'],
        'Un const name=input.value creat înainte de eveniment poate păstra Old.')

    add('browser-integration','text','text sau markup?', ['dom-text','dom-create'],
        'Un nume introdus de utilizator poate conține semne de taguri. Dacă se cere text, nu îl interpreta ca HTML.',
        'output.textContent = "<b>Example</b>";',
        'textContent păstrează textul literal, fără să creeze un element b.',
        q('Cum afișezi un nume care poate conține <img...>, fără interpretare ca HTML?','Prin textContent.','Prin innerHTML.','Elimin doar cuvântul script.'),
        dom('Copiază valoarea din input în #result ca text literal, fără un element b în rezultat.',
            'document.querySelector("#result").textContent = document.querySelector("#name").value;',
            '<input id="name" value="&lt;b&gt;Notebook&lt;/b&gt;"><div id="result"></div>',[exact('#result','<b>Notebook</b>'),absent('#result b')]),
        ['Vrei text sau elemente noi?','Cum verifici absența elementelor interpretate?'],
        'Un test doar cu Notebook ar trece și pentru innerHTML.')

    add('json','boundary','din text JSON până la rezultat', ['json-parse','json-nested'],
        'Parsarea, accesul la proprietăți și filtrarea sunt operații distincte, în această ordine.',
        'const data = JSON.parse(text);\nconst items = data.items.filter(function (item) { return item.available; });',
        'Înaintea parsării ai text. După parsare poți accesa items ca vector și calcula un rezultat.',
        q('Care este ordinea potrivită pentru textul unui fișier JSON cu items?','Parsez textul, accesez items, apoi filtrez.','Filtrez direct textul.','Aplic stringify înainte de accesarea proprietăților.'),
        js('input este text JSON cu items. Returnează numele elementelor cu available=true, în ordine.',
           'function solve(input) { const data = JSON.parse(input); return data.items.filter(function (item) { return item.available === true; }).map(function (item) { return item.name; }); }',
           [('{"items":[{"name":"Pen","available":true},{"name":"Book","available":false}]}',['Pen']),('{"items":[]}',[]),('{"items":[{"name":"Tea","available":false}]}',[])]),
        ['Ce tip ai înainte și după JSON.parse?','Ce întorci pentru o listă fără rezultate?'],
        'stringify ar serializa încă o dată textul, nu ar oferi obiectul cu items.')

    add('storage','restore','date salvate absente sau invalide', ['storage-restore','json-errors'],
        'Datele salvate pot lipsi, pot avea JSON invalid sau pot avea alte tipuri decât cele așteptate.',
        'try { const data = JSON.parse(saved); } catch (error) { /* Use a default. */ }',
        'JSON valid nu garantează forma necesară aplicației. Validez obiectul și tipul contorului, păstrând valoarea validă zero.',
        q('Ce faci dacă preferința poate lipsi sau conține JSON invalid?','Tratez eroarea și validez forma datelor.','Folosesc eval pe textul salvat.','Șterg întreaga stocare la fiecare încărcare.'),
        js('input este text salvat sau null. Returnează count numai dacă este numeric și nenegativ într-un obiect JSON; în rest returnează 0.',
           'function solve(input) { try { const data = JSON.parse(input); if (data && typeof data.count === "number" && data.count >= 0) return data.count; } catch (error) { return 0; } return 0; }',
           [('{"count":0}',0),('{"count":8}',8),(None,0),('broken',0),('{"count":"8"}',0),('{"count":-1}',0)]),
        ['Este parsarea suficientă pentru a garanta tipurile?','De ce nu ștergi preferințe fără legătură?'],
        'Datele {"count":"8"} sunt JSON valid, dar nu respectă contractul acestui contor.')

    add('scss','theme','valoare de build sau de utilizare?', ['scss-variables','css-variables'],
        'Sass calculează variabilele la compilare. Variabilele CSS pot rămâne legate de tema paginii încărcate.',
        '$spacing: 12px;\n.card { padding: $spacing; color: var(--accent); }',
        'CSS-ul rezultat păstrează var(--accent), dar padding devine 12px. Schimbarea variabilei Sass ar necesita o nouă compilare.',
        q('Culoarea trebuie schimbată în browser fără recompilarea SCSS. Ce alegi?','O proprietate CSS personalizată folosită cu var().','Numai $accent în SCSS.','Browserul va compila singur fișierul SCSS.'),
        css('Scrie SCSS care folosește $spacing pentru padding 12px și păstrează culoarea legată de --accent, nu o valoare fixă.',
            '$spacing: 12px;\n.card { padding: $spacing; color: var(--accent); }','<article class="card" style="--accent:navy">Catalog</article>',
            [prop('.card','padding-left','12px'),prop('.card','color','rgb(0, 0, 128)'),dict(kind='cssIncludes',value='var(--accent)',label='Culoarea rămâne legată de variabila CSS.')],mode='scss'),
        ['Ce se calculează la build?','Ce expresie trebuie păstrată în CSS pentru tema din browser?'],
        'Modificarea lui $accent în sursa SCSS nu schimbă singură CSS-ul deja descărcat.')

    code='const fs = require("fs");\nfunction solve(input) { const data = JSON.parse(fs.readFileSync(input.file, "utf8")); return data.items.filter(function (item) { return item.stock > 0; }).map(function (item) { return item.name; }); }'
    add('node','file-flow','rezultatul trebuie să vină din fișier', ['node-json-file','node-buffer'],
        'O funcție generală citește calea cerută și calculează rezultatul din conținutul citit.',
        'const text = fs.readFileSync(file, "utf8");\nconst data = JSON.parse(text);',
        'utf8 cere text în loc de Buffer. După parsare poți filtra items. Alt fișier trebuie să poată produce alt rezultat.',
        q('Cum descoperi că rezultatul este scris direct în cod?','Testez și un alt fișier, cu alte date.','Repet numai primul exemplu.','Caut cuvântul JSON în sursă.'),
        js('Citește input.file și returnează numele elementelor cu stock>0. Nu fixa numele fișierului sau rezultatul.',code,
           [({'file':'stock.json'},['Pen']),({'file':'empty.json'},[]),({'file':'other.json'},['Book','Tea'])],mode='node',
           files={'stock.json':'{"items":[{"name":"Pen","stock":2},{"name":"Notebook","stock":0}]}','empty.json':'{"items":[]}','other.json':'{"items":[{"name":"Book","stock":1},{"name":"Tea","stock":5}]}'}),
        ['Ce întoarce citirea cu utf8?','Ce trebuie să depindă de input.file?'],
        'return ["Pen"] trece primul caz, dar nu rezolvă problema generală.')

    code='''const express = require("express");
const app = express();
app.get("/items", function (request, response) {
  const raw = request.query.limit;
  if (raw === undefined) { response.json({ limit: 10 }); return; }
  const limit = Number(raw);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    response.status(400).send("Invalid limit"); return;
  }
  response.json({ limit: limit });
});
module.exports = app;'''
    add('express','query','absent nu înseamnă invalid', ['express-query','express-numbers','express-status'],
        'Un parametru poate lipsi sau poate fi prezent, dar invalid. O valoare implicită nu trebuie să ascundă un parametru greșit.',
        'if (request.query.limit === undefined) { response.json({ limit: 10 }); return; }',
        'Numai absența primește 10. Pentru valori prezente verific intervalul și integritatea numărului, apoi răspund cu 400 dacă nu sunt valide.',
        q('De ce Number(limit)||10 este greșit dacă zero este invalid?','Ascunde zero invalid sub valoarea implicită.','Nu poate converti texte numerice.','Verifică automat intervalul 1–50.'),
        express('La /items fără limit întoarce JSON {"limit":10}. Acceptă întregi 1–50. Pentru zero, text, fracție sau valori peste 50 întoarce 400 și Invalid limit.',code,
                [dict(path='/items',json={'limit':10}),dict(path='/items?limit=2',json={'limit':2}),dict(path='/items?limit=0',status=400,bodyExpected='Invalid limit'),dict(path='/items?limit=abc',status=400,bodyExpected='Invalid limit'),dict(path='/items?limit=2.5',status=400,bodyExpected='Invalid limit'),dict(path='/items?limit=51',status=400,bodyExpected='Invalid limit')]),
        ['Cum distingi lipsa de zero?','Ce valori aparent apropiate trebuie respinse?'],
        'parseInt("2abc") ar produce 2, deși textul nu reprezintă întregul cerut.')

    code='const express = require("express");\nconst app = express();\napp.get("/status", function (request, response) { response.send("Ready"); });\napp.use(function (request, response) { response.status(404).send("Not found"); });\nmodule.exports = app;'
    add('http-routing-complete','order','ruta există, dar cererea nu ajunge la ea', ['express-order','express-next'],
        'O rută declarată nu este automat accesibilă. Un middleware anterior poate încheia răspunsul.',
        'app.get("/status", handler);\napp.use(notFound);',
        'Fallback-ul 404 vine după rutele cunoscute. Dacă răspunde înaintea lor fără next, oprește cererea.',
        q('Ce face un middleware 404 pus înaintea rutei, dacă trimite răspunsul fără next?','Oprește cererea înaintea rutei.','Express ignoră ordinea și alege ruta mai specifică.','Trimite corect două răspunsuri.'),
        express('Configurează /status cu 200 și Ready. Toate căile necunoscute primesc 404 și Not found.',code,[dict(path='/status',bodyExpected='Ready'),dict(path='/missing',status=404,bodyExpected='Not found'),dict(path='/other',status=404,bodyExpected='Not found')]),
        ['Ce se execută primul?','Ce încheie răspunsul?','Unde trebuie așezat fallback-ul?'],
        'Schimbarea textului erorii nu rezolvă ordinea greșită.')

    template='<% if (items.length === 0) { %><p>No items</p><% } else { %><ul><% for (const item of items) { %><li><%= item.name %></li><% } %></ul><% } %>'
    task=ejs('Afișează numele din items ca text, în li. Pentru items gol afișează No items într-un p, fără ul.',template,{'items':[{'name':'<b>Pen</b>'}]},[exact('li','<b>Pen</b>'),absent('li b'),count('ul')])
    task['variants']=[dict(label='Listă goală',data={'items':[]},tests=[exact('p','No items'),absent('ul')]),dict(label='Alte nume',data={'items':[{'name':'Tea'},{'name':'Book'}]},tests=[exact('li:first-child','Tea'),exact('li:last-child','Book')])]
    add('ejs','escape-empty','text neobișnuit și listă goală', ['ejs-escape','ejs-empty'],
        'Un template trebuie să funcționeze și pentru nume care arată ca HTML, și fără rezultate.',
        '<li><%= item.name %></li>',
        'Escaparea păstrează numele ca text. O ramură pentru lista goală îi explică utilizatorului de ce nu vede elemente.',
        q('Numele primit este "<b>Pen</b>" și trebuie afișat literal. Ce alegi?','<%= item.name %>','<%- item.name %>','Un nume fix scris în template.'),
        task,['Vrei text sau markup?','Ce trebuie afișat când nu ai elemente?'],
        'Un test doar cu Pen nu descoperă interpretarea accidentală a tagurilor.')

    seed="CREATE TABLE products (id integer, name text, category text, stock integer); INSERT INTO products VALUES (1,'Book','books',0),(2,'Pen','stationery',3),(3,'Notebook','books',2),(4,'Mug','accessories',4);"
    code="SELECT name FROM products WHERE (category = 'books' OR category = 'stationery') AND stock > 0 ORDER BY id;"
    add('sql-queries-complete','sql-logic','parantezele schimbă rezultatul', ['sql-and-or'],
        'Stocul pozitiv trebuie cerut ambelor categorii alternative, nu numai celei de-a doua.',
        "WHERE (category = 'books' OR category = 'stationery') AND stock > 0",
        'Fără paranteze, prioritatea AND poate accepta produse books fără stoc. Rândul Book este un contraexemplu util.',
        q('Ce condiție cere books sau stationery, ambele cu stoc pozitiv?',"(category='books' OR category='stationery') AND stock>0","category='books' OR category='stationery' AND stock>0","category='books' AND category='stationery' AND stock>0"),
        sql('Afișează name pentru books sau stationery cu stock>0, în ordinea id-ului.',code,[{'name':'Pen'},{'name':'Notebook'}],seed),
        ['Ce condiție este comună ambelor categorii?','Ce rând descoperă lipsa parantezelor?'],
        'Book are categoria potrivită, dar nu are stoc și trebuie exclus.')

    seed="CREATE TABLE users (id integer, name text); CREATE TABLE visits (id integer, user_id integer); INSERT INTO users VALUES (1,'Alex'),(2,'Sam'); INSERT INTO visits VALUES (10,1),(11,1);"
    code='SELECT users.name, COUNT(visits.id)::int AS total FROM users LEFT JOIN visits ON visits.user_id = users.id GROUP BY users.id, users.name ORDER BY users.id;'
    add('sql-queries-complete','sql-zero','păstrează și numără corect cazurile fără potrivire', ['sql-left-join','sql-count-user-visits'],
        'LEFT JOIN poate păstra utilizatori fără accesări; coloana numărată decide dacă apar cu zero sau cu unu.',
        'COUNT(visits.id)',
        'Rândul fără accesare are visits.id NULL. COUNT(visits.id) ignoră NULL, în timp ce COUNT(*) numără și rândul păstrat.',
        q('Ce numără corect accesările după LEFT JOIN?', 'COUNT(visits.id)','COUNT(*) în orice situație.','INNER JOIN păstrează și utilizatorii fără potrivire.'),
        sql('Afișează name și total pentru toți utilizatorii, inclusiv cei fără accesări. Sortează după users.id.',code,[{'name':'Alex','total':2},{'name':'Sam','total':0}],seed),
        ['Cine trebuie păstrat fără potriviri?','Ce conține visits.id în acel rând?'],
        'COUNT(*) ar raporta 1 pentru Sam după acest LEFT JOIN.')
