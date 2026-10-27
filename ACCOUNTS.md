# Conturi Microsoft și progres sincronizat

Implementarea este pregătită în cod. Activarea necesită configurarea Microsoft Entra / App Service și a unei baze PostgreSQL. Publicarea codului singură păstrează cursul în modul anonim, cu progres local.

## Autentificare

Autentificarea folosește modulul integrat **Azure App Service Authentication (Easy Auth)**. Microsoft gestionează parola, MFA, verificarea tokenurilor și sesiunea. Aplicația nu cere parola universitară și nu stochează tokenuri în localStorage.

Serverul acceptă identități `aad` numai când rulează în App Service cu Easy Auth activ. Verifică ID-ul organizației universitare și numele de conectare `preferred_username` / `upn`, cu domeniul exact `s.unibuc.ro` sau `unibuc.ro`. Nu folosește un câmp de email trimis de browser, un email de contact din token sau numele afișat. Guest UPN-urile `#EXT#`, conturile personale și cele din alte organizații sunt respinse. Dacă există claim-ul `acct`, trebuie să fie `0` (membru); identitățile de aplicație sunt respinse când `idtyp` este prezent.

Cheia progresului este perechea **tenant ID + object ID** emisă de Microsoft. Schimbarea adresei de email nu schimbă identitatea progresului. Nu există endpoint pentru a citi progresul altui cont. O cerere rămasă într-o filă după schimbarea contului în altă filă este respinsă.

Nu seta manual `WEBSITE_AUTH_ENABLED` sau `WEBSITE_AUTH_V2_CONFIG_JSON` pentru a simula autentificarea: sunt variabile furnizate de platformă. Serverul Node trebuie accesat numai prin intrarea App Service, unde Azure elimină antetele de identitate provenite de la clienți.

## Configurarea din Azure

