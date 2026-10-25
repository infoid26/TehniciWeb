# Tehnici Web · INFO ID 26

Cursul este disponibil la **[tw.infoid26.ro](https://tw.infoid26.ro/)**.

827 de lecții în 42 de capitole, cu explicații în română și exerciții pentru browser, server și SQL. Înveți să construiești un site de la documentul HTML până la pagini generate din date. Nu ai nevoie de proiectul profesoarei: exercițiile includ structura, fișierele, datele și schemele SQL necesare.

Atelierul Dulcelind adaugă pregătirea Node.js, PostgreSQL local, schema reală și publicarea pe Azure. Exemplele folosesc rutele și câmpurile cofetăriei. Pașii de terminal și cloud se fac pe calculatorul propriu; exercițiile din browser rămân izolate.

Materia include HTML, formulare, media, MathML, CSS, responsive, animații, JavaScript, expresii regulate, date calendaristice, DOM, stocare, JSON, SCSS, Node, HTTP, Express, EJS și PostgreSQL. SQL include crearea tabelelor și tipurilor, constrângeri, chei străine, vectori, filtrare, agregare, relații între tabele și modificarea datelor.

Fiecare lecție are explicație, exemplu, întrebare și exercițiu. **Indiciu** și **Rezolvare** sunt deasupra editorului și se deschid independent, ca în PA. Progresul și codul se păstrează în browser. Conectarea Microsoft universitară și sincronizarea automată sunt pregătite în cod; activarea este descrisă în [ACCOUNTS.md](ACCOUNTS.md).

[CURRICULUM.md](CURRICULUM.md) enumeră capitolele și lecțiile. [SYNTAX.md](SYNTAX.md) leagă sintaxa identificată în materiale de exemplele lecțiilor active. Platforma conține explicații și exerciții independente, fără slide-uri, fișiere sau imagini din materialele profesoarei.

SQL folosește PostgreSQL prin PGlite, într-un worker din browser, cu date de antrenament resetate pentru fiecare verificare. SCSS și EJS sunt compilate tot în browser. Laboratoarele Node și Express au nevoie de serviciul de evaluare al platformei; găzduirea statică singură nu execută un server Node.

Configurarea aplicației existente pe Azure și starea evaluatorului Node/Express sunt descrise în [AZURE.md](AZURE.md).

Verificări pentru atelier: `npm run check:workshop`, `npm run check:learning` și `npm run check:curriculum`. Verificările automate nu înlocuiesc comparația vizuală și testul conexiunii Azure live.

Documentație oficială pentru pașii de configurare: [Node.js](https://nodejs.org/en/download), [Express și EJS](https://expressjs.com/en/5x/guide/using-template-engines/), [pg Pool](https://node-postgres.com/features/pooling), [scheme PostgreSQL](https://www.postgresql.org/docs/current/ddl-schemas.html), [Node în App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs), [TLS PostgreSQL Azure](https://learn.microsoft.com/en-us/azure/postgresql/security/security-tls-how-to-connect).
