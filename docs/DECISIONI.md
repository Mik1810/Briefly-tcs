# Decisioni aggiornate — 31 ottobre 2026

Questo documento prevale sulle proposte iniziali in PIANO.md e sulla prima revisione di Claude.
Le sezioni seguenti registrano la storia delle decisioni; lo stato reale del codice è in fondo, nella sezione "Stato reale dopo l'incarico 01".

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

## Conferma successiva dell'utente

Con 'ottimo, continua' l'utente ha approvato Astro + React e Supabase locale,
un briefing giornaliero con approfondimenti separati, pubblico magistrali/ricercatori,
e bozze da revisionare prima della pubblicazione. Si passa al prototipo locale.
Primo incarico: UI con fixture dichiarate, senza integrazione AI o DB non verificata.

## Decisioni approvate dall'utente (riepilogo)

- Grafica A — Rivista, esatta e non ibrida: avorio, bordeaux, testata serif, articolo in evidenza.
- Astro statico con componenti React; Supabase locale come database previsto.
- Un briefing al giorno con più risultati; approfondimenti autonomi possibili.
- Pubblico: studenti magistrali e ricercatori. Testi prodotti come bozze da revisionare prima della pubblicazione.
- Tutto locale, Git locale su main senza remote, nessun deployment.

## Scelte tecniche dell'incarico 01 (proposte di Claude, da revisionare da Codex)

Non sono decisioni dell'utente; restano modificabili.
- Versioni esatte: astro 7.4.4, @astrojs/react 7.1.2, react/react-dom 19.3.1, katex 0.19.1, typescript 6.0.3.
  TypeScript 7 escluso perché @astrojs/check 0.9.12 richiede ^5 o ^6. `overrides` forza una sola copia di KaTeX.
- Formule: unified + remark-math + rehype-katex in build, delimitatori `$…$` e `$$…$$`, output HTML+MathML.
- URL: `/briefing/YYYY-MM-DD/` con ancore `#risultato-<id>`, `/archivio/`, `/argomenti/<slug>/`, `/metodo/`.
- Argomenti, stato scientifico e fonti appartengono al singolo risultato.
  Stato scientifico su tre dimensioni (pubblicazione, formalizzazione, verifica), con vocabolari chiusi.
- Home: ultimo briefing in evidenza e al massimo 9 precedenti; archivio per anno.
- Pagine per argomento generate solo con almeno un risultato pubblicato.
- Correzioni strutturate (data, tipo sostanziale/minore, risultato); quelle sostanziali segnalate in testa all'articolo.
- Font di sistema; nessun font dedicato.

## Stato reale dopo l'incarico 01 — 31 ottobre 2026 (superato per il database dalla sezione successiva)

- Esiste un prototipo Astro + React navigabile in locale; `npm run check` e `npm run build` superati in WSL.
- **I contenuti sono fixture TypeScript dimostrative, non dati da database.** Supabase non è installato, avviato né collegato.
  La sorgente si sceglie in `src/lib/content/config.ts`; il valore `'supabase'` oggi interrompe la build.
  Non esiste alcun ripiego automatico da database a fixture, e non deve esistere in futuro.
- Tre briefing pubblicati dimostrativi e una bozza di controllo, esclusa dall'output e verificata da `scripts/check-dist.ts`.
  Tutti etichettati "Contenuto dimostrativo"; descrivono risultati classici da manuale, non novità di ricerca.
- Le pagine non includono JavaScript. Astro emette comunque in `dist/_astro/` il runtime client di React (circa 216 kB)
  perché l'integrazione lo registra sempre; nessuna pagina lo collega, quindi il browser non lo scarica.
- La revisione visiva in browser (360/768/1440 px, zoom, tastiera) non è stata svolta da Claude: è affidata alla QA di Codex.
- Non realizzati: Supabase, RSS, approfondimenti autonomi come tipo di contenuto separato,
  sostituzione atomica di dist/ in caso di build fallita, processo editoriale e qualunque integrazione AI.
- Dettagli, misure e limiti: docs/coordination/REPORT_01_CLAUDE.md.

## Scelte tecniche dell'incarico 02 (proposte di Claude, da revisionare da Codex)

- CLI Supabase 2.122.0 come dipendenza di sviluppo esatta, con telemetria disattivata dagli script.
- **Runtime nativo sperimentale** dei comandi `stack` invece di Docker. Motivi verificati:
  - in questa WSL `/var/run/docker.sock` non esiste e `docker` richiama `docker.exe`;
  - la CLI 2.122.0 con Docker pubblica le porte senza indirizzo (`-p porta:porta`), cioè su tutte le interfacce.

  Per limitarle a loopback servirebbe cambiare la configurazione globale di Docker, cosa vietata.
  Il runtime nativo ascolta solo su 127.0.0.1. È escluso dalla promessa di compatibilità della CLI.
- Schema relazionale con sei tabelle piccole (topics, briefings, results, result_topics, sources, corrections),
  con vincoli e RLS per riga. Motivazione nella migrazione.
- Lettura in build via REST con chiave publishable (ruolo anon); nessun SDK, nessuna chiave privilegiata.
- Sorgente scelta da `TCS_CONTENT_SOURCE`, sempre impostata dagli script; nessun valore predefinito.
- Build con generazione in `dist-staging/` e sostituzione di `dist/` solo dopo i controlli.

