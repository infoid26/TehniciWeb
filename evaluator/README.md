# Evaluator Node.js și Express

Serviciu de evaluare pentru exerciții Node.js, Express, EJS și Sass. Fiecare verificare rulează într-un mediu Azure izolat, fără acces la datele conturilor sau la secretele aplicației.

Execuția are limite de timp, memorie și dimensiune a datelor. Mediul este eliminat după verificare, inclusiv în caz de eroare. Evaluările concurente sunt limitate, iar o eroare de eliminare suspendă evaluările noi până la intervenție.

Costurile de calcul și stocare depind de configurația serviciului Azure.
