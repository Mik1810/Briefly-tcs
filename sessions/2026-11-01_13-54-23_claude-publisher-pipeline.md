# Sessione Claude — publisher GitHub → Supabase → Vercel

- Inizio: 2026-11-01T13:54:23+01:00 (Europe/Rome).
- Autore: Claude Code (Opus 5.5), app desktop, comandi Git/Node via WSL Ubuntu.
- Commit iniziale: a3b843c (main allineato a origin/main, albero pulito).
- Richiesta utente: continuare la pipeline ChatGPT online → post su GitHub → publisher → Supabase → build Vercel,
  seguendo docs/HANDOFF_CLAUDE.md. Vincoli: niente API OpenAI, niente Codex quotidiano, nessuna revisione umana
  obbligatoria, post in inglese, sito leggero, design invariato.
- Istruzione aggiuntiva dell'utente (2026-11-01, questa sessione): **i campi del post da mostrare (componenti della
  tabella) vanno decisi insieme all'utente**; il resto può iniziare subito.

## Ricognizione — 2026-11-01T13:54:23+01:00 (verificato)

- Letti HANDOFF_CLAUDE.md, STATO_ATTUALE.md, sessions/README.md, schema SQL, types.ts, validate.ts, labels.ts.
- git: main...origin/main 0/0, ultimo commit a3b843c. Nessun `.github/workflows`, nessun publisher in scripts/.
- https://briefly-tcs.vercel.app: HTTP 200, "No published briefings", footer ancora "local prototype".
- Osservazione: la tabella `topics` online è vuota (nessun seed in cloud). Il validatore richiede argomenti da
  vocabolario per ogni risultato: il vocabolario va caricato online prima del primo post.

## Attività — tra 13:54:23 e 14:02:29+01:00 (orari dei singoli passi non rilevati)

### Decisione di architettura (eseguita)

- Il task ChatGPT scriverà `posts/YYYY-MM-DD.json` in una branch dedicata **`posts`** (orfana: solo post,
  workflow e vercel.json), non in main.
- Motivo: un push su main avvia già una build Vercel, che leggerebbe Supabase prima dell'importazione. L'Ignored
  Build Step di Vercel non è utilizzabile perché si applica anche alle build da deploy hook (thread community
  Vercel e guida "Why aren't commits triggering deployments"). `vercel.json` disattiva le build della branch posts.
- GitHub Actions su push a `posts` → checkout del codice da main → `scripts/publish-posts.ts` → RPC
  `publish_briefing` → se almeno un post pubblicato, POST al deploy hook Vercel di main. Nessun commit del bot,
  quindi nessun ciclo.

### File creati/modificati (eseguito)

- `src/lib/content/post.ts`: formato `briefly-post/1` (BOZZA dei campi, da concordare con l'utente). Valori pubblici
  inglesi mappati sugli enum interni italiani; il publisher impone pubblicato, demo=false,
  verifica `controllo-automatico`, dichiarazione AI fissa, nessuna correzione. Campi non previsti rifiutati.
  Id del risultato derivato dal titolo se assente, con suffisso data in caso di collisione.
- `scripts/lib/publisher.ts`, `scripts/publish-posts.ts`: validazione (stesso validate.ts della build), un post
  invalido non blocca gli altri, idempotenza (identico = ignorato, diverso = errore visibile), date oltre domani
  rifiutate, `--dry-run`, output `published=N` per GitHub Actions. Accetta solo chiave `sb_secret_`.
- `supabase/migrations/20261101140000_publish_briefing.sql`: funzione SECURITY DEFINER, search_path vuoto,
  transazione unica; EXECUTE solo a service_role; SELECT (non scrittura) a service_role sulle sei tabelle.
- `.github/workflows/publish-posts.yml`, `vercel.json`.
- Esportati `validateUrl` (config.ts), `BRIEFING_SELECT`, `BRIEFING_ORDER`, `BriefingRow` (source.ts) per riuso.
- `tests/publisher.test.ts`: 9 test con database simulato.

### Errori e correzioni

- Prima prova locale: `permission denied for table results` per service_role (auto_expose_new_tables = false).
  Corretto aggiungendo alla migrazione solo `grant select ... to service_role`; scritture solo via funzione.
- Script: un errore di configurazione/DB produceva stack trace; ora messaggio `ERRORE ...` e uscita 1.

### Verifiche (verificato)

- `npm run check`: Astro check 0 errori/avvisi/suggerimenti; 44/44 test.
- Stack locale nativo avviato con `npm run db:start` (era fermo). `supabase migration up --local` ha applicato
  20261101120237 (non ancora presente in locale) e 20261101140000; grant SELECT applicato a mano dopo la correzione.
- Prova locale con post riconoscibile `Publisher test briefing (local)` (file solo nello scratchpad, non nel repo):
  dry-run ok, pubblicazione ok, seconda esecuzione "già presenti e identici: 1", RPC con chiave publishable → 401,
  lettura anon corretta (pubblicato, demo false, verifica controllo-automatico, argomenti e fonti in ordine).
- Atomicità: RPC con argomento inesistente → HTTP 409 (FK), 0 righe residue in briefings/results.
- `npm run build` locale: pagina /briefing/2026-11-02/ generata, 0 tag script. Poi riga di prova cancellata dal DB
  locale e `npm run build:cloud` rieseguita: dist/ di nuovo build cloud vuota (5 pagine, check-dist pulito).

### Non fatto / limiti

- Nulla applicato al Supabase cloud: la migrazione va eseguita nell'SQL Editor (storia migrazioni cloud assente,
  niente `db push`). Vocabolario `topics` cloud ancora vuoto.
