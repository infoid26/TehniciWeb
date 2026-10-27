"""Additional applied objectives for the fixed practical ticket catalogue."""
import json
from course_model import css, express, prop, exact


def more_css(add):
    definitions=[
        ('print','Versiune pentru imprimare','La imprimare ascunde #menu, #back și #video. Pe ecran ele rămân vizibile. În modul print, produsele sunt afișate într-o singură coloană și textul este negru pe alb.', '@media print{#menu,#back,#video{display:none!important}#products{display:block}body{color:black;background:white}}',[dict(kind='cssIncludes',value='@media print',label='Reguli numai pentru print'),dict(kind='cssIncludes',value='display:none',label='Ascunderea controalelor')]),
        ('focus','Navigare cu tastatura','La focus-visible pe legăturile meniului afișează un outline solid blue de 3px, separat prin outline-offset:4px. Legăturile au padding:8px 16px și nu sunt subliniate implicit.', '#menu a{padding:8px 16px;text-decoration:none}#menu a:focus-visible{outline:3px solid blue;outline-offset:4px}',[prop('#menu a','padding-top','8px'),dict(kind='cssIncludes',value=':focus-visible',label='Stare de focus vizibil'),dict(kind='cssIncludes',value='outline-offset:4px',label='Contur separat')]),
        ('sticky','Meniu lipit la derulare','Meniul #menu rămâne sticky la top:0, cu z-index:10 și fundal alb. Produsele au padding:16px și border-box, astfel încât padding-ul să fie inclus în dimensiunea lor.', '#menu{position:sticky;top:0;z-index:10;background:white}.product{padding:16px;box-sizing:border-box}',[prop('#menu','position','sticky'),prop('#menu','z-index','10'),prop('.product','box-sizing','border-box'),prop('.product','padding-top','16px')]),
        ('alternating','Tabel lizibil fără modificări HTML','În #tab-orar, rândurile pare din tbody au fundal #eeeeee, cele impare alb. Antetul are fundal navy și text alb. Aplică border-collapse:collapse pe tabel și padding:8px pe fiecare celulă.', '#tab-orar{border-collapse:collapse}#tab-orar tbody tr:nth-child(even){background:#eee}#tab-orar tbody tr:nth-child(odd){background:white}#tab-orar thead{background:navy;color:white}#tab-orar td,#tab-orar th{padding:8px}',[prop('#tab-orar tbody tr:nth-child(2)','background-color','rgb(238, 238, 238)'),prop('#tab-orar tbody tr:first-child','background-color','rgb(255, 255, 255)'),prop('#tab-orar thead','color','rgb(255, 255, 255)')]),
        ('badge','Etichetă generată pe primul produs','Numai primul produs primește textul Nou în ::before. Cardul devine position:relative, iar eticheta este absolute la top:0 și right:0, cu fundal navy și text alb. Fără element HTML nou.', '.product:first-child{position:relative}.product:first-child::before{content:"Nou";position:absolute;top:0;right:0;background:navy;color:white}',[prop('.product:first-child','position','relative'),dict(kind='pseudo',selector='.product:first-child',pseudo='::before',name='content',includes='Nou',label='Etichetă generată')]),
        ('reorder','Ordine vizuală fără schimbarea HTML','În #products, folosește Flex pe coloană. Mută vizual ultimul produs înaintea celorlalte folosind order:-1. Pe lățimi de minimum 800px, direcția devine row; ordinea vizuală rămâne aceeași.', '#products{display:flex;flex-direction:column}.product:last-child{order:-1}@media(min-width:800px){#products{flex-direction:row}}',[prop('.product:last-child','order','-1'),dict(kind='style',selector='#products',name='flex-direction',value='column',viewport=600,label='Coloană la 600px'),dict(kind='style',selector='#products',name='flex-direction',value='row',viewport=900,label='Rând la 900px')]),
        ('variables','Culori comune și fallback','Declară --accent:navy în :root și folosește var(--accent) pentru culoarea titlurilor produselor și fundalul meniului. Textul meniului este alb. Definește separat --card-gap:20px și folosește-o la gap pe #products.', ':root{--accent:navy;--card-gap:20px}.product h2{color:var(--accent)}#menu{background:var(--accent);color:white}#products{gap:var(--card-gap)}',[prop('.product h2','color','rgb(0, 0, 128)'),prop('#menu','background-color','rgb(0, 0, 128)'),dict(kind='cssIncludes',value='var(--card-gap)',label='Distanța folosește variabila')]),
        ('animation','Animație repetată a mesajului','Animează #welcome continuu: în 2 secunde opacity trece de la 1 la 0.4 și înapoi prin alternate. Numește animația welcomePulse, cu timing linear și infinite. Nu aplica efectul întregului h1.', '@keyframes welcomePulse{from{opacity:1}to{opacity:.4}}#welcome{animation:welcomePulse 2s linear infinite alternate}',[prop('#welcome','animation-name','welcomePulse'),prop('#welcome','animation-duration','2s'),prop('#welcome','animation-iteration-count','infinite'),prop('#welcome','animation-direction','alternate')])
    ]
    return [add(key,title,prompt,solution,tests) for key,title,prompt,solution,tests in definitions]


