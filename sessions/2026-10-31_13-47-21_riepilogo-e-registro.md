# Sessione: riepilogo del progetto e introduzione del registro

- Data e ora di apertura del registro: 2026-10-31T13:47:21+01:00.
- Fuso orario: Europe/Rome.
- Autore: Codex, coordinatore e revisore.
- Collaboratore: Claude Code CLI su WSL, autore del codice applicativo.
- Richiesta: registrare tutto il lavoro svolto e futuro in `sessions/`, con data e ora, per riprendere senza perdere contesto.
- Commit di partenza di questa attività: `cf64630`.

## 1. Come è stato ricostruito il lavoro precedente

Riepilogo retrospettivo compilato il 31 ottobre 2026 a partire dalla conversazione, dai file di progetto, dai report di Claude e dalla cronologia Git.
Gli orari esatti delle singole operazioni anteriori al registro non sono tutti disponibili.
La tabella Git riporta orari verificati; le altre attività sono ordinate per fase senza attribuire loro un'ora inventata.

## 2. Origine e obiettivo

- Individuata la conversazione ChatGPT **Briefing quotidiano ricerca TCS**, ID `6ac94ce8-68f4-83eb-a4b8-9c5a7a26394c`.
- Letti i briefing recenti per capire formato e contenuti. La lettura non equivale a verifica scientifica delle notizie.
- Obiettivo dell'utente: trasformare l'idea del briefing quotidiano in un blog con forma editoriale adatta al sito.
- L'attività programmata originaria di ChatGPT non è stata modificata o disattivata.
- Cartella progetto inizialmente vuota: `C:\Users\micha\Desktop\sito tcs`.

## 3. Decisioni dell'utente, confermate

- Tutto locale per ora, senza deployment. Possibile Vercel in futuro.
- Sito veloce e sobrio; nessun Next.js.
- Lavorare tramite Ubuntu su WSL.
- Claude CLI scrive il codice; Codex coordina, documenta, verifica e richiede correzioni a Claude.
- Componenti React riutilizzabili e Supabase locale.
- Direzione grafica **A — Rivista**: avorio, bordeaux, titoli serif e articolo in evidenza. L'ibrido A/B è stato spiegato ma non scelto.
- Stack consolidato: Astro statico con componenti React renderizzati durante la build.
- Un briefing al giorno con più risultati; approfondimenti separati quando utili.
- Pubblico: studenti magistrali e ricercatori, con linguaggio chiaro e ipotesi precise.
- Produzione iniziale in bozza da revisionare prima della pubblicazione.
- Git locale; il repository GitHub verrà creato dall'utente. Nessun remote configurato all'ultima verifica.
- Nome **TCS quotidiano** ancora provvisorio.

## 4. Pianificazione e proposte grafiche

### Eseguito

- Preparati `docs/PIANO.md`, `docs/design/PROPOSTE.md` e il brief per Claude.
- Confrontate Eleventy, HTML puro e Astro statico. Eleventy era la prima proposta; superata dopo la preferenza dell'utente per React.
- Create tre direzioni: A Rivista, B Bollettino, C Quaderno.
- Generata con ImageGen la tavola `docs/design/CONFRONTO.png`; prompt conservato in `docs/design/PROMPT_IMMAGINE.txt`.
- Recuperato Claude CLI in WSL: `/home/mik/.local/bin/claude`, versione 2.1.296, autenticato tramite account Claude.
- Verificato Node v24.18.0 tramite nvm; non è stato necessario installare Node.
- Claude ha revisionato il piano in sola lettura. Parere conservato in `docs/coordination/CLAUDE_REVIEW.md`.
- Codex ha consolidato il parere in `docs/coordination/SINTESI.md`, distinguendo raccomandazioni e decisioni dell'utente.
- Aggiornate le scelte prevalenti in `docs/DECISIONI.md` e introdotto Git locale sul branch main.

### Correzioni di metodo

- Non sono state adottate come fatti tutte le affermazioni di Claude su WSL, date, installazioni o aspetti legali.
- Non è stata promessa una build atomica senza verificarne la procedura.
- I contenuti del briefing originale non sono stati ripubblicati come notizie verificate.

## 5. Primo prototipo, codice scritto da Claude

Incarico: [IMPLEMENTAZIONE_01.md](../docs/coordination/IMPLEMENTAZIONE_01.md).
Report: [REPORT_01_CLAUDE.md](../docs/coordination/REPORT_01_CLAUDE.md).

### Eseguito

- Installate dipendenze con versioni esatte e lockfile, senza Next.js, Tailwind o librerie UI.
- Realizzati 14 componenti React riutilizzabili, layout Astro e CSS scritto a mano.
- Realizzate home, pagine briefing, archivio, indice e pagine per argomento, Metodo e 404.
- Modello editoriale con briefing, risultati, fonti, argomenti, correzioni e stati scientifici distinti.
- Date editoriali come stringhe di calendario; validazione runtime di date, slug, stati e riferimenti.
- Resa Markdown e formule KaTeX durante la build; CSS e font matematici locali.
- Tre briefing dimostrativi sui risultati classici di ordinamento, Dijkstra, Karatsuba e Catalan.
- Una bozza dimostrativa del 1 novembre come controllo di esclusione.
- Ogni esempio contrassegnato visibilmente come contenuto dimostrativo.
- Create verifiche su contenuti, Markdown e output statico.