- Branch `posts`, secret GitHub (TCS_SUPABASE_URL, TCS_SUPABASE_SECRET_KEY, VERCEL_DEPLOY_HOOK_URL) e deploy hook
  Vercel non creati. Nessun push.
- L'esito della build Vercel dopo il deploy hook non è controllato dal workflow (servirebbe un token Vercel).
- Campi del post: in attesa della discussione con l'utente.
- Servizi lasciati attivi: stack Supabase locale (API 55321, DB 55322). Anteprima 4321 non verificata.

## Decisioni dell'utente sui campi del post — risposta ricevuta tra 14:02:29 e 14:10:10+01:00

Riferite in chat dall'utente:
- Periodo coperto: non serve (il post giornaliero riguarda ieri); può restare in tabella ma non va mostrato.
- 1. Un briefing al giorno (struttura attuale con uno o più risultati).
- 2. Etichette di stato scientifico: poco rilevanti, per ora si tengono.
- 3. Argomenti: il generatore non deve specificarli e il lettore non deve vederli; tema accantonato, forse riaperto.
- 4. Nessun campo aggiunto o tolto oltre a questo.

## Applicazione delle decisioni — tra 14:10:10 e 14:13:42+01:00 (eseguito)

- post.ts: `topics` non più ammesso nel post (risultati con topics vuoti); `coverage` facoltativo, predefinito
  dal giorno precedente alla data del post. Formato resta `briefly-post/1`.
- validate.ts: gli argomenti diventano facoltativi (se presenti devono restare nel vocabolario).
- publisher.ts: rimosso il blocco su vocabolario vuoto; nel cloud la tabella topics può restare vuota.
- UI: ArticleMeta, ResultSection, BriefingRow, BriefingLead mostrano argomenti solo se presenti; voce "Topics"
  tolta dal menu (pagine /argomenti/ conservate per i permalink, non collegate). metodo.astro: tolta la frase
  sugli argomenti. Nessun altro cambiamento grafico.
- tests/publisher.test.ts aggiornato (periodo predefinito, topics rifiutato, URL non https, vocabolario vuoto).

## Verifiche — 14:13:42+01:00 (verificato)

- `npm run check`: 0 errori/avvisi, 44/44 test.
- Publisher locale con post senza argomenti né periodo: dry-run, pubblicazione, rerun idempotente, RPC anon 401;
  DB: coverage 2026-11-01/2026-11-01 per il post del 2026-11-02, result_topics vuoto.
- Build locale: pagina del post senza "Topics", menu senza link /argomenti/, home senza trattino orfano;
  demo locali con argomenti ancora mostrati (3 occorrenze). check-dist pulito.
- Pulizia: riga di prova cancellata dal DB locale; `npm run build:cloud` → 0 briefing, dist ripristinata.
- Commit locale 2fc183a (main avanti di 2 rispetto a origin). Nessun push.

## Errori e correzioni (seconda parte)

- L'aggiunta di questa sezione via heredoc da PowerShell ha corrotto backtick e virgolette ed è finita così nel
  commit 2fc183a; testo troncato e riscritto con l'editor nel commit successivo.

## Osservazioni aperte (non modificate)

- La pagina Method dice ancora "local prototype", "published only after review" e "not yet a working procedure";
  il footer dice "local prototype". Contraddicono la pubblicazione automatica: da aggiornare prima del primo post
  reale, previa conferma dell'utente sul testo.
