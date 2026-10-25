# Cofetăria Dulcelind

Integrare Node.js + Express + EJS a variantei profesoarei din `exemplu_cofetarie_19_oct`. Șabloanele, textele, CSS-ul distribuit, scripturile și resursele sunt copiate din original. Sursa originală nu este modificată. URL-urile locale sunt adaptate la `/project/`.

Pornire: `npm start` din rădăcina repository-ului. Curs: `http://127.0.0.1:8088/`. Cofetărie: `http://127.0.0.1:8088/project/`. Port alternativ: `node scripts/serve.mjs 8090`.

## PostgreSQL Azure

Aplicația reutilizează conexiunea existentă a proiectului: `AZURE_POSTGRESQL_HOST`, `AZURE_POSTGRESQL_PORT`, `AZURE_POSTGRESQL_USER`, `AZURE_POSTGRESQL_PASSWORD`, `AZURE_POSTGRESQL_DATABASE`. TLS verifică certificatul serverului. Nu sunt necesare parole în Git sau o instalare PostgreSQL locală.

Tabelele originale `prajituri`, `utilizatori`, `accesari` și tipurile ENUM sunt create în schema separată `dulcelind`, în aceeași bază Azure. Schema de progres a cursului nu este modificată. La prima accesare a catalogului se importă cele 21 de produse doar dacă tabelul lipsește; accesările următoare păstrează datele existente. Inițializarea folosește tranzacție și blocare PostgreSQL. Contul Azure trebuie să poată crea schema și tabelele.

Alternativ: `PROJECT_DATABASE_URL` (sau `DATABASE_URL`) pentru o altă bază PostgreSQL; aceeași schemă `dulcelind` este folosită. `npm run setup:project-db` permite inițializarea explicită folosind setările din mediu. Nu rula manual scriptul SQL original peste o bază existentă: conține DROP TYPE.

În Azure/producție PostgreSQL este obligatoriu. Fără configurare, catalogul raportează eroare; nu folosește PGlite. PGlite rămâne disponibil exclusiv pentru demonstrația locală și testele fără conexiune configurată. `/project/health` verifică baza și întoarce motorul folosit și numărul de produse, fără date de conectare.

## Aspect și pornire rapidă

Cursul nu încarcă aplicația EJS sau baza de date până la accesarea `/project/`. Nu se compilează Sass sau imagini la pornire. `npm run build:project` pregătește imaginile și stilurile; CSS-ul Bootstrap original este păstrat. După modificarea intenționată a personalizării Bootstrap se poate folosi `npm run build:project -- --styles`.

Înregistrarea și Contact sunt linkuri `#` în original, fără backend implementat. Schema utilizatorilor este inclusă, dar nu adaugă un flux de autentificare absent din exemplul profesoarei. Fonturile Google, pictogramele CDN și videoclipurile YouTube au nevoie de internet.

Verificări: `npm run check:project`, `node scripts/check_project_database.mjs`, `npm run check:project:browser` (necesită acces la browser).