### Verificato

- Claude: check e prima build superati; inizialmente 20 test. Due build con hash identici; prova di build senza rete.
- Codex: controllo indipendente di `check-dist`, navigazione e osservazione nel browser.
- Verificate home e articolo a 360 px, articolo a 768 px e home a 1440 px.
- Nessun overflow orizzontale globale nei casi osservati; formule lunghe contenute nel proprio blocco.
- Verificato il collegamento iniziale Vai al contenuto da tastiera.
- Misura home: circa 3,9 kB HTML + 8,2 kB CSS, non compressi.
- Nessuno script incluso nelle pagine statiche. Il file runtime React emesso ma non collegato non viene caricato dalle pagine.

### Problemi trovati e risolti

- Validazione iniziale troppo restrittiva: non consentiva correzioni nello stesso giorno. Segnalata da Codex, corretta da Claude con test.
- Markdown iniziale accettava `javascript:` nei link: riprodotto da Codex, corretto nell'incarico successivo.
- Formule scorrevoli inizialmente senza focus da tastiera: corrette nell'incarico successivo.
- Nell'avvio CLI è servita una shell login per trovare `claude` nel PATH.
- Alcune scritture di documenti da PowerShell a WSL hanno introdotto terminatori finali CR: rilevati e ripuliti.
- Durante i test negativi sono stati volutamente introdotti file e link errati in dist; rilevati dai controlli e poi rimossi con la build pulita.

## 6. Supabase locale e seconda revisione

Incarico: [IMPLEMENTAZIONE_02_SUPABASE.md](../docs/coordination/IMPLEMENTAZIONE_02_SUPABASE.md).
Report: [REPORT_02_CLAUDE.md](../docs/coordination/REPORT_02_CLAUDE.md).

### Ambiente e decisione tecnica

- Docker Desktop è stato avviato; il wrapper Docker Windows rispondeva da WSL.
- Il socket Linux non forniva una connessione funzionante. La presenza del percorso osservata inizialmente non dimostrava che il servizio fosse raggiungibile.
- Claude ha valutato il binario CLI Windows e il binding delle porte; la prova è stata scartata e gli strumenti temporanei rimossi.
- Scelto il runtime **nativo sperimentale** di Supabase CLI 2.122.0, con servizi in WSL e porte su loopback.
- Nessuna modifica globale a Docker o firewall; nessun database cloud collegato.
- Il Postgres di sistema e gli altri progetti non sono stati modificati.

### Eseguito

- Configurazione e versioni servizi in `supabase/config.toml` e `supabase/supabase.lock`.
- Migrazione `20261031122537_editorial_schema.sql` e seed riproducibile.
- Sei tabelle: topics, briefings, results, result_topics, sources, corrections.
- RLS attiva e privilegi anonimi limitati a SELECT sui contenuti pubblicati e relativi dati.
- Sorgente Supabase REST usata durante la build; nessun SDK o chiave nel browser.
- Fixture disponibili solo con modalità esplicita, senza fallback automatico se il database non risponde.
- Script per avvio/arresto, configurazione, seed, verifica DB e build protetta.
- Build in dist-staging, controllo e sostituzione finale di dist. Due rinomine con ripristino, non scambio atomico assoluto.
- Aggiunto rehype-sanitize e verificati protocolli pericolosi senza rompere KaTeX.
- Aggiunti focus e regione etichettata ai blocchi matematici scorrevoli.

### Verifiche riportate da Claude

- Check finale: 0 errori di tipo, 25 test superati.
- Build da Supabase: 12 pagine e controlli superati.
- Guasto DB e errore successivo alla generazione: build rifiutata, hash del precedente dist invariati.
- Persistenza dei dati dopo stop/start; schema e seed riproducibili con reset della sola istanza del progetto.
- Advisors: nessun avviso di sicurezza; due INFO relativi a indici non ancora utilizzati.
- Nessuna chiave privilegiata salvata o stampata.

### Problema trovato dalla verifica indipendente di Codex

- `npm run db:verify` falliva fuori dall'ambiente agente: la CLI stampava una tabella invece di JSON.
- Correzione richiesta in [CORREZIONE_03.md](../docs/coordination/CORREZIONE_03.md).
- Claude ha richiesto esplicitamente JSON e gestito le due forme di risposta della CLI.
- Codex ha riprovato da terminale WSL ordinario: comando superato.
- `npm run db:env` riprovato da Codex: configurazione scritta senza mostrare chiavi.

### Verificato direttamente da Codex

