"""Generate learner documentation for the published course."""
import json
from pathlib import Path

course=json.loads(Path('site/course.js').read_text(encoding='utf8').split(' = ',1)[1].rstrip(';\n'))
chapters=course['chapters']
total=sum(len(c['lessons']) for c in chapters)
exam=json.loads(Path('site/exam-data.js').read_text(encoding='utf-8').split(' = ',1)[1].rstrip(';\n'))
exam_total=len(exam['tickets'])
exam_counts={category:sum(ticket['category']==category for ticket in exam['tickets']) for category in ['css','server','client']}

Path('README.md').write_text(f'''# Tehnici Web · INFO ID 26

Cursul este disponibil la **[tw.infoid26.ro](https://tw.infoid26.ro/)**.

{total} de lecții în {len(chapters)} de capitole, cu explicații în română și exerciții pentru browser, server și SQL. Înveți să construiești un site de la documentul HTML până la pagini generate din date. Pentru exercițiile din browser nu ai nevoie de fișiere externe: datele și fișierele virtuale sunt furnizate. Explicațiile și întrebările sunt în română; codul și datele exemplelor sunt în engleză.

Provocările de aplicare cer alegerea unei soluții, justificarea ei și identificarea unui contraexemplu: picture sau img, selectori combinați, tipuri, valori absente, momentele evenimentelor, validarea rutelor și interogări SQL. Ele apar după bazele relevante, fără a le înlocui.

Traseul introduce bazele înaintea aplicațiilor: sintaxă și exemple mici, apoi combinații. Fiecare capitol are un punct de pornire explicat și legături către bazele necesare. La SQL, datele și rezultatele sunt tabele vizibile; comenzile care pregătesc laboratorul sunt opționale. Metoda de predare este descrisă în [PEDAGOGY.md](PEDAGOGY.md).

Exemplele de integrare arată pregătirea Node.js, PostgreSQL și publicarea unei aplicații proprii. Pașii marcați Terminal sunt opționali și explică fișierele pe care le creezi pe calculator. Nu presupun accesul la repository-ul platformei. [Proiect Website](https://tw.infoid26.ro/project/) rămâne în română și nu este o condiție pentru curs.

[Simulare Examen](https://tw.infoid26.ro/examen) oferă {exam_total} de bilete complete: {exam_counts['css']} CSS, {exam_counts['server']} Node + EJS și {exam_counts['client']} BD + JavaScript client. Fiecare bilet are două cerințe stabilite, cu date și fișiere furnizate; bonusul continuă biletul de BD + JavaScript client. Biletele combină obiective practice; unele cerințe apar în mai multe bilete, în combinații diferite. Biletele se marchează ca parcurse numai după predarea tuturor probelor simulării, inclusiv bonusul. Abandonarea nu consumă bilete. Istoricul contului este separat de curs și se sincronizează între dispozitive. După parcurgerea tuturor biletelor unei probe, pool-ul acelei probe se reia automat. Simularea are pregătire de 5 minute, editor în browser, cronometru comun probei și rezultate numai după terminarea examenului. Progresul simulării este separat de progresul cursului.

Materia include HTML, formulare, media, MathML, CSS, responsive, animații, JavaScript, expresii regulate, date calendaristice, DOM, stocare, JSON, SCSS, Node, HTTP, Express, EJS și PostgreSQL. SQL include crearea tabelelor și tipurilor, constrângeri, chei străine, vectori, filtrare, agregare, relații între tabele și modificarea datelor.

Fiecare lecție are explicație, exemplu, întrebare și exercițiu. **Indiciu** și **Rezolvare** sunt deasupra editorului și se deschid independent, ca în PA. Progresul și codul se păstrează în browser. Conectarea Microsoft universitară și sincronizarea automată sunt pregătite în cod; activarea este descrisă în [ACCOUNTS.md](ACCOUNTS.md).

[CURRICULUM.md](CURRICULUM.md) enumeră capitolele și lecțiile. [SYNTAX.md](SYNTAX.md) leagă sintaxa identificată în materiale de exemplele lecțiilor active. Platforma conține explicații și exerciții independente, fără slide-uri, fișiere sau imagini din materialele profesoarei.

SQL folosește PostgreSQL prin PGlite, într-un worker din browser, cu date de antrenament resetate pentru fiecare verificare. SCSS și EJS sunt compilate tot în browser. Laboratoarele Node și Express au nevoie de serviciul de evaluare al platformei; găzduirea statică singură nu execută un server Node.

Configurarea aplicației existente pe Azure și starea evaluatorului Node/Express sunt descrise în [AZURE.md](AZURE.md).

Verificări pentru atelier: `npm run check:progression`, `npm run check:workshop`, `npm run check:exam`, `npm run check:learning` și `npm run check:curriculum`. Verificările automate nu înlocuiesc comparația vizuală și testul conexiunii Azure live.

Documentație oficială pentru pașii de configurare: [Node.js](https://nodejs.org/en/download), [Express și EJS](https://expressjs.com/en/5x/guide/using-template-engines/), [pg Pool](https://node-postgres.com/features/pooling), [scheme PostgreSQL](https://www.postgresql.org/docs/current/ddl-schemas.html), [Node în App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs), [TLS PostgreSQL Azure](https://learn.microsoft.com/en-us/azure/postgresql/security/security-tls-how-to-connect).
''',encoding='utf8')

lines=['# Programa cursului','',f'{len(chapters)} de capitole; {total} de lecții cu exerciții.','',
       'Fiecare legătură deschide o lecție din curs.','']
for c in chapters:
 lines.extend([f"## {c['title']} · {len(c['lessons'])} lecții",'',c['subtitle'],''])
 for l in c['lessons']:
  lines.append(f"- [{l['title']}](https://tw.infoid26.ro/#lectie/{l['id']}/0)")
 lines.append('')
Path('CURRICULUM.md').write_text('\n'.join(lines),encoding='utf8')
