# Verifica del prototipo — piano di controllo di Codex

Da compilare dopo l'implementazione di Claude. Non è un report di verifiche già superate.

## Comportamento

- Home, articolo, archivio, argomento e Metodo raggiungibili dai collegamenti.
- Ogni risultato ha un'ancora valida e collegamenti coerenti nelle pagine per argomento.
- Nessuna bozza nell'output statico, negli indici o nei metadati pubblicabili.
- Date civili coerenti in home, articolo e archivio; un ordinamento ripetibile.
- Etichetta dimostrativa leggibile sia dalla home sia nell'articolo.
- Testi e formule leggibili senza JavaScript.

## Aspetto e accessibilità

- Confronto con A: avorio, bordeaux, serif, righe sottili, articolo in evidenza.
- Nessuna griglia di schede decorative o immagine di riempimento.
- Controllo home e articolo, anche con una formula lunga.
- Tastiera: skip link e focus visibili, ordine naturale.
- Dimensioni obiettivo 360, 768 e 1440 px; registrare quelle realmente controllate.
- Zoom 200% e nessun overflow della pagina; registrare il livello effettivamente provato.

## Implementazione

- Build, typecheck e controlli funzionali previsti dallo sviluppatore.
- Dipendenze e lockfile versionati; nessun segreto o directory node_modules in Git.
- Lettura del checklist React dopo la creazione di più TSX.
- Nessun runtime React servito se tutte le componenti sono prerenderizzate.
- CSS e font KaTeX locali; registrare peso HTML/CSS e richieste osservate.
- Nessuna chiamata AI, CDN o database cloud per aprire le pagine.

## Stato del database

Separare tre stati: fixture dimostrative, integrazione Supabase implementata, integrazione verificata su istanza locale.
Non chiamare funzionante un'integrazione soltanto perché esistono file SQL o tipi TypeScript.
Una futura prova deve leggere i contenuti dalla base dati, escludere bozze e gestire un guasto senza fallback silenzioso.

## Consegna

Registrare esiti, limiti reali, comando di avvio, commit finale e indirizzo locale.

## Esiti della prima revisione di Codex

31 ottobre 2026, primo prototipo con fixture:
- HTTP 200 sulla home da WSL e apertura nel browser Windows tramite localhost:4321.
- Home e articolo osservati a 360 px, articolo a 768 px e home a 1440 px.
- Nessun overflow orizzontale globale nei casi osservati.
- Articolo lungo su mobile: quattro blocchi matematici con overflow auto interno; larghezza di pagina entro il viewport.
- Collegamenti nativi a Archivio e Argomenti verificati. I controlli statici verificano link e ancore interni.
- Tab iniziale porta al collegamento Vai al contenuto, con focus visibile.
- scripts/check-dist.ts eseguito da Codex dopo l'output pulito: nessun problema, 12 pagine, 3 briefing e 1 bozza esclusa.
- Home HTML 3,9 kB + CSS 8,2 kB non compressi. Nessuno script collegato dalle pagine prodotte.
- Non verificato lo zoom browser al 200%; non confonderlo con la prova responsive.
- Da correggere nel secondo incarico: URL Markdown con protocolli pericolosi e accesso tastiera ai blocchi matematici.