- Database: 3 briefing pubblicati e 1 bozza reale presente.
- Lettura anonima: solo i 3 pubblicati, contenuti uguali ai demo previsti.
- Lettura bozza e dati collegati: zero righe.
- Cinque scritture anonime negate, dati invariati dopo i tentativi.
- Controllo output da sorgente Supabase: nessun problema, 12 pagine.
- Browser: footer riporta Supabase locale; zero script nella home.
- Formula mobile: focus su Formula in blocco e ArrowRight sposta scrollLeft da 0 a 40 px.
- Nessuna larghezza aggiuntiva dell'intera pagina durante lo scorrimento della formula.
- Verificato che la chiave locale non fosse nei file staged e che `.env` fosse escluso da Git.
- Schermate finali in `docs/design/qa/home-desktop.jpg` e `articolo-mobile.jpg`.

## 7. Cronologia Git verificata

Tutti gli orari seguenti sono Europe/Rome, UTC+01:00, il 31 ottobre 2026.

| Ora | Commit | Attività |
| --- | --- | --- |
| 12:39:22 | 387e73f | Piano iniziale, proposte visive e prima revisione di Claude |
| 12:40:11 | a19b92c | Preferenze React, Supabase, stile A e Git |
| 13:15:01 | 9b50bab | Prototipo Astro/React con fixture e verifiche |
| 13:43:27 | 26335f2 | Supabase locale, RLS, build protetta, correzioni e QA |
| 13:43:37 | cf64630 | Normalizzazione degli spazi nei report |

## 8. Stato alla consegna del prototipo

- Sito e database locali funzionanti, dati ancora dimostrativi.
- Anteprima statica su http://localhost:4321/; API locale 55321, DB 55322, Studio configurato 55323.
- Server di sviluppo Astro fermato dopo la prima QA; anteprima statica servita da Python su loopback.
- Stack Supabase nativo lasciato attivo. Disponibilità da ricontrollare a ogni ripresa.
- Git su main; nessun remote o push; ultimo commit applicativo 26335f2, ultimo commit precedente al registro cf64630.
- Nessun job, deployment, importazione di notizie reali o generazione AI di articoli attivato.

## 9. Limiti e attività non completate

- Runtime Supabase nativo sperimentale: versioni fissate, comportamento da ricontrollare in caso di aggiornamento CLI.
- Zoom browser al 200% e Studio nel browser non verificati.
- Nessun flusso editoriale per creare, revisionare e pubblicare articoli reali.
- Nessuna raccolta delle fonti o automazione giornaliera.
- Modello, credenziali, eventuali costi e scheduler non scelti.
- Approfondimenti autonomi come tipo di contenuto e RSS non implementati.
- Archivio raggruppato per anno, senza paginazione ulteriore.
- La build esegue più letture dal database; le modifiche concorrenti tra le letture non sono rilevate.
- La sostituzione dell'output non è uno scambio atomico assoluto.
- I testi e gli URL di esempio non costituiscono una verifica scientifica dei paper del briefing originale.

## 10. Prossimi passi pianificati, non eseguiti

1. Progettare con Claude un piccolo flusso editoriale per fonti, bozze e revisione.
2. Recuperare le istruzioni effettive del briefing originario se servono a riprodurne selezione e frequenza.
3. Scegliere come produrre le bozze e le eventuali integrazioni, prima di configurare credenziali o consumi API.
4. Produrre un singolo briefing reale, con fonti primarie controllate e distinzione dello stato scientifico.
5. Valutare la qualità e solo successivamente impostare l'automazione locale e il recupero delle esecuzioni perse.
6. Collegare GitHub quando l'utente fornisce il repository; nessun push implicito.
7. Hosting solo su successiva richiesta.

## 11. Attività corrente: introduzione del registro

### 2026-10-31T13:47:21+01:00 — Codex — eseguito

- Letta la richiesta di logging e verificata la cronologia Git.
- Verificato lo stato pulito iniziale del repository.
- Ricontrollati sito e API locale: entrambi HTTP 200 al momento della verifica.
- Creata sessions con indice, questo riepilogo e checkpoint aggiornabile.
- Aggiunte istruzioni di progetto per Codex e Claude per continuare il logging nelle prossime sessioni.
- Il lavoro retrospettivo resta distinguibile dalle attività future solo pianificate.

### Chiusura

Il timestamp effettivo e l'esito della verifica/versionamento di questi file verranno aggiunti prima del commit di questa sessione.

### 2026-10-31T18:56:48+01:00 — Codex — ripresa e chiusura del riepilogo

Il registro era stato creato alle 13:47:21 e non ancora versionato. Nessuna attività ulteriore viene attribuita all’intervallo senza prove. Ripresa dopo le richieste di sito in inglese, rimozione del periodo coperto visibile e aggiornamento di stato. Il riepilogo, checkpoint e istruzioni AGENTS/CLAUDE vengono verificati e versionati nel commit di introduzione del registro. La modifica del sito prosegue in una nuova sessione datata.
