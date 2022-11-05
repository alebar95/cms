# Cms

Questo progetto è stato generato con la versione 14.2.8 di Angluar CLI.

## Development server

Eseguire `ng serve` per servire l'applicazione in locale. Aprire il browser all'indirizzo `http://localhost:4200/`.

## Mock api

Le api BE sono state "mockate" attraverso JSONServer: `https://github.com/‹typicode/json-server`. Il database è nel file `src/app/db/db.json`.

Prima di servire il FE con `ng serve` aprire un terminale al percorso del file db.json e lanciare il comando `json-server --watch db.json`. Questo comando farà partire il server JSON fake in locale sulla porta 3000: `http://localhost:3000/`.


