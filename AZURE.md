# Tehnici Web pe Azure

CSS-ul și imaginile responsive pentru Sweet Corner se pregătesc cu `npm run build:project` în GitHub Actions, înainte de teste și împachetare. După modificarea SCSS-ului sau imaginilor sursă, aceeași comandă regenerează fișierele local. Pornirea serverului de curs și accesarea `/project/` folosesc fișierele deja pregătite, fără compilare Sass sau procesare Sharp. Aplicația demonstrativă și baza ei de antrenament se inițializează în continuare numai la prima accesare a `/project/`.

Cursul este la [tw.infoid26.ro](https://tw.infoid26.ro/), pe App Service Linux `infoid26`, în `infoid_group`, regiunea Italy North. Repository: `infoid26/TehniciWeb`, ramura `main`.

Aplicația folosește Node 24, `npm start`, `NODE_ENV=production`, portul `PORT` furnizat de Azure și bind `0.0.0.0`. Health check: `/api/health`. Build-ul se face în Linux; nu publica `node_modules` de Windows.

SQL/PGlite, Sass și EJS rulează în browser. Node și Express folosesc un microVM nou la fiecare verificare prin grupul **Azure Sandboxes `tw-labs`**. Imaginea completă și conectarea identității sunt pregătite în cod, dar necesită activare și testare live. Pașii și limitele sunt în [evaluator/README.md](evaluator/README.md).

Până la configurare, `labs: not-configured` și răspunsul 503 pentru Node/Express sunt comportamentul corect. App Service nu execută codul studentului în production. `labs: remote` indică doar configurația.

Workflow-ul App Service instalează dependențele, verifică lecțiile/evaluatorul și include CLI-ul ACA Microsoft cu versiune și SHA-256 fixe. Workflow-ul separat pentru imagine este manual. Nicio publicare de imagine, configurare Azure sau atribuire de rol nu a fost efectuată automat în această etapă.

Proiectul Sweet Corner se deschide la `/project/`; păstrează propriile date demonstrative. Poate folosi PGlite în memorie sau o bază PostgreSQL dedicată prin `DATABASE_URL`. Nu conecta baza unei alte aplicații și nu folosi contul bazei pentru codul elevilor.

Verificări: `npm run check`, `npm run check:learning`, `npm run check:coverage`, `npm run check:curriculum`, `npm run check:azure`, `npm run check:evaluator`, `npm run check:sandboxes`, `npm run check:project`.
