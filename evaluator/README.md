# Evaluator Node / Express — pregătit, nepublicat

Imaginea este destinată exclusiv unui **Azure Container Apps custom container session pool**. Nu publica `server.mjs` ca un API obișnuit pe App Service sau într-un container partajat: Worker threads și `node:vm` nu izolează codul ostil. Granița de izolare este sesiunea Hyper-V.

## Componente

- App Service păstrează definițiile exercițiilor și trimite către evaluator numai exercițiul ales și codul.
- `scripts/azure-sessions.mjs` obține un token prin identitatea App Service, generează un UUID nou pentru fiecare evaluare și solicită oprirea sesiunii inclusiv după erori. Tokenul nu este trimis browserului.
- Imaginea conține evaluatorul și dependențele sale. Nu conține cursul, proiectul de referință, adaptorul Azure sau credențialele aplicației.
- Fiecare instanță acceptă o singură evaluare Node/Express. Worker-ul are limită de heap de 192 MiB și este oprit după 8 secunde. Limita totală de memorie trebuie impusă și de platformă.
- SQL, Sass și EJS continuă să ruleze în browser.

## Configurare propusă pentru aprobare

Nu s-a creat niciuna dintre resursele de mai jos. Înainte de publicare trebuie verificate disponibilitatea în regiune, prețul și creditul Students rămas.

| Resursă / setare | Valoare propusă |
| --- | --- |
| Tip de pool | CustomContainer, Dynamic, într-un mediu cu suport pentru sesiuni |
| Imagine | Imagine publicată cu tag imutabil sau digest |
| Port | 8080 |
| Health probe | GET /health |
| Sesiuni simultane | 2 |
| Sesiuni pregătite | 0, dacă platforma acceptă; altfel calculăm costul înainte |
| Memorie / CPU per sesiune | 0.5 GiB / 0.25 vCPU, de validat în regiunea aleasă |
| Durată de inactivitate | Cea mai scurtă durată acceptată; oprirea explicită după rezultat este deja implementată |
| Rețea sesiune | EgressDisabled |
| Acces la identitate din sesiune | Dezactivat; nu configura lifecycle Main |
| Secrete și volume în sesiune | Niciunul |
| Identitate App Service | Drept Session Executor doar pe pool; verifică separat drepturile necesare Stop Session |

**Cost:** custom container sessions sunt facturate în planul **Dedicated**. Nu presupune că beneficiază de gratuitatea Container Apps Consumption sau că minimum zero înseamnă cost total zero. Sunt de luat în calcul și mediul, registry-ul și logurile. Estimarea în EUR și aprobarea resurselor rămân necesare.

## Publicare după aprobarea configurației și costului

1. Construiește imaginea în Linux din rădăcina repository-ului: `docker build -f evaluator/Dockerfile -t tehnici-web-evaluator:VERSION .`.
2. Verifică imaginea și fixează digest-ul; build-ul instalează pachetele directe la versiuni exacte, dar dependențele tranzitive și imaginea de bază necesită un lock/digest validat înaintea publicării.
3. Publică imaginea într-un registry și creează pool-ul cu restricțiile de mai sus. Dacă registry-ul cere identitate pentru image pull, aceasta trebuie să rămână inaccesibilă în sesiune (`lifecycle: None`).
4. Activează/selectează identitatea pentru App Service și atribuie permisiunile la nivelul pool-ului. Identitatea GitHub de publicare nu trebuie confundată cu identitatea aplicației în execuție.
5. Adaugă în App Service `LAB_AZURE_SESSION_ENDPOINT` cu valoarea exactă Pool management endpoint. Pentru o identitate user-assigned adaugă `LAB_AZURE_CLIENT_ID`. Nu seta concomitent `LAB_EVALUATOR_URL`. Nu adăuga un token static.
6. Verifică `/api/health`, apoi soluții corecte, greșite și o buclă infinită prin `/api/check`. Confirmă în Azure că sesiunile se opresc și nu au acces extern sau la identități. Verifică inclusiv că antetele de autentificare ale platformei nu sunt expuse codului studentului.

Până la aceste verificări, evaluatorul nu este declarat activ sau sigur în producție. Endpointul `/api/health` cu `labs: remote` confirmă configurația, nu conectivitatea cu pool-ul.

## Verificare locală

`npm run check:evaluator` verifică toate soluțiile Node/Express și respingerea codului gol prin handler-ul real, plus limitele și adaptorul Azure cu răspunsuri simulate. Nu pornește Docker, nu creează resurse și nu înlocuiește o verificare în Azure.

Surse: [sesiuni custom](https://learn.microsoft.com/en-us/azure/container-apps/sessions-custom-container), [autentificare, rutare și identități](https://learn.microsoft.com/en-us/azure/container-apps/sessions-usage), [tarifare](https://learn.microsoft.com/en-us/azure/container-apps/billing).