1. Deschide [Azure Portal](https://portal.azure.com/) → bara de căutare de sus → caută **App Services** → deschide aplicația **infoid26** → în meniul din stânga, **Settings → Authentication** → **Add identity provider**.
2. Alege **Microsoft**, **Workforce configuration**, o înregistrare nouă cu numele **Tehnici Web INFO ID 26**. Conturi acceptate: **Any Microsoft Entra directory – Multitenant**, fără conturi personale Microsoft. Aplicația este în directorul proprietarului, iar studenții vin din directorul universității.
3. Pentru cursul public, păstrează **Allow unauthenticated access**. Activează HTTPS și token store. Autentificarea este opțională pentru vizitatori; API-ul de progres cere un cont autorizat.
4. În înregistrarea aplicației, platforma **Web**, configurează exact callback-ul `https://tw.infoid26.ro/.auth/login/aad/callback`. Dacă testezi și domeniul Azure, adaugă separat callback-ul lui. Nu adăuga wildcard-uri. Folosește doar `openid`, `profile` și, dacă este necesar, `email`; progresul nu are nevoie de acces la Microsoft Graph, mail sau fișiere.
5. Metadatele OIDC Microsoft consultate la 22 octombrie 2026 pentru [s.unibuc.ro](https://login.microsoftonline.com/s.unibuc.ro/v2.0/.well-known/openid-configuration) și [unibuc.ro](https://login.microsoftonline.com/unibuc.ro/v2.0/.well-known/openid-configuration) indică același tenant: `08a1a72f-fecd-4dae-8cec-471a2fb7c2f1`. Providerul Microsoft trebuie să folosească issuer-ul v2 `https://login.microsoftonline.com/08a1a72f-fecd-4dae-8cec-471a2fb7c2f1/v2.0`. Nu folosi tenant-ul abonamentului personal ca înlocuitor al celui universitar. Reverifică metadatele dacă universitatea își schimbă organizația.
6. Verifică în **Token configuration** existența claim-ului de conectare. Pentru tokenuri v1 poate fi necesar claim-ul opțional `upn`; pentru v2 se folosește `preferred_username`. Absența lui produce refuzul accesului, nu autorizarea pe baza altui email.
7. În **Authentication → Edit authentication settings**, configurează domeniul public ca redirect permis dacă este cerut. Pentru Cloudflare, păstrează domeniul personalizat în App Service și configurează antetele forward ale proxy-ului conform documentației Microsoft. Nu dezactiva nonce, verificarea issuer-ului sau verificarea audienței.

Universitatea poate cere aprobarea unui administrator pentru aplicații externe. Această regulă nu poate fi ocolită prin codul site-ului. În acel caz, se cere aprobarea înregistrării aplicației; nu se colectează parole și nu se relaxează restricțiile.

## Baza pentru progres

În configurația actuală, baza `infoid-db`, rămasă nefolosită de vechiul Website, este reutilizată pentru progres. Backendul folosește setările existente `AZURE_POSTGRESQL_HOST`, `AZURE_POSTGRESQL_PORT`, `AZURE_POSTGRESQL_USER`, `AZURE_POSTGRESQL_PASSWORD` și `AZURE_POSTGRESQL_DATABASE`, activate explicit prin `PROGRESS_USE_AZURE_POSTGRESQL=true`. Conexiunea impune TLS cu verificarea certificatului, indiferent de valoarea veche `AZURE_POSTGRESQL_SSL`. Pentru alte instalări se poate folosi o bază PostgreSQL dedicată prin `PROGRESS_DATABASE_URL`. Restrânge firewall-ul la adresele de ieșire App Service.

În App Service **infoid26** → meniul **Settings → Environment variables** → **App settings**, adaugă:

| Setare | Valoare |
| --- | --- |
| `AUTH_ENABLED` | `true`, numai după configurarea providerului și a bazei |
| `AUTH_ORIGIN` | `https://tw.infoid26.ro` |
| `AUTH_UNIVERSITY_TENANT_IDS` | `08a1a72f-fecd-4dae-8cec-471a2fb7c2f1` |
| `WEBSITE_AUTH_AAD_ALLOWED_TENANTS` | `08a1a72f-fecd-4dae-8cec-471a2fb7c2f1`, ca restricție suplimentară în Azure |
| `PROGRESS_USE_AZURE_POSTGRESQL` | `true`, pentru setările PostgreSQL existente și baza `infoid-db` |
| `PROGRESS_DATABASE_URL` | Alternativă pentru alte instalări; dacă este setată, are prioritate față de setările Azure existente |

Connection string-ul și secretul providerului rămân exclusiv în Azure. Nu le comite și nu le pune în fișierele site-ului. Folosește TLS cu verificarea certificatului, de exemplu `sslmode=verify-full` și CA-ul cerut de furnizor; nu folosi `rejectUnauthorized: false`. `DATABASE_URL` rămâne exclusiv pentru proiectul demonstrativ, independent de progres.

Tabelul `tw_account_progress` se creează la prima cerere validă; utilizatorul bazei trebuie să poată crea acest tabel în schema sa. Conține identificatorii Microsoft, progresul JSON, versiunea și data ultimei actualizări. Nu stochează parole sau emailuri. Activează backup-ul bazei și verifică restaurarea înainte de utilizarea largă. Costurile bazei sunt separate de App Service; nu este creat niciun serviciu Azure de scripturile acestui proiect.

## Comportament

- Fără conectare: progresul existent rămâne în browser.
- Cu conectare: codul, răspunsurile corecte și lecția curentă se sincronizează automat, cu o scurtă întârziere după modificare. Copia locală este separată pentru fiecare cont.
- La prima conectare, progresul existent în browser se importă automat în cont și se salvează în PostgreSQL. Lecțiile deja existente în cont rămân intacte; se adaugă cele lipsă. Istoricul anonim este marcat cu primul cont care îl preia, pentru a nu fi importat și de un al doilea cont pe același browser. O salvare întreruptă este reluată din copia locală.
- Dacă nu există conexiune, copia locală a contului este păstrată și sincronizarea reîncearcă automat, inclusiv după reîncărcarea paginii. Dacă nu se poate verifica deloc identitatea, site-ul rămâne anonim până la reconectare/reîncărcare.
- Editările în lecții diferite se îmbină. Editările incompatibile în aceeași lecție opresc sincronizarea și păstrează ambele copii. La încărcarea variantei din cont, utilizatorul confirmă și se descarcă întâi un export al variantei locale.
- Închiderea imediată a filei înainte de confirmarea sincronizării poate lăsa modificările doar în copia locală; următoarea conectare de pe acel browser reia salvarea.
- API-ul limitează progresul la 6 MB, codul unei lecții la 100.000 de caractere și lecțiile la cele din curs. Identitatea provine exclusiv de la platformă, iar salvările cer origin-ul public exact și antete de aceeași origine. Răspunsurile private nu sunt cache-uite. În Cloudflare nu aplica reguli „Cache Everything” pentru `/api/*` sau `/.auth/*`.
- Progresul este un ajutor de studiu, nu un catalog de note: rezultatele locale nu sunt o certificare server a rezolvării.

## Deconectare doar de pe site

Butonul Logout trimite un formular POST la `/account/logout`. Serverul verifica originea, expira cookie-ul `AppServiceAuthSession` si fragmentele sale numerotate pentru domeniul curent, apoi raspunde cu 303 catre `/`. Nu apeleaza `/.auth/logout` si nu trimite browserul la deconectarea Microsoft. Cookie-urile Microsoft de pe alte domenii si progresul din PostgreSQL raman intacte. Modificarile inca nesincronizate sunt pastrate in copia locala a contului pentru urmatoarea conectare.

Pastreaza **Allow unauthenticated access** in Easy Auth: fara cookie-ul sesiunii, cursul trebuie sa ramana public, fara autentificare automata. Nu cache-ui `/account/logout`. Endpointul refuza GET si cererile POST din alte origini. `logoutUrl` din API necesita POST.

Dupa publicare, verifica in browserul autentificat: Logout revine la curs cu butonul de conectare; doua refresh-uri pastreaza starea anonima; serviciile Microsoft raman conectate; o noua conectare restaureaza progresul. Testele locale verifica raspunsurile HTTP si expirarea cookie-urilor, dar nu executa modulul Easy Auth din Azure.

## Istoricul biletelor de examen

Biletele predate sunt înregistrate în `tw_account_exam_tickets`, separat de lecții, folosind tenant-ul și identificatorul Microsoft ale utilizatorului. Tabela se creează automat în aceeași bază de date configurată pentru progres. Nu sunt necesare setări de conectare noi.

`GET /api/exam/tickets` citește istoricul contului. Cererile POST aleg un bilet neparcurs sau înregistrează predarea, după verificarea identității, originii și antetelor contului. O predare repetată este idempotentă; predările simultane nu suprascriu alte bilete. Extragerea singură nu consumă biletul. Biletele folosesc identificatori stabili, iar numerele celor existente sunt păstrate la extinderea băncii.

Browserul păstrează separat pentru fiecare cont predările încă nesincronizate și reia salvarea înaintea următoarei extrageri sau la reîncărcare. Dacă istoricul contului nu poate fi verificat, extragerea este oprită, pentru a evita repetarea pe baza unui istoric incomplet. La epuizarea unei categorii se afișează un mesaj; nu se resetează automat istoricul. Fără autentificare, istoricul rămâne numai în browser și nu este importat automat în alt cont.

## Verificări

`npm run check:accounts` verifică regulile de identitate, refuzul altor domenii/directoare, cererile cross-origin, izolarea utilizatorilor și SQL-ul real prin PGlite. Testează și codul de sincronizare livrat în browser: al doilea dispozitiv, modificări independente, conflicte, modul offline și importul anonim automat și recuperarea după o salvare eșuată. Acestea nu înlocuiesc un login Microsoft real în Azure.

După configurare și publicare, verifică manual: student și profesor acceptați, Gmail/personal și alt director respinse, progres restaurat pe al doilea browser, schimbare între două conturi fără amestecarea progresului, lipsa conexiunii, două dispozitive simultan și deconectarea. Nu distribui antete sau tokenuri din sesiunea Microsoft.

Documentație: [Identități și antete Easy Auth](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-user-identities), [provider Microsoft](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad), [variabile App Service](https://learn.microsoft.com/en-us/azure/app-service/reference-app-settings), [conectare și deconectare](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-customize-sign-in-out).