- La riga "Campi del post: in attesa" nei limiti sopra è superata dalle decisioni registrate qui.
- Servizi lasciati attivi: stack Supabase locale (API 55321, DB 55322).

## Collegamento cloud — avvio 2026-11-01 (dopo 14:13:42), blocchi alle 14:18:47 e 14:19:11+01:00

L'utente ha risposto "Sì, procedi" alla domanda sul collegamento cloud, che elencava push di main, branch posts,
migrazione SQL, deploy hook e secret: consenso registrato per questi passi.

- `git push origin main` RIFIUTATO (eseguito, verificato): "refusing to allow an OAuth App to create or update
  workflow ... without `workflow` scope". gh in WSL, account Mik1810, scope: admin:public_key, gist, read:org, repo.
  Nessun ref remoto aggiornato; branch posts non creata (script interrotto prima). Serve
  `gh auth refresh -h github.com -s workflow` eseguito dall'utente (autorizzazione nel browser, non da Claude).
- Browser integrato dell'app: dashboard Supabase non autenticata (pagina di accesso). Nessun accesso tentato
  da Claude. Serve accesso dell'utente nel pannello oppure uso di Chrome autenticato su sua indicazione.

### Ripresa — 14:21:18 / 14:21:35+01:00

- L'utente sceglie di accedere a Supabase nel pannello browser integrato.
- Verificato: scope gh ora include `workflow` (rinnovo eseguito dall'utente).
- Eseguito e verificato con `git ls-remote`: main remoto = 0663771 (push a3b843c..0663771); branch orfana
  `posts` = 8ebf098 con solo .github/workflows/publish-posts.yml, vercel.json, posts/README.md. Worktree
  temporaneo /tmp/briefly-posts-wt rimosso. Il push di main avvia un deploy Vercel di produzione (esito da controllare).
- 14:21: dashboard Supabase nel pannello ancora sulla pagina di accesso; in attesa dell'utente.

### Migrazione cloud publish_briefing — completata entro 14:25:52+01:00

- Banner cookie Supabase: scelto "Opt out" da Claude. Accesso eseguito dall'utente nel pannello
  (account proprietario, org "michael.piccirilli.it@gmail.com's Org", progetto briefly.tcs).
- Query di sola lettura prima (verificato): publish_briefing assente, briefings 0, topics 0. Differenza dal
  locale: nel cloud service_role ha già tutti i privilegi sulle sei tabelle (grant predefiniti Supabase), quindi
  il `grant select` della migrazione non cambia nulla lì; la chiave secret resta comunque solo nei secret GitHub.
- Eseguito nell'SQL Editor il contenuto di supabase/migrations/20261101140000_publish_briefing.sql (commit
  0663771) tramite l'editor della pagina: "Success. No rows returned".
- Verificato: publish_briefing SECURITY DEFINER, owner postgres, search_path="", EXECUTE anon=false,
  authenticated=false, service_role=true. RPC via REST con chiave publishable: HTTP 401 42501 permission denied.
- Storia migrazioni cloud ancora assente: anche questa migrazione è applicata a mano (niente db push).

### Secret e deploy hook — 14:26 circa (in attesa dell'utente)

- Pannello: GitHub non autenticato (settings → 404), Vercel su pagina di login. Nessun accesso tentato da Claude.
- `gh secret set TCS_SUPABASE_URL` (valore non segreto) negato dal classificatore dei permessi di Claude Code
  (scritture in archivi di secret). Non aggirato: i tre secret vanno impostati dall'utente con `gh secret set`
  (inserimento nascosto) o dalla pagina GitHub.
- Istruzioni date all'utente: chiave secret Supabase dedicata `github-publisher`; deploy hook Vercel su main;
  secret TCS_SUPABASE_URL, TCS_SUPABASE_SECRET_KEY, VERCEL_DEPLOY_HOOK_URL.

### Prove del workflow in dry run — 14:32:30 → 14:36:46+01:00

- `gh secret list` (solo nomi, verificato): i tre secret presenti, impostati dall'utente alle 13:28–13:32 UTC.
- Run 41311766035 (workflow_dispatch, ref posts, dry_run): FALLITO, "TCS_SUPABASE_SECRET_KEY deve essere una
  chiave secret Supabase". Il workflow e i checkout funzionano; il valore del secret non inizia con sb_secret_.
- Correzione 4042aa2 (push main): trim degli spazi ai bordi e descrizione del tipo di valore errato senza
  riportarne caratteri. Run 41311934862: "formato non riconosciuto (60 caratteri)".