def more_server(add):
    products=[dict(id=1,name='Tort',price=80,stock=3,type='cofetarie'),dict(id=2,name='Corn',price=8,stock=0,type='patiserie'),dict(id=3,name='Sorbet',price=15,stock=6,type='gelaterie'),dict(id=4,name='<Ecler>',price=12,stock=2,type='cofetarie')]
    specs=[
        ('available','Produse disponibile', 'items.filter(p=>p.stock>0)', [products[0],products[2],products[3]]),
        ('cheap','Produse de cel mult 15 lei','items.filter(p=>p.price<=15)',products[1:]),
        ('types','Numai cofetărie','items.filter(p=>p.type==="cofetarie")',[products[0],products[3]]),
        ('price-order','Sortare numerică după preț','items.slice().sort((a,b)=>a.price-b.price)',[products[1],products[3],products[2],products[0]]),
        ('stock-order','Sortare descrescătoare după stoc','items.slice().sort((a,b)=>b.stock-a.stock)',[products[2],products[0],products[3],products[1]]),
        ('page','A doua pagină a catalogului','items.slice(2,4)',products[2:]),
        ('total','Numele și valoarea stocului (preț înmulțit cu stoc), separate prin două puncte și spațiu','items.map(p=>({...p,name:p.name+": "+(p.price*p.stock)}))',[{**p,'name':p['name']+': '+str(p['price']*p['stock'])} for p in products]),
        ('search','Nume care conține or, fără diferențe de majuscule','items.filter(p=>p.name.toLowerCase().includes("or"))',products[:3])
    ]
    ids=[]
    template='<h1>Catalog</h1><% if(products.length){ %><ul><% for(const p of products){ %><li><%= p.name %></li><% } %></ul><% }else{ %><p>No products</p><% } %>'
    from html import escape
    for key,title,expression,wanted in specs:
        solution='const express=require("express"),fs=require("fs");const app=express();app.get("/catalog",(req,res)=>{const items=JSON.parse(fs.readFileSync("products.json","utf8"));const products='+expression+';res.render("catalog",{products});});module.exports=app;'
        body='<h1>Catalog</h1><ul>'+''.join('<li>'+escape(p['name'],quote=False)+'</li>' for p in wanted)+'</ul>'
        task=express('Din products.json, construiește /catalog pentru: '+title+'. Transmite rezultatul ca products către catalog.ejs. Template-ul furnizat păstrează lista, escaparea numelor și mesajul No products pentru lista goală. Fișierul JSON trebuie citit la cerere, nu înlocuit cu rezultate fixe.',solution,[dict(path='/catalog',bodyExpected=body)])
        task['files']={'products.json':json.dumps(products),'views/catalog.ejs':template}
        task['variants']=[dict(label='Fișier fără produse',files={'products.json':'[]','views/catalog.ejs':template},requests=[dict(path='/catalog',bodyExpected='<h1>Catalog</h1><p>No products</p>')])]
        ids.append(add('ticket-server-'+key,title,'server',task))
    return ids
