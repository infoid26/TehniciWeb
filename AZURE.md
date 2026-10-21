# Publicarea pe Azure App Service

Ținta este aplicația existentă `infoid26`, în `infoid_group`, cu planul Linux B1. Repository-ul pentru publicare este `infoid26/TehniciWeb`, ramura `main`.

## Aplicația web

- Runtime: **Node 24 LTS**.
- Startup Command: **`npm start`**.
- Application setting: **`NODE_ENV=production`**.
- Health Check path: **`/api/health`**.
- Dependențele trebuie instalate pentru Linux în timpul build-ului. Nu încărca `node_modules` construit pe Windows.
- Fișierele generate ale cursului și componentele SQL/Sass/EJS sunt incluse în repository; publicarea nu are nevoie de folderul materialelor originale.

Serverul folosește `PORT` furnizat de Azure și ascultă pe `0.0.0.0` în mediul Azure. Cursul și API-ul pot fi servite de aceeași aplicație, astfel încât cererile către `/api/check` să rămână pe aceeași origine. Domeniul public al cursului rămâne `tw.infoid26.ro`; configurarea DNS și a certificatului se face după verificarea adresei Azure.

În Deployment Center, identitatea de publicare este conectată la repository și ramură prin OIDC. Workflow-ul poate fi examinat înainte de Save. Salvarea poate crea un commit și porni o publicare. Vechea acțiune Azure din `Website` trebuie eliminată sau dezactivată, ca să nu suprascrie aplicația.

## Evaluarea Node și Express

**Publicarea interfeței nu activează automat evaluatorul Node/Express.** În Azure și în modul production, `/api/check` răspunde 503 până este configurat un serviciu separat care izolează execuțiile codului utilizatorilor. Evaluarea SQL, Sass și EJS din browser funcționează independent de acest serviciu.

Evaluatorul folosit în dezvoltare utilizează `node:vm` și Worker threads. Acestea nu reprezintă o graniță de securitate pentru cod trimis de utilizatori. Nu activa acea execuție direct în aplicația publică și nu îi transmite credențialele bazei de date sau identitatea Azure.

Contractul pentru serviciul izolat:

- `LAB_EVALUATOR_URL`: adresa HTTPS a endpointului de evaluare.
- `LAB_EVALUATOR_TOKEN`: opțional, tokenul de autentificare server-to-server; se păstrează în setările Azure.
- Cerere `POST`: JSON cu `task` (definiția exercițiului găsită de server după id) și `code`.
- Răspuns: `{ "results": [{ "label": "Test", "passed": true }] }`; pentru modurile de compilare se acceptă și `compiled` sau `rendered`.
- Serviciul trebuie să asigure izolarea fiecărei execuții, limite de timp/memorie și controlul accesului la rețea și fișiere. Adresa și tokenul nu creează singure această izolare.

App Service limitează cererile la 120 KB, rezultatele evaluatorului la 1 MiB și verificările simultane la două. Cererile către evaluator au timeout și nu urmăresc redirecționări.

**Stare:** adaptarea aplicației și contractul evaluatorului sunt pregătite. Serviciul izolat, conectarea Azure/GitHub și domeniul trebuie configurate înainte de a declara laboratoarele Node/Express disponibile public. Nu este necesară crearea unei baze PostgreSQL suplimentare pentru exercițiile SQL care rulează în browser.

## Verificări

`npm run check:azure` verifică portul Azure, health check-ul, limitele API și interdicția execuției locale în production, plus contractul serviciului separat. `npm run check:server -- --integration-only` verifică integrarea existentă. Aceste verificări nu confirmă o publicare în contul Azure.

Documentație: [Node în App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs?pivots=platform-linux), [Deployment Center](https://learn.microsoft.com/en-us/azure/app-service/deploy-continuous-deployment), [limitările node:vm](https://nodejs.org/api/vm.html), [Azure Container Apps dynamic sessions](https://learn.microsoft.com/en-us/azure/container-apps/sessions).