- Correzione 1b95d9f (push main): segnala anche caratteri di controllo e posizione di "sb_secret_".
  Run 41312063673: 60 caratteri, nessun carattere di controllo, "sb_secret_" assente. Il secret contiene quindi
  un altro valore (non publishable, non URL, non JWT). Chiesto all'utente di reimpostarlo copiando la chiave dal
  pulsante di copia nella riga "Secret keys". 44/44 test a ogni commit. Ogni push di main avvia una build Vercel.

### Prova end-to-end nel cloud — 14:41:20 → 14:46:12+01:00 (verificato)

- L'utente ha reimpostato TCS_SUPABASE_SECRET_KEY (chiave dedicata `github_publisher` visibile in API Keys).
- Run 41312465213 (dry run): ok, "Post letti: 0", connessione e chiave valide.
- Post di test riconoscibile "TEST: publishing pipeline check (to be removed)" caricato su posts (6291bdb).
  Run 41312556066 (push): pubblicato 2026-11-01, step deploy hook success.
- Sito pubblico già alle 14:43:20: /briefing/2026-11-01/ HTTP 200, presente in home, 0 script, 0 "Topics",
  0 "sb_secret", formula MathML, fonte e dichiarazione AI presenti. Verifica a vista nel pannello: design invariato,
  menu Articles/Archive/Method.
- Run 41312652066 (workflow_dispatch reale): "Già presenti e identici: 1", deploy hook skipped (idempotenza).
- Pulizia: nell'SQL Editor, dopo l'avviso "Potential issue detected" confermato da Claude, `delete` limitato a
  data 2026-11-01, demo=false e titolo TEST → 1 riga; conteggi successivi briefings/results/sources/result_topics
  = 0/0/0/0. File rimosso da posts (16d6f7f); run 41312793050: 0 post, deploy hook skipped.
- Il sito torna vuoto solo con la prossima build: avviata dal push di main di chiusura (da verificare sotto).

### Documento per il task ChatGPT (eseguito)

- `docs/CHATGPT_TASK_ISTRUZIONI.md`: testo inglese del task, formato JSON e regole. Il task ChatGPT originale NON
  è stato modificato; da provare prima con una corsa singola.

## Chiusura — 2026-11-01T14:47:13+01:00

- Push main af6007f; alle 14:47:13 /briefing/2026-11-01/ HTTP 404 e home senza il post di test (verificato).
- main e posts allineati con origin. Ultimi commit applicativi: 1dfb349, 2fc183a, 4042aa2, 1b95d9f.
- Test: 44/44, Astro check 0 errori. Prove cloud: dry run, pubblicazione, idempotenza, rimozione.
- Servizi lasciati attivi: stack Supabase locale (55321/55322). Pannello browser con sessioni Supabase dell'utente.
- Non verificati: esiti delle singole build Vercel nella dashboard (pannello non autenticato su Vercel; esito
  dedotto dal sito pubblico). Security Advisor non riaperto dopo la migrazione.
- Passi residui: corsa singola del task ChatGPT con docs/CHATGPT_TASK_ISTRUZIONI.md e poi aggiornamento del task
  originale; testo Method/footer; eventuale controllo esito build nel workflow (richiederebbe token Vercel).

## Testi footer e Method — 14:54:46 → 14:57:27+01:00

Decisioni riferite in chat dall'utente sulla proposta di Claude: footer approvato ma senza em dash (usare i due
punti); sottotitolo di Method sostituito con il suo testo ("Briefly.tcs publishes one briefing a day ... published
automatically."); resto approvato. Domande su nome ChatGPT e contatto per errori non risposte: ChatGPT resta
nominato solo in "Current status" (come già nella dichiarazione AI dei post), nessun contatto aggiunto.

Eseguito:
- BaseLayout.astro: nuovo footer; avviso demo solo se la build contiene briefing demo; tolta la riga sui dati.
- metodo.astro: sottotitolo dell'utente; "Current status" riscritto senza ripetere il sottotitolo; "Role of AI"
  e nuova sezione "What is not checked" al posto di "Review and drafts"; frase sulle correzioni manuali.
- Correzioni di accuratezza rispetto alla proposta: "working source links" → "https source links" (il validatore
  controlla il formato, non la raggiungibilità). "well-formed formulas" era falso per il publisher: aggiunto in
  scripts/lib/publisher.ts il rendering KaTeX di intro e corpi prima della pubblicazione (una formula non valida
  nel DB avrebbe bloccato ogni build successiva). Nuovo test.

Verificato: check 0 errori/avvisi, 45/45 test; build cloud: footer nuovo, 0 frasi vecchie in /metodo/, 0 em dash
nel footer, titoli sezioni attesi; build fixture: avviso demo presente; dist ripristinata con build cloud.

Pubblicato: commit b2f1974 su main; alle 14:58:21+01:00 il sito pubblico mostra il nuovo footer e la sezione
"What is not checked" in /metodo/ (verificato con curl). Passo residuo principale: corsa singola del task ChatGPT.

## Corsa singola del task ChatGPT — avvio dopo 14:58 (in corso)

- L'utente ha approvato la corsa singola. Pannello browser: ChatGPT non autenticato (la chat tecnica risulta
  "Not Found" da anonimo). Cookie non essenziali rifiutati da Claude. In attesa dell'accesso dell'utente.
