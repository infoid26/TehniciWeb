"""Source-by-source companion: the exact teacher material remains reviewable.

These are reading/reconstruction exercises, not automatic claims of mastery.
"""
from course_model import *
from course_model import text as text_task
from build_inventory import build
import re, hashlib, json
from pathlib import Path
from course_css_details import properties
from course_details import math_tags
inventory=build()
base_lessons=[l for c in chapters for l in c['lessons']]
base_tokens={l['id']:set(re.findall(r'[\w:@$-]+',l['example']+' '+l['title'])) for l in base_lessons}
definitions={name:(meaning,'css-detail-'+name.lstrip('-')) for name,(_,meaning) in properties.items()}
definitions.update({name:(meaning,'math-detail-'+name) for name,(meaning,_) in math_tags.items()})
for l in base_lessons:
 for method in re.findall(r'\.([A-Za-z_$][\w$]*)\s*\(',l['example']):
  if method not in definitions:definitions[method]=(l['intro'],l['id'])
stop={'html','body','head','div','span','p','a','li','ul','script','style','meta','link','return','function','const','let','var','if','else','for','while','true','false','null','get','set','log'}

def concepts(text):
 tokens=[]
 patterns=[r'<\s*([a-z][a-z0-9-]*)\b',r'(?<![\w-])((?:--)?[a-zA-Z][\w-]*)\s*:',r'\.\s*([A-Za-z_$][\w$]*)\s*\(',r'(@[a-z-]+)',r'(::?[a-z][\w-]*(?:\([^)]*\))?)',r'\b(SELECT|CREATE|REFERENCES|DEFAULT|CHECK|UNIQUE|TIMESTAMP|VARCHAR|ENUM|INSERT|FROM|WHERE|ORDER BY)\b']
 for pattern in patterns:
  for token in re.findall(pattern,text):
   if token not in tokens and token not in stop:tokens.append(token)
 return tokens

def associated(text):
 keys=set(concepts(text))
 matches=[]
 for l in base_lessons:
  score=len(keys & base_tokens[l['id']])
  if score:matches.append((score,l['id']))
 return [id for _,id in sorted(matches,reverse=True)[:8]]

def make_lesson(c,id,title,reference,source,links):
 keys=concepts(reference)
 # Prefer a recognizable concrete syntax token, rather than an arbitrary word.
 key=next((k for k in keys if k in definitions),next((k for k in keys if len(k)>2),''))
 if key:
  prompt=f'Identifică în material construcția `{key}`. Scrie exact numele ei, inclusiv prefixul dacă există. Apoi compară exemplul cu lecțiile practice asociate.'
  alternatives=[x for x in ['querySelector','@keyframes','SELECT','msup','JSON.stringify','background-color','fs.readFileSync','grid-template-columns'] if x!=key and x not in reference][:2]
  quiz=q('Care dintre aceste construcții apare în fragmentul studiat?',key,*alternatives)
  solution=key
 else:
  prompt='Înainte de cod, verifică rolurile: scrie extensia fișierului care stabilește aspectul unei pagini.'
  solution='.css';quiz=q('Ce fișier controlează aspectul unei pagini?','style.css','data.sql','package-lock.json')
 item=lesson(c,id,title,'Citește materialul profesoarei de mai jos, apoi urmărește explicațiile practice asociate. Această lecție păstrează contextul complet al sursei, inclusiv variantele vechi și comentariile.',reference,'Exercițiul de aici verifică recunoașterea sintaxei din sursă. Pentru a o folosi, rezolvă și exercițiile practice asociate; simpla copiere a numelui nu înlocuiește scrierea codului.',quiz,text_task(prompt,solution),points=['Parcurge fragmentul de sus în jos și identifică elementele deja cunoscute.','Deschide lecțiile asociate pentru explicații și exerciții de programare.','Compară variantele din material; un comentariu sau o sintaxă istorică nu este automat cod de copiat într-un proiect nou.'])
 item['source']=source
 item['referenceText']=reference
 item['relatedLessons']=links
 item['syntaxNotes']=[{'token':k,'explanation':definitions[k][0],'lesson':definitions[k][1]} for k in keys if k in definitions]
 item['reading']=True
 return item

