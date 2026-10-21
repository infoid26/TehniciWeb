from pathlib import Path
Path('README.md').write_text('''# Tehnici Web · INFO ID 26

Platformă de studiu după materialele Irinei Ciocan. Explicații în română, codul exercițiilor în engleză, interfață dark și traseu central inspirat de PA. Noduri mari, editor CodeMirror cu sintaxă colorată, numere de linie și completare; numele de cod sunt evidențiate în cerințe.

## Pornire

Din acest folder rulează `npm start`, apoi deschide http://127.0.0.1:8088/ pentru curs și http://127.0.0.1:8088/project/ pentru proiectul de referință. Dependențele sunt deja instalate. Pe alt calculator folosește `pnpm install --frozen-lockfile` înainte de pornire.

Serverul local este necesar pentru laboratoarele SCSS, EJS, Node, Express și SQL. Deschiderea directă a index.html permite numai partea de browser. Prima deschidere a proiectului poate dura câteva secunde pentru compilarea SCSS, generarea imaginilor și inițializarea bazei de antrenament.

## Conținut

21 de capitole și 476 de lecții. Cursul se parcurge integral fără proiectul profesoarei sau alte fișiere externe. Fiecare cerință include structura, datele, schema SQL sau fragmentele necesare.

- **476 de lecții de bază, detaliu și proiect**: fișiere, browser, HTML, CSS, MathML, JavaScript, DOM, stocare, JSON, SCSS, Node, Express, EJS și PostgreSQL. Cerința indică dacă scrii cod executat, o declarație CSS verificată sau un răspuns de interpretare.
- **604 materiale opționale de referință** sunt păstrate separat de traseu și de progres. Nu au întrebări de memorare a fișierelor și nu trebuie parcurse pentru finalizarea cursului.

Fiecare lecție are explicație, exemplu, întrebare, exercițiu, indiciu și soluție. Butoanele „Indiciu” și „Rezolvare” sunt deasupra editorului, se deschid independent și folosesc comportamentul din PA. Codul de lucru și proiectul nou folosesc nume în engleză.

Biblioteca de surse permite căutarea în prezentări și fișiere. Păstrează cele **435 de slide-uri**, cu ilustrațiile extrase, și include integral în lecții **68 de fișiere de studiu**, inclusiv copii identice, backup, variante din `lectiile_urmatoare`, resursele pentru examen, SQL și WebVTT. `COVERAGE.md` leagă materialele de lecții.

**Dana nu este parcurs.** `Recordings` nu este transcris. Implementările bibliotecilor din `node_modules` nu sunt transformate în lecții. Fișierele generate Bootstrap, source maps și package-lock sunt păstrate în biblioteca de surse, fără mii de lecții repetitive despre aceleași reguli CSS/JSON.

Inventarul verifică păstrarea surselor fără linii lipsă. Acest lucru nu demonstrează singur stăpânirea fiecărei construcții; lecțiile de lectură și cele practice sunt diferențiate explicit.

## Editor, evaluare și progres

- HTML/CSS: elemente și stiluri calculate în iframe; lățimi distincte pentru responsive. Nu este un validator HTML complet.
- JavaScript: `solve(input)` într-un Web Worker cu limită de timp.
- DOM: iframe separat, acțiuni simulate și limitarea iterațiilor buclelor prin AST.
- JSON: parsare reală și comparare structurală.
- SCSS/EJS: compilare Sass și randare EJS reale, inclusiv previzualizare.
- Node: modulele laboratorului și fișiere virtuale, fără scriere în documentele personale.
- Express: aplicația reală primește obiecte HTTP Node pentru testarea rutelor, fără un port separat pentru fiecare exercițiu.
- SQL: PostgreSQL în memorie prin PGlite, cu bază nouă pentru fiecare verificare.

Lecțiile de detaliu CSS precizează când verifică declarația, nu layout-ul combinat. Exercițiile pentru extensii MathML istorice verifică structura fără să pretindă redare nativă completă.

Progresul, codul și ultima lecție se salvează în localStorage, separat de PA. Editarea codului invalidează verificarea anterioară. Exportul/importul oferă o copie de siguranță; nu există sincronizare între dispozitive.

## Proiectul de referință

`project-reference/` conține Sweet Corner: pagini Express/EJS, produse și detalii din PostgreSQL, galerie și imagini responsive generate prin sharp, video și subtitrări, meniu cu submeniu și variantă mobilă, FAQ, tabel de program, filtre combinate, sortare, totalul produselor vizibile, coș local, temă și banner de preferințe.

Implicit folosește PostgreSQL în memorie, cu date resetate la repornire. Pentru PostgreSQL separat pregătește o bază de antrenament cu `project-reference/data/products.sql` și setează `DATABASE_URL`. Schema utilizatorilor/accesărilor din material este inclusă în engleză; nu este adăugat un sistem de autentificare care nu există în exemplul studiat.

## Generare și verificare

```powershell
python scripts/build_course.py
npm run check
npm run check:coverage
npm run check:server
npm run check:browser
```

Python este folosit numai pentru generarea conținutului. Regenerarea inventarului necesită acces la folderul original al materialelor.

Verificat în această sesiune: structura și sintaxa cursului, **275 de cazuri JavaScript**, **68 de exerciții de server cu controale negative**, integrarea paginilor, datelor, template-urilor, compilării, imaginilor și API-ului, precum și integritatea celor 435 de slide-uri și a fragmentelor celor 68 de fișiere. Testele HTTP au rulat cu obiecte HTTP Node în proces: mediul blochează conexiunile TCP locale.

**Verificarea finală în browser rămâne neexecutată:** mediul nu permite pornirea Edge. `check:browser` este disponibil pentru verificarea soluțiilor HTML/CSS/DOM, aspectului desktop/mobil, navigării, editorului, persistenței și interacțiunilor proiectului. Aceste verificări nu sunt declarate ca trecute.

Nu s-a creat niciun commit și nu s-a făcut deploy. Materialele originale sunt incluse pentru studiul local; verifică dreptul de redistribuire înaintea publicării.
''',encoding='utf8')
