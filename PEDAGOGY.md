# Predarea progresivă a materiei Tehnici Web

Scopul este materia profesoarei și tehnicile necesare proiectului de cofetărie: HTML, CSS, JavaScript, DOM, JSON, SCSS, Node, Express, EJS și PostgreSQL, inclusiv detaliile existente în programă. Cursul folosește exemple independente; demonstrația profesoarei rămâne separată la `/project/`, în română.

## Ordinea de învățare

O noțiune începe cu sensul ei, un exemplu mic și explicarea simbolurilor. Urmează o întrebare de înțelegere și un exercițiu pe date furnizate. Integrarea combină doar noțiuni introduse anterior. Capitolele declară bazele necesare și oferă legături de revenire; fiecare lecție oferă acces la pasul anterior.

La începutul SQL se citește un tabel cu trei coloane și trei produse. Urmează SELECT *, o coloană, două coloane, WHERE, ORDER BY și LIMIT. Abia apoi apar CREATE TABLE și modificările datelor; constrângerile, vectorii și integrarea pg au pași ulteriori. Interogările fără ORDER BY sunt evaluate independent de ordinea rândurilor.

Datele inițiale și rezultatele SQL sunt tabele HTML, nu obiecte JSON. Previzualizările sunt generate din aceeași bază de antrenament folosită de evaluator. SQL-ul pregătirii este ascuns într-o secțiune opțională. Comenzile tehnice care inspectează schema sunt executate de verificare, fără a fi cerute în primele exerciții CREATE TABLE.

Sintaxa CSS precedă teoria aplicată a aspectului. Accesul la vectori precedă folosirea input[0]; obiectele precedă lecțiile care le folosesc; reduce precedă aplicațiile cu rest; JSON precedă stocarea; promisiunile și await precedă citirea asincronă; SQL precedă exercițiul conexiunii pg.

## Surse pentru metoda de predare

Au fost consultate [MDN — structura pentru începători](https://developer.mozilla.org/en-US/docs/Learn_web_development), [MDN — recomandări pentru predare](https://developer.mozilla.org/en-US/docs/Learn_web_development/Educators), [SQLBolt — prima lecție SELECT](https://sqlbolt.com/lesson/select_queries_introduction) și [PostgreSQL — concepte de bază](https://www.postgresql.org/docs/current/tutorial-concepts.html). Sunt repere pentru ordinea predării; nu înlocuiesc programa profesoarei și nu introduc tehnologii suplimentare.

## Verificare

`npm run check:progression` verifică punctele de intrare ale capitolelor, ordinea dependențelor, exercițiile SQL și concordanța dintre tabelele afișate și datele PostgreSQL. `check:learning` verifică afișarea tuturor exercițiilor; `check:curriculum` verifică păstrarea sintaxei din programă. Aceste teste nu demonstrează automat calitatea pedagogică a fiecărei explicații. Un test vizual în browser și parcurgerea cu un începător rămân necesare.

## Pregătirea evaluării

Pagina separată /examen explică prezentarea orală și examenul practic pe baza fotografiilor furnizate. Sursa anunțului de prezentare este ID 2025–2026; condițiile pentru seria actuală trebuie confirmate prin anunțul profesoarei. Banca de antrenament diferențiază fundamentele, exercițiile integrate și explicațiile orale. Nu prezintă adaptările drept subiecte oficiale și nu acordă note oficiale.

Exercițiile integrate includ galerie filtrată pe intervale de minute, erori din JSON, oferte cu time, radio și stocare, slider și contor după reîncărcare, precum și traseul PostgreSQL–Express–EJS. Datele, template-urile și fișierele sunt furnizate virtual. Stocarea exercițiilor DOM este izolată de progresul cursului.

ID-urile lecțiilor existente sunt păstrate; numai exercițiile corectate își pot cere reverificarea soluției. Progresul paginii de examen se salvează sub o cheie separată și nu modifică progresul cursului.

check:exam rulează din terminal verificări de structură, soluții Node/Express/SQL/JavaScript, compilare SCSS/EJS și rute HTTP. Nu lansează un browser și nu confirmă aspectul sau interacțiunile DOM. check:exam:browser este verificarea separată în browser, de rulat numai când lansarea lui este autorizată și disponibilă.

## Transfer și raționament

Provocările din curs vin după noțiunile pe care le folosesc. Chestionarul cere o alegere într-o situație concretă, cu alternative plauzibile. Exercițiul aplică alegerea pe date furnizate. Explicația soluției arată și un contraexemplu: de ce o alternativă aparent potrivită ar eșua. Nu presupunem JavaScript în provocările din HTML.

Alegerea picture/img este exersată în ambele sensuri: alt cadraj condiționat de viewport, respectiv aceeași compoziție la rezoluții diferite. Selectorii sunt testați și pe elemente apropiate care trebuie excluse; datele de intrare includ valori absente, zero și cazuri fără rezultate. O verificare automată a codului nu este prezentată drept notare a explicației în limbaj natural.

## Simulare în browser

Pagina de examen arată regulile și un singur flux de simulare, fără listă de exerciții. Fiecare probă are extragere, pregătire de cel mult 5 minute, lucru cronometrat și predare. În pregătire editorul este numai pentru citire; la predare răspunsul este blocat. Termenele și răspunsurile sunt păstrate la reîncărcare, fără să se reseteze timpul. Soluțiile sunt afișate numai după încheierea simulării.

Mediul, fișierele și datele sunt oferite de platformă. Nu sunt necesare instalări pe calculator pentru simulare. Programele necesare examenului real sunt explicate separat. Etapele păstrează timpii documentați; cerințele sunt adaptări independente. Rezultatele testelor nu sunt o notă oficială și nu înlocuiesc justificarea orală.