slide_groups={}
for source in inventory['items']:
 if source['kind']!='slide':continue
 name=source['path'];text=source['text'];source['lessons']=associated(text)
 # Title/TOC/empty slides remain available in the source library, not padded into lessons.
 meaningful=[line.strip() for line in text.splitlines() if line.strip() and not any(x in line for x in ['irina.ciocan@','Cuprins','‹#›','▲'])]
 if len('\n'.join(meaningful))<120 or (len(meaningful)>1 and meaningful[0] in ['Cuprins','Bibliografie și linkuri utile']):continue
 if name not in slide_groups:
  idx=len(slide_groups)+1
  slide_groups[name]=chapter('slides-'+str(idx),'Aprofundare · '+Path(name).stem,'Parcurge fiecare slide substanțial al prezentării, cu sursa integrală și exerciții asociate.',name,'book')
 id='slide-'+str(len(slide_groups))+'-'+str(source['slide'])
 title=f'{source["slide"]}: {meaningful[0]}'
 item=make_lesson(slide_groups[name],id,title,text,source['title'],source['lessons'])
 item['referenceImages']=source.get('images',[])
 source['lessons'].insert(0,id)

file_chapters={}; seen={}
for source in inventory['items']:
 if source['kind']!='file':continue
 source['lessons']=associated(source['text'])
 ext=Path(source['path']).suffix
 # Generated build metadata and library output are preserved in full in the inventory.
 # Their syntax is studied via JSON/CSS/SCSS lessons, not thousands of repeated rules.
 if ext in {'.map'} or Path(source['path']).name=='package-lock.json' or ('customizare_bootstrap.css' in source['path']):
  source['classification']='generated-output';continue
 if source['sha256'] in seen:
  source['lessons']=seen[source['sha256']];source['classification']='identical-copy';continue
 if ext not in {'.js','.css','.scss','.html','.ejs','.sql','.json','.vtt','.webmanifest','.txt','.md'}:continue
 if ext not in file_chapters:
  file_chapters[ext]=chapter('source-'+ext[1:],'Codul profesoarei · '+ext.upper().lstrip('.'),'Lectură pe fragmente: toate liniile sursei, inclusiv backup și variantele pentru lecțiile următoare.','Inventarul fișierelor locale ale profesoarei','file')
 lines=source['text'].splitlines();ids=[]
 for start in range(0,len(lines),45):
  fragment='\n'.join(lines[start:start+45])
  if not fragment.strip():continue
  id='source-'+source['sha256'][:12]+'-'+str(start+1)
  end=min(start+45,len(lines));location=f'{source["path"]}, liniile {start+1}–{end}'
  make_lesson(file_chapters[ext],id,f'{Path(source["path"]).name} · {start+1}–{end}',fragment,location,associated(fragment))
  ids.append(id)
 source['lessons']=ids+source['lessons'];seen[source['sha256']]=source['lessons']

Path('site/sources.js').write_text('window.TW_SOURCES = '+json.dumps(inventory,ensure_ascii=False)+';\n',encoding='utf8')
report=['# Inventarul materialelor','',f"{len(inventory['files'])} fișiere inventariate; {len(inventory['items'])} surse text/slide-uri.",'',
 'Traseul de învățare este enumerat în [CURRICULUM.md](CURRICULUM.md). Corespondențele dintre sintaxa detectată și lecțiile active sunt în [SYNTAX.md](SYNTAX.md).','',
 'Dana nu este parcurs. Recordings nu este transcris. Bibliotecile instalate și metadatele Git nu sunt parcurse.','',
 'Materialele originale sunt referințe opționale, separate de capitole și progres. Tabelul de mai jos dovedește păstrarea surselor și oferă asocieri de consultare; simpla prezență a unui fișier în bibliotecă nu înseamnă că fiecare noțiune a fost exersată.','',
 'Fișierele generate Bootstrap, source maps și package-lock sunt păstrate în biblioteca de surse. Sintaxa se învață prin exercițiile de HTML, CSS, SCSS și JSON, fără multiplicarea lecțiilor pentru fiecare regulă generată.','',
 '| Sursa | Tip | Referințe și lecții asociate |','| --- | --- | --- |']
for x in inventory['items']:
 report.append('| '+x['title'].replace('|','\\|')+' | '+x.get('classification',x['kind'])+' | '+', '.join(x['lessons'])+' |')
Path('COVERAGE.md').write_text('\n'.join(report),encoding='utf8')