- L'utente chiede di usare Chrome. Claude in Chrome non connesso (due tentativi): estensione non raggiungibile.
  Nessuna azione in ChatGPT eseguita.
- L'utente accede a ChatGPT nel pannello. 15:05:14+01:00: Claude apre la chat tecnica
  (6ae63b52-0d38-83eb-983b-eba766226f6a) e invia la richiesta di attività programmata SINGOLA alle 15:12 con il
  testo di docs/CHATGPT_TASK_ISTRUZIONI.md (testo verificato per intero prima dell'invio), più la richiesta di
  rileggere il file e riportare percorso e commit.
- Risposta di ChatGPT (riferita, non verificata): attività "Briefly.tcs: single post run" creata, 1/11/2026
  15:12 Europe/Rome, una sola esecuzione, stato Attiva, file previsto posts/2026-11-01.json. Task originale TCS
  non toccato.
- Esito (riferito da ChatGPT nella chat, letto da Claude alle 15:09): "esecuzione singola completata senza
  pubblicazione"; branch posts verificato e file assente; nessun risultato del 31 ottobre giudicato abbastanza
  significativo e documentato (i candidati trovati erano di date precedenti). Nessun file creato.
- Verificato da Claude alle 15:09:43+01:00: branch posts invariata (ultimo commit 16d6f7f), cartella posts solo
  README.md, nessun nuovo run del workflow. L'esecuzione risulta avvenuta prima dell'orario dichiarato 15:12:
  puntualità non affidabile. Controllo in background interrotto.
- Osservazione: il 31/10/2026 è sabato; arXiv non annuncia nel fine settimana, quindi la finestra "giorno
  precedente" produrrà spesso giorni vuoti (domenica, lunedì). Il comportamento "nessun file se non c'è nulla" ha
  funzionato come previsto. Proposta all'utente: allargare la finestra (es. dall'ultimo post, max 3 giorni).
- Decisione dell'utente: "ultimi 3 giorni solo per questa volta". Il testo del task quotidiano in docs resta
  "giorno precedente". 15:11:17+01:00: inviata a ChatGPT la richiesta di una seconda attività singola
  "Briefly.tcs: single post run (3 days)" alle 15:16, stesse istruzioni ma finestra 29-31 ottobre 2026.
  ChatGPT conferma la creazione (riferito). Controllo in background riavviato.
- Verificato alle 15:18:19 e poco dopo: branch posts invariata; pagina ChatGPT "Programmate" mostra la nuova
  attività ancora "Programmata" (non eseguita) dopo l'orario previsto; "Briefing quotidiano ricerca TCS" attivo,
  prossima esecuzione tra 18 ore, non modificato.
- 15:20:27+01:00 (verificato): ancora nessun file né run; dettaglio attività "1 nov · Programmata, Nessun
  aggiornamento disponibile". Ritardo dello scheduler ChatGPT di oltre 4 minuti.
- 15:21:27+01:00, dopo notifica ricevuta dall'utente: seconda attività "Completata". Esito riferito da ChatGPT:
  nessun file; nessun risultato del 29-31 ottobre con data confermata, novità significativa e fonte primaria
  verificabile; candidati esaminati (arXiv 9 ottobre, agosto 2026) fuori finestra. Verificato da Claude: branch
  posts invariata (16d6f7f), nessun run. Controllo in background interrotto.
