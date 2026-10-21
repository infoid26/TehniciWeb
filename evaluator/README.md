# Evaluator Node / Express pentru Azure Sandboxes

Adaptorul este pregătit local; activarea în Azure și verificarea imaginii rămân de făcut. Sandboxul de test cu Node.js simplu nu conține evaluatorul sau Express.

App Service folosește CLI-ul Microsoft ACA `1.0.0-preview.4`, cu arhiva verificată prin SHA-256 la build. Identitatea aplicației rămâne pe App Service. Fiecare verificare creează un sandbox nou în grupul existent `tw-labs`, încarcă numai exercițiul ales și codul într-un fișier, rulează evaluatorul și șterge sandboxul inclusiv după erori. Codul primit nu este interpolat în comenzi shell. Nu se deschid porturi de intrare.

Imaginea include Node 24, Express, EJS, Sass și evaluatorul. Nu include cursul, proiectul complet, materiale originale, adaptorul Azure sau secrete. Worker threads și `node:vm` limitează execuția, dar izolarea reală este microVM-ul Azure.

## Limite

- 0,25 vCPU și 512 MiB per sandbox; maximum două verificări simultane per proces App Service.
- Egress `Deny`, inspecție `Full`, fără reguli de permitere, VNET, volume, conectori sau identitate în sandbox.
- Worker cu heap de 192 MiB, maximum 8 secunde; corp de intrare maximum 512 KiB și rezultat maximum 1 MiB.
- Auto-suspend la 60 de secunde, mod Disk, configurat înainte de execuția codului; ștergere explicită după rezultat.
- O ștergere eșuată oprește verificările noi în acel proces până la intervenție/restart. Verifică și șterge sandboxurile `tw-eval-*` înainte de restart. Un create întrerupt sau o cădere App Service poate lăsa un sandbox; auto-suspend limitează calculul, dar stocarea trebuie curățată.

## Pașii de activare

1. După commit/push aprobat, pornește manual workflow-ul **Build evaluator image (manual)**. Acesta testează codul, construiește imaginea, face un test Docker fără rețea, apoi publică un tag cu SHA-ul commitului în GHCR. Nu rulează automat la push și nu creează resurse Azure.
2. Folosește imaginea/digestul din rezumatul workflow-ului pentru un Disk Image nou în `tw-labs`. Dacă pachetul GHCR este privat, configurează separat autentificarea registry-ului sau vizibilitatea pachetului; nu introduce tokenul în sandbox.
3. Activează identitatea system-assigned a App Service `infoid26`. Atribuie **Container Apps SandboxGroup Data Owner** acestei identități, numai pe grupul `tw-labs`. Nu atribui rolul sandboxurilor.
4. Setează în App Service:

| Setare | Valoare |
| --- | --- |
| `LAB_AZURE_SUBSCRIPTION_ID` | ID-ul abonamentului Students |
| `LAB_AZURE_RESOURCE_GROUP` | `infoid_group` |
| `LAB_AZURE_SANDBOX_GROUP` | `tw-labs` |
| `LAB_AZURE_SANDBOX_DISK_ID` | UUID-ul imaginii complete cu evaluator |
| `LAB_AZURE_REGION` | `italynorth` |
| `LAB_AZURE_CLIENT_ID` | Numai dacă alegi o identitate user-assigned |

Nu seta concomitent `LAB_AZURE_SESSION_ENDPOINT` sau `LAB_EVALUATOR_URL`. Nu configura imaginea simplă Node folosită pentru test în locul imaginii evaluatorului.

5. Verifică live o soluție corectă, una greșită și o buclă infinită; urmărește ștergerea sandboxurilor și verifică egress/identitatea din microVM. Verifică rolurile, CPU/memoria, timeouturile și creditul înainte de folosirea de către colegi. Nu păstra sandboxul manual de test pornit.

`/api/health` cu `labs: remote` confirmă configurația, nu conectivitatea sau izolarea verificată live. Nu s-a publicat imaginea și nu s-au modificat setări Azure prin această implementare.

## Validare

`npm run check:evaluator` verifică toate cele 51 de soluții Node/Express și codul greșit prin handlerul real. `npm run check:sandboxes` verifică adaptorul cu un CLI simulat: resurse, egress, upload, ID unic, curățare după erori și integrarea API. Build-ul Azure verifică versiunea/checksumul CLI și flagurile. Testele simulate nu înlocuiesc execuția în Azure.

Costurile Sandboxes includ calculul în timpul rulării și, separat, stocarea. Nu este folosit un Dynamic Sessions CustomContainer pool Dedicated. Urmărește costurile reale din abonamentul Students; nu presupune gratuitate.

Documentație: [CLI Microsoft](https://github.com/microsoft/azure-container-apps/releases/tag/aca-cli-v1.0.0-preview.4), [Sandboxes](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-overview), [egress](https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-egress-policies), [costuri](https://sandboxes.azure.com/docs/sandboxes/cost).
