# Tehnici Web pe Azure

CSS-ul și imaginile responsive pentru Cofetăria Dulcelind se pregătesc cu `npm run build:project` în GitHub Actions, înainte de teste și împachetare. După modificarea SCSS-ului sau imaginilor sursă, aceeași comandă regenerează fișierele local. Pornirea serverului de curs și accesarea `/project/` folosesc fișierele deja pregătite, fără compilare Sass sau procesare Sharp. Aplicația se încarcă numai la prima accesare a `/project/`; baza de date se inițializează doar la accesarea catalogului sau a unui produs.

Cursul este la [tw.infoid26.ro](https://tw.infoid26.ro/), pe App Service Linux `infoid26`, în `infoid_group`, regiunea Italy North. Repository: `infoid26/TehniciWeb`, ramura `main`.

Aplicația folosește Node 24, `npm start`, `NODE_ENV=production`, portul `PORT` furnizat de Azure și bind `0.0.0.0`. Health check: `/api/health`. Build-ul se face în Linux; nu publica `node_modules` de Windows.

SQL/PGlite, Sass și EJS rulează în browser. Node și Express folosesc un microVM nou la fiecare verificare prin grupul **Azure Sandboxes `tw-labs`**. Imaginea completă și conectarea identității sunt pregătite în cod, dar necesită activare și testare live. Pașii și limitele sunt în [evaluator/README.md](evaluator/README.md).

Până la configurare, `labs: not-configured` și răspunsul 503 pentru Node/Express sunt comportamentul corect. App Service nu execută codul studentului în production. `labs: remote` indică doar configurația.

Workflow-ul App Service instalează dependențele, verifică lecțiile/evaluatorul și include CLI-ul ACA Microsoft cu versiune și SHA-256 fixe. Workflow-ul separat pentru imagine este manual. Nicio publicare de imagine, configurare Azure sau atribuire de rol nu a fost efectuată automat în această etapă.

Proiectul Cofetăria Dulcelind se deschide la `/project/`. Reutilizează setările existente `AZURE_POSTGRESQL_*` și aceeași bază Azure, cu tabelele izolate în schema `dulcelind`. TLS verifică certificatul serverului. Alternativ se poate configura `PROJECT_DATABASE_URL` sau `DATABASE_URL`. În producție PostgreSQL este obligatoriu.

Verificări: `npm run check`, `npm run check:learning`, `npm run check:coverage`, `npm run check:curriculum`, `npm run check:azure`, `npm run check:evaluator`, `npm run check:sandboxes`, `npm run check:project`.

Schema `dulcelind` și cele 21 de produse originale se inițializează tranzacțional la prima accesare a catalogului, fără DROP TYPE și fără modificarea tabelelor de progres. Contul bazei trebuie să poată crea schema și tabelele. Inițializarea repetată păstrează datele existente. `/project/health` verifică motorul PostgreSQL și numărul de produse. Detalii: `project-reference/README.md`.
