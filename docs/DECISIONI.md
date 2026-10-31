# Decisioni aggiornate — 31 ottobre 2026

Questo documento prevale sulle proposte iniziali in PIANO.md e sulla prima revisione di Claude.
La fase resta di progettazione: nessun incarico di implementazione è stato inviato.

## Confermato dall'utente

- Direzione grafica A — Rivista: avorio, bordeaux, titoli serif, impaginazione editoriale.
- Componenti React riutilizzabili come preferenza per il frontend.
- Supabase come soluzione prevista per il database.
- Versionamento locale con Git; il repository GitHub sarà creato dall'utente in seguito.
- Lavoro in WSL; Codex coordina e revisiona, Claude scrive il codice.
- Tutto locale per ora, nessun deployment. Possibile Vercel da valutare in futuro.

## Proposte aggiornate di Codex

Eleventy non è più la proposta corrente. La scelta dello strumento che ospita React resta da consolidare.
Proposta: Astro statico con componenti React e CSS scritto a mano.
Astro può renderizzare componenti React in HTML; il JavaScript client si abilita soltanto per le interazioni necessarie.
Per questo blog non è necessario introdurre Next.js né una navigazione interamente client.
Il riuso dei componenti era possibile anche con i template di Eleventy: React è ora una preferenza esplicita del progetto.
Esempi di componenti riutilizzabili previsti: testata, navigazione, anteprima articolo, metadati, sezione risultato, fonti, corpo articolo.

Supabase è previsto inizialmente in locale. Verificare Docker e CLI in WSL prima del setup.
Non è stato creato, collegato o modificato alcun progetto Supabase.
Il database potrà conservare briefing, singoli risultati, fonti, argomenti e correzioni; schema ancora da progettare con Claude.
I file Markdown potranno restare un formato di testo/import-export, senza diventare una seconda fonte canonica in conflitto col database.
Proposta per il sito: leggere dal database locale durante la generazione e servire l'HTML risultante al lettore.
La build che legge Supabase locale richiederà il servizio locale attivo; corregge il precedente obiettivo di build senza servizi.
Resta vietata ogni chiamata AI nella build ordinaria. Nessuna chiamata a database cloud nella prima fase.
Il flusso futuro di aggiornamento statico e l'hosting non sono ancora definiti.
Bozze e dati grezzi restano esclusi dall'output pubblicabile; credenziali privilegiate fuori dal browser e da Git.

## Grafica: A scelta, ibrido solo spiegato

A rimane la direzione confermata, incluso il suo articolo in evidenza.
L'ibrido A/B proposto in precedenza significava mantenere colori, testata e tipografia di A,
ma usare in home una lista più compatta come B, con meno spazio tra gli articoli.
Non significava alternare colori o stili fra pagine.
L'utente ha chiesto una spiegazione dell'ibrido, non lo ha scelto: non sostituire A con l'ibrido.
Densità e dimensioni finali si valuteranno con il prototipo A.

## Piano aggiornato

1. Consolidare con Claude Astro+React e modello Supabase locale, chiarendo il percorso dei contenuti.
2. Fare implementare a Claude home e articolo nello stile A, con dati dimostrativi espliciti.
3. Integrare Supabase locale, validazione dei dati, archivio, argomenti e Metodo.
4. Revisionare mobile, accessibilità, formule, peso delle risorse, esclusione delle bozze e comportamento con database non disponibile.
5. Provare un ciclo editoriale con fonti reali; poi definire generazione e automazione.
6. Affrontare l'hosting solo successivamente.

L'assenza di JavaScript per la lettura resta un obiettivo del blog, compatibile con React renderizzato durante la generazione.
Eventuali interazioni client dovranno avere un motivo concreto e risorse misurate.
Budget e criteri del piano iniziale restano obiettivi da verificare, non risultati già ottenuti.

## Git

Repository inizializzato sul branch main, senza remote.
Versionare documenti, proposte visive, codice futuro, lockfile e migrazioni del database.
Escludere dipendenze, output generati del sito, file di ambiente, credenziali, log e stato locale Supabase.
Il database in esecuzione non viene versionato come insieme di file binari: versionare schema/migrazioni e dati dimostrativi riproducibili.
Non eseguire push finché l'utente non fornisce o collega il repository GitHub.

## Fonti tecniche consultate

- https://docs.astro.build/en/guides/integrations-guide/react/ — supporto per React e rendering HTML dei componenti.
- https://supabase.com/docs/guides/local-development — stack locale tramite CLI e runtime compatibile Docker.