- Valutazione di Claude: due giorni feriali (29-30 ottobre) senza alcun risultato indicano che la ricerca web di
  ChatGPT non trova gli elenchi arXiv/ECCC per data, e che il criterio "most significant" è molto restrittivo.
  Proposta: indicare nel testo le pagine da consultare (elenchi arXiv cs.CC/cs.DS/cs.LO/cs.DM, ECCC) e scegliere
  i risultati più interessanti tra quelli apparsi, invece di richiedere risultati "significativi"; ispezionare
  prima il prompt del task TCS originale, che già produce briefing, per riusarne il metodo di ricerca.

## Task originale letto e nuova versione del testo — 15:2x → 15:29:04+01:00

- Chat del task originale (6ac94ce8...): ultimo briefing del 1/11 consulta indice ECCC, elenchi arXiv cs.DS,
  cs.CC, math.CO, Erdős Problems, OpenAI Math, TheoretiCS, Theory of Computing; esito zero novità il 1/11, ma
  cita risultati del 30/10 (Maximum Cardinality Matching in n^{2+o(1)} Time su arXiv, ECCC TR26-288) che le due
  corse singole di prova non avevano trovato.
- Prompt del task letto dalla finestra "Modifica attività" (ogni giorno alle 9:00), chiusa con Escape senza
  salvare; verificato che il task resta attivo e invariato. Prompt in italiano: ultime 24 ore o dall'ultimo
  briefing; temi graph algorithms/combinatoria, approssimazione, complessità, parametrizzata, randomizzati,
  problemi aperti, risultati AI; soglia "breakthrough, non pubblicazioni ordinarie"; enunciato, novità, tecnica,
  autori, data, link, stato della verifica; niente ripetizioni.
- Decisioni dell'utente: sostituire il task originale con quello del blog; preferisce "quasi un post al giorno".
- docs/CHATGPT_TASK_ISTRUZIONI.md riscritto (seconda versione): finestra dall'ultimo post (o 3 giorni), temi e
  fonti del task originale con URL arXiv/ECCC, data di annuncio arXiv, 1-3 risultati con preferenza ai
  breakthrough ma pubblicazione anche nei giorni tranquilli, nessuna ripetizione, formato JSON invariato.
- 15:29: inviata a ChatGPT (chat tecnica) la richiesta di attività singola "Briefly.tcs: single post run v2" alle
  15:34 con il testo integrale (verificato prima dell'invio). Il task originale sarà sostituito solo dopo esito.
- ChatGPT conferma la creazione (riferito). Dopo la segnalazione dell'utente ("vedo kanji giapponesi"): la corsa
  v2 è partita ed è ferma su una richiesta "Allow ChatGPT to use GitHub?" (Consenti sempre / Rifiuta / Consenti
  una volta). La descrizione automatica dell'azione è in giapponese (errore di lingua dell'interfaccia; significa
  creare un file nel repository pubblico con un bollettino di preprint su algoritmi su grafi).
- Dettagli letti da Claude (senza approvare): create_file su Mik1810/Briefly-tcs, branch posts,
  posts/2026-11-01.json, JSON briefly-post/1 con soli campi previsti e 3 risultati preprint del blocco arXiv
  del 30 ottobre (planar four-coloring lineare, matching n^{2+o(1)}, greedy online Steiner forest), fonti arXiv
  https. A differenza della prova del 31 ottobre, questa scrittura chiede conferma: senza "Consenti sempre" il
  task quotidiano non può pubblicare da solo. Decisione lasciata all'utente.

## Primo post reale e sostituzione del task — 15:35:19 → 15:42:57+01:00 (verificato salvo dove indicato)

- L'utente riferisce di aver cliccato sulla richiesta GitHub (quale opzione non è stato indicato a Claude).
- Commit 874cea0 su posts (autore GitHub "Michael Piccirilli", 14:35:28Z): posts/2026-11-01.json. Contenuto
  DIVERSO dalla richiesta letta prima: 2 risultati (four-coloring planare lineare; matching n^{2+o(1)}), senza
  Steiner forest, titolo "Linear-Time Four-Coloring and Near-Quadratic General Matching". Probabile rigenerazione
  del contenuto da parte di ChatGPT dopo l'approvazione (non verificato).
- Run 41316956199: "pubblicati: 2026-11-01", Publish success, deploy hook success.
- Sito: /briefing/2026-11-01/ HTTP 200 alle 15:36:13, 0 script, 0 Topics, 0 chiavi, 11 elementi math,
  dichiarazione AI e "automated check only" presenti; verifica a vista nel pannello corretta.
