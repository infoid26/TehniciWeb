# Sweet Corner — funcționalități

Implementare independentă, cu conținut, imagini și animație proprii. Nu distribuie proiectul sau fișierele didactice originale.

| Zonă | Comportament |
| --- | --- |
| Navigare | Meniu cu submeniuri, ancore către secțiuni, buton mobil și întoarcere sus |
| Acasă | Prezentare, oferte, tipuri de produse, galerie responsive, anunțuri, orar săptămânal, FAQ, rețete selectabile într-un iframe, video cu subtitrări și MathML |
| Catalog | Query pentru tipul produsului, prefix de nume, preț minim/maxim, intervale calorice [0,350), [350,700), [700,∞), categorie, ingrediente și opțiune fără zahăr |
| Sortare | Preț și nume, crescător sau descrescător; resetarea restabilește toate filtrele |
| Calcul | Alt+C sau buton: suma produselor vizibile, afișată două secunde |
| Selecție | Bife pe catalog/detaliu, contor și păstrare în localStorage între pagini |
| Preferințe | Temă luminoasă/întunecată persistentă; banner de cookies și acceptare memorată |
| Detaliu | Nume, descriere, preț, gramaj, calorii, ingrediente, categorie, opțiune dietetică, data adăugării, imagine |
| Pagini | Despre cu prezentare/istoric/motivație/galerie și contact demonstrativ |
| Backend | Express, fragmente EJS, JSON, compilare Sass, imagini WebP prin Sharp, date PostgreSQL/PGlite și query-uri parametrizate |
| Erori | 400 pentru cereri invalide/.ejs, 403 pentru directoare assets, 404 pentru resurse absente, 500 pentru erori interne |

Nu există plăți sau comenzi reale. Navigarea, filtrarea și selecția se pot folosi fără cont. Tabelele SQL de utilizatori/vizite sunt exemple de schemă, fără un sistem de autentificare prezentat ca funcțional.

`npm run check:project` verifică rutele și logica interacțiunilor fără browser. `npm run check:project:browser` verifică și interfața/viewporturile într-un browser instalat. Animația proprie se regenerează cu `npm run build:project-video`.
