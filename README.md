# Cms

Questo progetto è stato generato con la versione 14.2.8 di Angluar CLI.

## Mock api

Le api BE sono state "mockate" attraverso JSONServer: `https://github.com/‹typicode/json-server`. Il database è nel file `src/app/db/db.json`.

Prima di servire il FE con `ng serve` aprire un terminale al percorso del file db.json e lanciare il comando `json-server --watch db.json`. Questo comando farà partire il server JSON fake in locale sulla porta 3000: `http://localhost:3000/`.

È stato realizzato uno swagger conforme allo standard Open API, attraverso i tool swagger inspector `https://inspector.swagger.io/builder` e swaggerHub `https://app.swaggerhub.com.`
Tale swagger si trova nel file `api_cms.json` nella root del progetto.

Tutto il codice relativo ai data models e ai servizi che effetuano le chiamate api al BE, è stato autogenerato a partite dal suddetto swagger attraverso il pacchetto `https://www.npmjs.com/package/ng-openapi-gen`.
Per generare il codice basta eseguire lo script `api` indicato nel file `package.json` digitando il comando `npm run api`.

## Development server

Eseguire `npm install` per installare le dipendenze ed `ng serve` per servire l'applicazione in locale. Aprire il browser all'indirizzo `http://localhost:4200/`.