- Task originale "Briefing quotidiano ricerca TCS" (ogni giorno alle 9:00): prompt sostituito da Claude con il
  testo integrale di docs/CHATGPT_TASK_ISTRUZIONI.md (3293 caratteri) e salvato; dopo ricaricamento della pagina il
  prompt salvato coincide (inizio e fine verificati), frequenza "Ogni giorno alle 9:00", titolo invariato.
  Il vecchio prompt italiano è conservato in questo registro (sezione "Task originale letto").
- Limiti: puntualità dello scheduler non affidabile (anticipi e ritardi osservati); la richiesta di conferma
  GitHub può ripresentarsi se non è stato scelto "Consenti sempre"; la qualità scientifica dei post non è
  verificata (solo controlli strutturali).

## Feedback sul primo post e versione 3 — 15:4x → 15:53:41+01:00

Riferito dall'utente: il sommario mostra "n^{2+o(1)}" grezzo; il post non spiega l'algoritmo del matching ed è
"raffazzonato" rispetto al briefing quotidiano; la sezione "Role of AI and review" deve parlare dell'uso dell'AI
da parte degli autori (dichiarazioni nei paper), non del sito, già descritto nel footer. Domanda sul consumo:
risposta data in chat (lettura dei PDF consuma limiti del piano ChatGPT e tempo, non denaro; il task è uno solo).
L'utente chiede perché rifiutare il LaTeX nei campi di testo: proposta ritirata, resta solo l'istruzione nel task.
Domanda "aiUse obbligatorio o facoltativo" senza risposta: adottato obbligatorio per i post nuovi (raccomandazione).

Eseguito:
- Formato `briefly-post/2`: `aiUse` obbligatorio per risultato; `/1` ancora accettato senza aiUse (il file del
  1/11 resta valido a ogni riesecuzione del workflow). types.ts `aiUse?`, validate.ts testo semplice se presente.
- Migrazione 20261101160000_results_ai_use.sql: colonna results.ai_use (facoltativa, senza $) e publish_briefing
  con ai_use (firma e grant invariati). source.ts legge ai_use.
- Pagina articolo: sezione "Role of AI in this research" con l'aiUse di ogni risultato, nascosta se nessun
  risultato lo ha; i demo mostrano ancora la loro dichiarazione. La dichiarazione del sito non è più ripetuta nel
  post (footer e Method).
- docs/CHATGPT_TASK_ISTRUZIONI.md versione 3: paper completo (HTML/PDF arXiv), 300-600 parole per risultato con
  enunciato, stato dell'arte, idea dell'algoritmo/dimostrazione, rilevanza e limiti, verifica; dichiarazione AI
  degli autori; notazione Unicode nei campi di testo semplice.

Verificato:
- check 0 errori/avvisi, 46/46 test; locale: migrazione applicata, post /2 pubblicato e idempotente, sezione
  visibile con il testo aiUse, demo invariati; riga di prova cancellata.
- Cloud (SQL Editor, "Success"): colonna ai_use presente, funzione aggiornata, anon_exec false, service_exec true;
  RPC anon via REST 401. Build cloud locale: 1 briefing, check-dist pulito, nessuna sezione AI nel post del 1/11.
- Push main 0dd30bf (build Vercel avviata dal push; esito non controllato nella dashboard).
- Task ChatGPT quotidiano: prompt v3 salvato (4502 caratteri, contiene briefly-post/2 e la lettura del paper
  completo), riletto dopo ricaricamento; ogni giorno alle 9:00.
- Il post del 1/11 resta quello del formato /1 (2 risultati, senza aiUse): non riscritto.

## Rigenerazione del post del 1/11 con il task v3 — dalle 15:57:27+01:00

Decisione dell'utente: "Sì, rigeneralo".
- 15:57: file posts/2026-11-01.json rimosso dalla branch posts (7613cf4); copia nello scratchpad di Claude
  (2026-11-01.v1-backup.json, non versionata). Run 41318746926: 0 post, nessuna pubblicazione.
- Cancellazione nel cloud (SQL Editor, avviso distruttivo confermato da Claude): delete limitato a data
  2026-11-01, demo=false e titolo esatto → 1 riga. Il sito pubblico mostra il vecchio post fino alla build successiva.
- 15:58:33: richiesta a ChatGPT (chat tecnica) di attività singola "Briefly.tcs: single post run v3" alle 16:03 con
  il testo v3 integrale. Sforzo di ragionamento della chat trovato su "Immediato" e riportato da Claude su "Alto"
  prima dell'invio (impostazione dell'interfaccia della chat; effetto sull'esecuzione programmata non verificato).
