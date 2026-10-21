# Sweet Corner

Referință educațională cu identificatori în engleză, construită după funcționalitățile exemplului profesoarei.
Pornește din proiectul TehniciWeb cu `npm start` și deschide `/project/`.
Pentru rulare separată: instalează dependențele declarate și rulează `node app.js`.
Fără DATABASE_URL folosește PostgreSQL în memorie prin PGlite. Datele revin la seed la repornire.
Pentru PostgreSQL extern pregătește o bază de antrenament cu `data/products.sql` și setează DATABASE_URL.
Schema `users.sql` reproduce structura de utilizatori/accesări din material, fără a inventa autentificare care nu este implementată în exemplu.
SCSS este compilat cu Sass, iar imaginile WebP sunt generate cu sharp.