## Stato reale dopo l'incarico 02 — 31 ottobre 2026

- **Integrazione Supabase implementata e verificata sull'istanza locale** (`npm run db:verify`).
  - La build legge i contenuti dal database: tre briefing pubblicati, identici alle fixture.
  - La bozza esiste nel database ma non è leggibile dal ruolo anon.
  - Le scritture anonime ricevono HTTP 401 con codice 42501 e i dati restano invariati.
- Stack locale `tcs-quotidiano` su 127.0.0.1: API/REST 55321, Postgres 55322, Studio 55323.
  Dati in `~/.supabase/stacks/`, fuori dal repository.
- Database fermo: la build fallisce con un messaggio chiaro e `dist/` resta invariato (verificato).
  Lo stesso vale se falliscono i controlli dopo la generazione (verificato).
- La modalità fixture resta solo come scelta esplicita (`build:fixture`, `dev:fixture`, test).
- Corretti i rilievi di Codex:
  - link Markdown con protocolli pericolosi neutralizzati tramite rehype-sanitize;
  - formule in blocco focalizzabili da tastiera;
  - correzione nello stesso giorno della pubblicazione ammessa (già dall'incarico 01).
- Ancora non realizzati: flusso editoriale di scrittura nel database, RSS, approfondimenti come tipo separato,
  hosting. La verifica visiva in browser resta alla QA di Codex.
- Dettagli: docs/coordination/REPORT_02_CLAUDE.md.

## Decisioni dell’utente registrate il 2026-10-31T18:56:48+01:00

- Il sito deve essere in inglese: interfaccia, testi editoriali visibili e contenuti dimostrativi. Questo supera la precedente proposta di blog in italiano.
- Non mostrare il periodo coperto nei blog post. I campi interni possono restare per acquisizione e deduplicazione.
- Stile A e architettura invariati; nessuna richiesta di rinominare gli URL esistenti.
- Tutto il lavoro va registrato in sessions con data e ora Europe/Rome.

## Nome approvato dall’utente — 2026-10-31T19:04:52+01:00

- Nome del sito: **Briefly.tcs**. Supera TCS quotidiano e TCS Daily, entrambi provvisori.
- Nome scelto per il futuro repository GitHub: **briefly-tcs**.
- Sottotitolo proposto, non ancora esplicitamente approvato: Research updates in theoretical computer science.
- L’istruzione «registralo» conferma la scelta del nome nel progetto; non autorizza acquisto di domini o creazione del repository remoto.
- Applicazione della testata da coordinare con la traduzione inglese attualmente affidata a Claude, senza interventi concorrenti sul codice.

## Stato reale dopo l'incarico 04 (Claude) — 2026-10-31T19:14:38+01:00

- Sito pubblico in inglese, verificato sull'HTML generato da Supabase:
  - interfaccia, Metodo, 404, etichette di accessibilità, metadati, etichette di stato, fonti e correzioni, demo;
  - `lang="en"` e date come "October 31, 2026".
- Nel codice il nome è ancora **TCS Daily**, come da incarico. **Briefly.tcs**, approvato alle 19:04:52, non è stato applicato in attesa di coordinamento con Codex.
- Il periodo coperto è tolto dai metadati visibili dell'articolo. I campi `coverage` e la loro validazione restano in modello, schema e dati.
- Invariati: URL, ID e ancore (`/archivio/`, `/argomenti/`, `/metodo/`, `#risultato-<id>`, `#correzioni`), date, stati, relazioni, schema e RLS.
- Demo nel database locale tradotti senza reset con `scripts/translate-demo-db.ts --apply`:
  - prima, tutte le righe coincidevano con la baseline italiana: nessuna modifica dell'utente e nessun dato estraneo;
  - 30 righe aggiornate in un'unica istruzione;
  - il seed inglese è rigenerato per le nuove istanze.
- Esiti: `npm run check`, `npm run db:verify` e `npm run build` da Supabase superati. `check-dist` verifica anche l'inglese e l'assenza del periodo coperto.
- Dettagli: docs/coordination/REPORT_04_CLAUDE.md e sessions/2026-10-31_18-57-46_claude-sito-in-inglese.md.

## Stato reale dopo l'incarico 05 (Claude) — 2026-10-31T19:19:25+01:00

- Nome **Briefly.tcs** applicato al sito:
  - testata con "Briefly" nel colore del testo e ".tcs" nell'accento bordeaux;
  - titoli `… · Briefly.tcs`, titolo della home e footer.

  Questo supera la voce dell'incarico 04 secondo cui il nome nel codice era ancora TCS Daily.
- Sottotitolo invariato: "Theoretical computer science briefings for graduate students and researchers." Il sottotitolo solo proposto non è stato applicato.
- Invariati: CSS, URL, schema, dati, pacchetto npm e stack Supabase interni (`tcs-quotidiano`), inglese e assenza del periodo coperto.
- Verificati: `npm run check` e `npm run build` da Supabase. Dettagli in docs/coordination/REPORT_05_CLAUDE.md.