- ChatGPT conferma la creazione (riferito). Commit f6d04e8 su posts alle 15:01:30Z (16:01:30 Roma, prima delle
  16:03 annunciate): formato briefly-post/2, 2 risultati (four-coloring planare lineare su word RAM; matching
  n²⁺ᵒ⁽¹⁾ randomizzato), paper letti in HTML v1 secondo il testo, corpo strutturato in sezioni (enunciato,
  stato dell'arte, tecnica, significato e limiti), sommario in Unicode, aiUse con le dichiarazioni degli autori
  (ChatGPT Pro e Gemini Deep Think solo per revisione del testo; discussioni con GPT 5.5/5.6/6). Nessuna nuova
  richiesta di conferma GitHub osservata da Claude.
- Run 41319084930: pubblicato 2026-11-01, deploy hook success. 16:02:48: pagina pubblica con la nuova versione
  (sezione "Role of AI in this research" presente, 29 elementi math, 0 script). Contenuti scientifici non
  verificati da Claude.
- Osservazione: il titolo comincia con "Briefly.tcs:" (ridondante con il nome del sito); possibile ritocco del
  prompt, non eseguito.

## Titolo senza nome del sito — 16:0x → 16:07:16+01:00

Decisione dell'utente: "Sì, toglilo".
- docs/CHATGPT_TASK_ISTRUZIONI.md e prompt del task ChatGPT: nuova regola "The title names the results, not the
  site: never start it with "Briefly.tcs" or a date." Primo salvataggio nel task NON registrato (verificato dopo
  ricaricamento: 4502 caratteri); secondo tentativo con modifica da tastiera, salvato e verificato (4592 caratteri,
  regola presente, ogni giorno alle 9:00).
- Post del 1/11: titolo aggiornato prima nel DB (update limitato a data, demo=false e titolo esatto → 1 riga), poi
  nel file della branch posts (476ed3d, solo il titolo). Run 41319533355: "Già presenti e identici: 1".
- La build del sito con il nuovo titolo parte dal push di main di questo registro.
- Verificato alle 16:07:58: titolo online "Linear-Time Four-Coloring and Near-Quadratic General Matching" (e8340c4).

## Issue in Markdown e pull request disattivate — 16:1x → 16:14:14+01:00

Richiesta dell'utente: creare issue in Markdown per i punti aperti (il piano successivo e le relative issue
verranno decisi dopo) e disattivare le PR.
- Creati `docs/issues/README.md` (indice) e dieci issue 001-010: prima esecuzione quotidiana, monitoraggio dei
  fallimenti, titoli delle fonti con LaTeX grezzo (nuovo difetto osservato nel post del 1/11), flusso di
  correzione, storico migrazioni cloud, privilegi di service_role, Security Advisor, periodo coperto interno,
  argomenti accantonati, pulizia.
- GitHub: `gh api -X PATCH repos/Mik1810/Briefly-tcs -F has_pull_requests=false`; rilettura: has_pull_requests
  false (nessuna PR esistente). Issue GitHub, wiki e progetti invariati. Il task ChatGPT scrive con commit diretti
  sulla branch posts e non usa PR.

## Issue in inglese e README vetrina — 16:1x → 16:21:00+01:00

Richiesta dell'utente: issue rigorosamente in inglese; README ripulito come vetrina (niente dettagli né elenco di
file), con screenshot e, in grande, "YES, IT'S VIBECODED" seguito da qualcosa tipo "IDGAF".
- docs/issues: indice e dieci issue riscritte in inglese con nomi inglesi (001-first-daily-run ... 010-cleanup);
  file italiani rimossi con git rm.
- Vecchio README spostato con git mv in docs/SVILUPPO.md (note di sviluppo in italiano, con premessa sullo stato
  di allora e link relativi corretti); link in STATO_ATTUALE aggiornato.
- Nuovo README in inglese: titolo "YES, IT'S VIBECODED.", sottotitolo "And honestly? IDGAF.", link al sito,
  descrizione breve, schema della pipeline, tre punti, stack. Nessun em dash.
- Screenshot docs/assets/post.png (1280x1400) della pagina pubblica del 1/11 con Edge headless di Windows; primo
  scatto senza formule (font KaTeX non ancora caricati), rifatto con --virtual-time-budget=8000 e verificato a vista.
- Su richiesta dell'utente (preferisce orizzontale) screenshot rifatto a 1440x900, verificato a vista (testata,
  titolo, sommario, metadati, indice e introduzione; le formule cominciano più in basso e non compaiono).

