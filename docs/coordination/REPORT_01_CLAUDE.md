# Report 01 di Claude — prototipo locale

Data: 31 ottobre 2026. Ambiente: WSL, Node v24.18.0 (nvm, già presente), npm 11.16.0. Nessun commit eseguito.

## File chiave

- `package.json`, `package-lock.json`, `.npmrc` (save-exact), `.nvmrc`, `astro.config.mjs`, `tsconfig.json`
- `src/lib/content/types.ts`: modello (briefing → risultati con argomenti, stato scientifico, fonti; correzioni)
- `src/lib/content/validate.ts`: validazione runtime con messaggi che indicano il percorso del campo
- `src/lib/content/source.ts`, `config.ts`, `fixtures/`: interfaccia della sorgente, scelta esplicita, dati dimostrativi
- `src/lib/content/repository.ts`: unico accesso per le pagine; valida, esclude le bozze, ordina
- `src/lib/markdown.ts`: Markdown + KaTeX in build; un errore di formula interrompe la build
- `src/components/*.tsx`: 14 componenti React solo server (testata, righe, articolo in evidenza, metadati, risultato, fonti, correzioni, indice, navigazione)
- `src/layouts/BaseLayout.astro`, `src/pages/`: home, `briefing/[date]`, archivio, argomenti, `argomenti/[slug]`, Metodo, 404
- `src/styles/global.css`: CSS scritto a mano, direzione A
- `tests/content.test.ts`, `tests/markdown.test.ts`, `scripts/check-dist.ts`

## Architettura

Astro statico; i componenti React vengono renderizzati in HTML durante la build, senza direttive `client:*`.
Pagine → `repository.ts` → `ContentSource`. Oggi l'unica sorgente implementata è `fixture`.
`'supabase'` è un valore ammesso dal tipo, ma interrompe la build con un errore esplicito: nessun ripiego.
Tutti i dati, bozze comprese, sono validati prima della generazione; le bozze vengono filtrate in un solo punto.
Il KaTeX CSS è importato solo dalla pagina articolo; i font sono serviti da `dist/_astro/`.

## Comandi realmente eseguiti

- `npm install` delle dipendenze con versioni esatte; `overrides` porta rehype-katex e micromark-extension-math sulla stessa copia katex 0.19.1. `npm audit`: 0 vulnerabilità (prima dell'override: 4 di gravità bassa, dovute alla copia annidata più vecchia di KaTeX).
- `npm run check`: astro check 0 errori, 0 avvisi (37 file); 20 test di Node superati.
- `npm run build`: 12 pagine e check-dist senza problemi.
- Due build consecutive: hash SHA-256 identici sui 74 file di `dist/`.
- Build dentro `unshare -rn` (nessuna rete, DNS non risolto): riuscita.
- Mutazioni temporanee, poi ripristinate:
  - filtro delle bozze disattivato → falliscono 2 test;
  - link alla bozza, ancora inesistente, `<script>` remoto e pagina `argomenti/logica` iniettati in `dist/` → check-dist segnala tutti e 6 i problemi.
- Formula non valida passata a `renderMarkdown` → eccezione con posizione. L'HTML grezzo nel Markdown viene scartato.
- Non eseguiti, come da incarico: `npm run dev`, `npm run preview`, qualunque browser. Nessuna verifica visiva o di layout in browser è stata fatta.

## Misure (output di check-dist, non compresso / gzip)

- Home: HTML 3,9 / 1,4 kB; CSS 8,2 / 2,2 kB (1 file). Entro l'obiettivo di 100 kB del piano.
- Archivio: HTML 3,6 / 1,3 kB, stesso CSS.
- Articolo lungo con formule (`2026-10-29`): HTML 59,7 / 6,8 kB; CSS 37,3 / 10,0 kB (CSS del sito + KaTeX 29,8 kB).
- Articolo breve (`2026-10-30`): HTML 8,5 / 2,5 kB.
- Font KaTeX: 19 woff2 per 250 kB in totale. Il browser scarica solo quelli usati dalla pagina; non ho misurato le richieste reali.
  Con i ripieghi woff/ttf, mai richiesti dai browser moderni, si arriva a 1048 kB su disco.
- JavaScript collegato dalle pagine: zero.

## Limiti reali

- **Database**: nessuna integrazione. Fixture dichiarate in README, footer, pagina Metodo e DECISIONI.
- **`dist/_astro/client.*.js` (216 kB)**: è il runtime client di React. Astro lo aggiunge sempre per ogni renderer registrato
  (`node_modules/astro/dist/core/build/static-build.js:387`). Nessuna pagina lo collega, e check-dist fallisce se un HTML
  contiene `<script>`. Non l'ho rimosso con soluzioni artigianali.
- **Layout 360/768/1440, zoom 200%, tastiera, contrasto**: impostati nel CSS, ma non osservati in un browser.
  - Le formule in blocco hanno `overflow-x: auto` sul proprio contenitore.
  - Su schermi stretti i metadati passano a una colonna sotto i 640 px.
  - Contrasti calcolati a mano: testo secondario #5C5852 su avorio circa 6,5:1; bordeaux su avorio circa 8,9:1.
- I blocchi di formula scorrevoli non ricevono il focus da tastiera (`tabindex`); da valutare in QA.
- Font serif di sistema: l'aspetto cambia tra sistemi operativi (Iowan, Charter, Cambria o Georgia).
- La build non sostituisce `dist/` in modo atomico: una build fallita può lasciare un `dist/` parziale.
- Non realizzati: RSS, approfondimenti come tipo separato, paginazione dell'archivio oltre il raggruppamento per anno.
- Anche le bozze vengono validate per intero; con dati reali potrebbe servire una validazione meno rigida per le bozze.
- Recepita la nota di Codex in `IMPLEMENTAZIONE_02_SUPABASE.md`: correzioni e aggiornamento nello stesso giorno della pubblicazione ora sono ammessi, con test dedicato. Il resto di quell'incarico non è stato eseguito.

## Contenuti dimostrativi

Tre briefing pubblicati, tutti etichettati "Contenuto dimostrativo":
- 29 ottobre: lungo, con formule e due correzioni, una sostanziale e una minore. Tratta il limite Ω(n log n) per confronti, merge sort e insertion sort Θ(n²).
- 30 ottobre: breve, su Dijkstra con heap binario.
- 31 ottobre: Karatsuba e numeri di Catalan.

Una bozza del 1 novembre, con argomento esclusivo Logica e marcatore `MARCATORE-BOZZA-NON-PUBBLICARE`, è assente da `dist/`.
Le fonti sono testi classici reali (CLRS, Knuth, Dijkstra 1959) e pagine Wikipedia. Gli URL delle pagine Wikipedia non sono stati aperti durante il lavoro.
