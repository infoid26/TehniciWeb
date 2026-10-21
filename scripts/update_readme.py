"""Generate learner documentation for the published course."""
import json
from pathlib import Path

course=json.loads(Path('site/course.js').read_text(encoding='utf8').split(' = ',1)[1].rstrip(';\n'))
chapters=course['chapters']
total=sum(len(c['lessons']) for c in chapters)
readings=sum(len(c['lessons']) for c in course['references'])
Path('README.md').write_text(f'''# Tehnici Web · INFO ID 26

Cursul este disponibil la **[tw.infoid26.ro](https://tw.infoid26.ro/)**.

{total} de lecții în {len(chapters)} de capitole, cu explicații în română și cod în engleză. Înveți să construiești un site de la documentul HTML până la pagini generate din date. Nu ai nevoie de proiectul profesoarei: exercițiile includ structura, fișierele, datele și schemele SQL necesare.

Materia include HTML, formulare, media, MathML, CSS, responsive, animații, JavaScript, expresii regulate, date calendaristice, DOM, stocare, JSON, SCSS, Node, HTTP, Express, EJS și PostgreSQL. SQL include crearea tabelelor și tipurilor, constrângeri, chei străine, vectori, filtrare, agregare, relații între tabele și modificarea datelor.

Fiecare lecție are explicație, exemplu, întrebare și exercițiu. **Indiciu** și **Rezolvare** sunt deasupra editorului și se deschid independent, ca în PA. Progresul și codul se păstrează în browser; exportul și importul permit transferul lor între dispozitive.

Cele {readings} materiale de referință sunt separate de traseul de învățare. Biblioteca păstrează slide-urile și codul original pentru consultare; citirea lor nu înlocuiește exercițiile practice.

[CURRICULUM.md](CURRICULUM.md) enumeră capitolele și lecțiile. [SYNTAX.md](SYNTAX.md) leagă sintaxa identificată în materiale de exemplele lecțiilor active. [COVERAGE.md](COVERAGE.md) inventariază materialele originale și legăturile lor către curs. Folderul Dana este exclus.

SQL folosește PostgreSQL prin PGlite, într-un worker din browser, cu date de antrenament resetate pentru fiecare verificare. SCSS și EJS sunt compilate tot în browser. Laboratoarele Node și Express au nevoie de serviciul de evaluare al platformei; găzduirea statică singură nu execută un server Node.

Configurarea aplicației existente pe Azure și starea evaluatorului Node/Express sunt descrise în [AZURE.md](AZURE.md).
''',encoding='utf8')

lines=['# Programa cursului','',f'{len(chapters)} de capitole; {total} de lecții cu exerciții.','',
       'Fiecare legătură deschide o lecție din curs. Materialele originale sunt disponibile separat, pentru consultare.','']
for c in chapters:
 lines.extend([f"## {c['title']} · {len(c['lessons'])} lecții",'',c['subtitle'],''])
 for l in c['lessons']:
  lines.append(f"- [{l['title']}](https://tw.infoid26.ro/#lectie/{l['id']}/0)")
 lines.append('')
Path('CURRICULUM.md').write_text('\n'.join(lines),encoding='utf8')

project='''# Sweet Corner

Proiect educațional pentru [cursul Tehnici Web](https://tw.infoid26.ro/), cu nume de fișiere și identificatori în engleză.

Exemplele arată cum construiești pagini cu produse, filtre, sortare, coș, galerie, temă și preferințe. Interfața folosește HTML, CSS/SCSS și JavaScript; paginile dinamice folosesc Node, Express, EJS și PostgreSQL.

Datele de antrenament sunt în `data/products.sql`, iar structura pentru utilizatori și accesări este în `data/users.sql`. Lecțiile oferă propriile date și cerințe, astfel încât proiectul nu este necesar pentru parcurgerea cursului.
'''
Path('project-reference/README.md').write_text(project,encoding='utf8')
