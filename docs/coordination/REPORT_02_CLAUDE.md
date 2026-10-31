# Report 02 di Claude — Supabase locale

Data: 31 ottobre 2026. Ambiente: WSL Ubuntu, rete WSL `mirrored`, Node v24.18.0. Nessun commit eseguito.

## Esito

**L'integrazione è implementata e verificata sull'istanza locale.**
- `npm run build` legge i contenuti dal database Supabase locale tramite REST con la chiave publishable (ruolo anon).
- RLS lascia passare solo i briefing pubblicati.
- Le scritture anonime vengono negate.
- Con il database fermo la build fallisce e lascia intatto l'ultimo `dist/` valido.

## Blocco Docker e scelta del runtime

Il brief indicava `/var/run/docker.sock` disponibile. Non lo è:
- `ls` restituisce "No such file or directory";
- esiste `/var/run/docker-cli.sock`, ma nessun processo lo ascolta (curl: connection refused);
- `docker` è un wrapper verso `docker.exe` (named pipe Windows);
- l'integrazione WSL di Docker Desktop per Ubuntu non risulta attiva.

Ho verificato anche che la CLI 2.122.0 con Docker pubblica le porte come `-p <host>:<container>`, senza indirizzo:
- `apps/cli/src/command-internal/db-bootstrap/docker-create-args.ts`, funzione `formatPortBindingFlag`;
- `apps/cli-go/internal/db/start/start.go:120`, `PortBinding{HostPort: ...}`.

Docker Desktop le esporrebbe quindi su tutte le interfacce di Windows. Restringerle a loopback richiederebbe di cambiare la configurazione globale di Docker, cosa vietata.

Ho provato il binario Windows della stessa versione, estratto dal pacchetto `@supabase/cli-windows-x64@2.122.0` con integrità sha512 verificata contro il lockfile. Funzionava via interop, ma avrebbe avuto lo stesso problema delle porte. L'ho scartato e ho rimosso il wrapper e `.tools/`.

**Scelta: runtime nativo dei comandi `stack`** (`[experimental] stack = true`, `supabase start --runtime native`).
- È documentato su Ubuntu ≥22.04 e non richiede Docker né modifiche globali.
- Nel sorgente i servizi nativi ascoltano su `127.0.0.1` (`packages/stack/src/Network.ts:119`).
- Postgres nativo non apre porte TCP proprie (`listen_addresses=` vuoto): è raggiungibile solo dal proxy su loopback.
- Verificato con `ss -ltnp`: tutte le porte dello stack sono su `127.0.0.1`.
- **Limite**: i comandi `stack` sono sperimentali ed esclusi dalla promessa di compatibilità della CLI.

## Servizi e porte

Stack `tcs-quotidiano`, runtime `native`, branch `main`. Stato e dati in `~/.supabase/stacks/<id>/`, cache in `~/.supabase/cache/stack`.

| Servizio | Indirizzo |
|---|---|
| API/REST (gateway + PostgREST) | 127.0.0.1:55321 |
| Postgres | 127.0.0.1:55322 |
| Studio | 127.0.0.1:55323 |
| pg-meta (per Studio) | 127.0.0.1, porta assegnata dalla CLI (24954 in questa sessione) |
| controllo dello stack | 127.0.0.1, porta assegnata dalla CLI (46407 in questa sessione) |

- Auth, realtime, storage, edge runtime, analytics, mailpit e pooler sono disattivati in `config.toml`.
- REST, pg-meta e Studio partono alla prima richiesta.
- Il Postgres di sistema su 127.0.0.1:5432, i volumi Docker di altri progetti (`fuelradar`, `paperdeck`), Docker Desktop e il server di Codex sul 4321 non sono stati toccati.
- **Lo stack è lasciato avviato** per la QA e le build di Codex: si ferma con `npm run db:stop`. È il database, non un server web.

## Schema e migrazioni

- Migrazione `supabase/migrations/20261031122537_editorial_schema.sql`, creata con `supabase migration new`.
- **Scelta relazionale**, sei tabelle: `topics`, `briefings`, `results`, `result_topics`, `sources`, `corrections`. L'alternativa era un JSON per briefing; la motivazione è nell'intestazione della migrazione:
  - vincoli nel DB: una data per briefing, slug, vocabolari chiusi;
  - argomenti con chiave esterna;
  - correzione legata a un risultato **dello stesso** briefing, tramite chiave esterna composta;
  - RLS per riga;
  - deduplicazione futura di risultati e fonti.
- `auto_expose_new_tables = false` ed è esposto solo lo schema `public`.
- Privilegi: `revoke all` a anon e authenticated, poi solo `grant select` ad anon.
- RLS attiva su tutte e sei le tabelle, con policy solo `for select to anon`:
  - argomenti: tutti (è il vocabolario);
  - briefing: `status = 'pubblicato'`;
  - tabelle figlie: `exists` sul briefing pubblicato.
- Nessuna policy di scrittura.
- Seed: `supabase/seed.sql`, generato da `scripts/generate-seed.ts` a partire dalle fixture validate. Contiene gli stessi 3 demo e la stessa bozza, tutti dimostrativi.
- `supabase migration list --local`: migrazione `20261031122537` applicata.
- `supabase db advisors --local --type all --level info`: solo 2 avvisi **INFO** `unused_index`, su `result_topics_topic_slug_idx` e `corrections_result_idx`. Sono indici delle chiavi esterne su un database appena creato. Nessun avviso di sicurezza.
- Non ho seguito il flusso della skill con `db query` iterativo e `db pull`. Ho scritto la migrazione e l'ho applicata con `db reset --local`, solo su questa istanza, che dà lo stesso risultato riproducibile.

## Esiti RLS (`npm run db:verify`, eseguito più volte, ultima dopo il reset)

- Vista privilegiata (`supabase db query --local --output-format json`): 3 pubblicati, 1 bozza (2026-11-01).
- Lettura anonima di `briefings`: HTTP 200, solo 2026-10-29, 2026-10-30, 2026-10-31.
- Contenuto completo letto dalla sorgente Supabase: identico alle fixture pubblicate. Confronto profondo su risultati, fonti, correzioni e argomenti.
- Lettura anonima della bozza (briefing, risultati, fonti, argomenti, correzioni filtrati per data o id): HTTP 200 con **zero righe**.
- Scritture anonime: `POST topics`, `POST briefings`, `PATCH` di un pubblicato, `PATCH` della bozza a pubblicato, `DELETE`. Tutte ricevono **HTTP 401, codice 42501 permission denied**; dopo i tentativi righe, titolo e stato della bozza restano invariati.
- **Richiesta senza chiave**: HTTP 200 con 3 righe. Il gateway nativo locale tratta le richieste senza chiave come anon; RLS si applica comunque.

## Build e guasti (verificati)

- `npm run build`, con `TCS_CONTENT_SOURCE=supabase`:
  1. validazione;
  2. `astro build --outDir dist-staging`;
  3. `check-dist` su `dist-staging`;
  4. sostituzione di `dist/`.
  
  Risultato: 12 pagine, 3 briefing, check-dist senza problemi.
- **Database fermo** (`npm run db:stop`, poi `npm run build`): uscita 1 con "Database Supabase locale non raggiungibile su http://127.0.0.1:55321 (connect ECONNREFUSED …). … La build si interrompe senza usare le fixture." Hash SHA-256 di `dist/` invariato, nessun `dist-staging/` residuo.
- **Errore dopo la generazione**: con un UPDATE privilegiato ho inserito il marcatore delle bozze nel titolo di un risultato pubblicato. Astro genera, check-dist segnala 3 problemi, uscita 1, `dist/` invariato, staging rimosso. Database ripristinato con `npm run db:reset`.
- Dopo `db:stop` e `db:start` i dati sono persistiti (4 briefing nella vista privilegiata).
- `npm run build:fixture`: le pagine differiscono dalla build Supabase solo nella riga che indica la sorgente. Verificato con diff sull'articolo lungo, normalizzando quella riga.

## Rilievi di Codex corretti

- Link `javascript:`: aggiunto `rehype-sanitize@6.0.0` prima di KaTeX, con protocolli `href` limitati a http, https e mailto più gli URL relativi.
  - `javascript:`, `JaVaScRiPt:`, `data:` e `vbscript:` perdono l'`href`.
  - KaTeX continua a funzionare e l'HTML grezzo resta escluso.
  - Test in `tests/markdown.test.ts`.
- Formule in blocco: diventano `<div class="katex-display" tabindex="0" role="region" aria-label="Formula in blocco">`, quindi si raggiungono con Tab e si scorrono con le frecce. Le formule in linea restano senza tabindex. Test dedicato; verificato in `dist/`: 4 regioni nell'articolo lungo.
  - Limite: anche le formule corte ricevono il focus. Senza JavaScript non si può sapere in build se una formula sborda.
- Correzione nello stesso giorno: preservata, con il test esistente.

## Comandi realmente eseguiti (principali)

- `npm install -D supabase@2.122.0`, `npm install rehype-sanitize@6.0.0`, `npm install -D @types/hast@3.0.5`. Ogni `npm audit`: 0 vulnerabilità.
- CLI: `--help` per `init`, `start`, `stack`, `telemetry`, `migration new`, `migration list`, `db reset`, `db advisors`, `db query`, `status`. Poi:
  - `init`, eseguito con il binario Windows durante la prova e poi riconfigurato a mano;
  - `start --runtime native`, con output su file privato poi cancellato;
  - `migration new editorial_schema`;
  - `db reset --local` (2 volte);
  - `db advisors --local`;
  - `db query --local`;
  - `migration list --local`;
  - `stop`.
- `node scripts/write-env.ts`: legge `supabase status --output-format json` in memoria e scrive `.env` (permessi 600) con solo URL e chiave publishable. Nessuna chiave stampata né riportata. La ricerca di `sb_secret_`, `sb_publishable_` e JWT nei file fuori da `.env` non ha trovato nulla.
- `npm run check`: astro check 0 errori, 0 avvisi; 25 test superati.
- `npm run build` e `npm run build:fixture`, più le prove di guasto descritte sopra.
- Accessi di rete:
  - registry npm;
  - documentazione Supabase (pagine `.md`);
  - sorgente della CLI su GitHub (API tree e raw) per verificare il binding delle porte;
  - download degli archivi `slim-services` da parte della CLI al primo avvio, con checksum verificati dalla CLI.
  
  Il changelog non l'ho riletto, perché il manager l'aveva già consultato.

## Correzione dopo la verifica indipendente di Codex

**Problema riprodotto.** In un terminale normale `npm run db:verify` falliva su `JSON.parse` in `scripts/verify-db.ts:26`. La causa è che `supabase db query --local` non chiedeva un formato esplicito, e la CLI lo sceglie in base all'ambiente:
- se rileva un agente (`CLAUDECODE`, `AI_AGENT` e simili) stampa JSON;
- altrimenti stampa una tabella Unicode.

Le mie esecuzioni precedenti di `db:verify` erano avvenute solo nell'ambiente dell'agente, quindi non coprivano il caso normale.

**Correzione** (solo `scripts/verify-db.ts`, nessuna modifica a grafica o schema):
- il comando privilegiato usa sempre `--output-format json`;
- anche con JSON esplicito la forma dipende dall'ambiente, verificato su `select 1`:
  - terminale normale: elenco di righe (`[{"n":1}]`);
  - agente: `{boundary, rows, warning}`;
- il parser accetta solo queste due forme e controlla che le righe siano oggetti;
- in caso di errore non riporta l'uscita della CLI, che potrebbe contenere dati.

Altri usi della CLI ricontrollati:
- `scripts/write-env.ts` chiedeva già `status --output-format json`; la forma (`env` con `API_URL` e `PUBLISHABLE_KEY`) è identica nei due ambienti e lo script la verifica;
- `db:start` usa `--output-format json` e scarta l'output;
- nessun altro script interpreta l'uscita della CLI.

**Esiti veri in ambiente pulito.** Ho tolto tutte le variabili `CLAUDE*` e `AI_AGENT` (`env -u …`, 0 rimaste). Non ci sono variabili `SUPABASE_*` di formato.
- `npm run db:env`: `.env` scritto, nessuna chiave stampata.
- `npm run db:verify`: tutte le verifiche superate, con gli stessi esiti della sezione RLS:
  - 3 pubblicati e 1 bozza;
  - lettura anonima solo delle 3 date pubblicate e contenuto identico alle fixture;
  - bozza a zero righe;
  - 5 scritture anonime con HTTP 401 / 42501 e dati invariati;
  - senza chiave: HTTP 200, 3 righe.
- `npm run db:verify` nell'ambiente dell'agente: superato anche lì.
- `npm run check`: astro check 0 errori, 0 avvisi; 25 test superati.
- `npm run build`, con `TCS_CONTENT_SOURCE=supabase` e non fixture: "3 briefing ricevuti e validati", 12 pagine, check-dist senza problemi, `dist/` sostituito. Il piè di pagina di `dist/index.html` riporta "Dati: database Supabase locale…".
- Il server statico di Codex su 127.0.0.1:4321 non è stato toccato ed è ancora in ascolto.

## File principali

- `supabase/config.toml`, `supabase/supabase.lock` (versioni dei servizi), `supabase/migrations/…`, `supabase/seed.sql`.
- `src/lib/content/supabase/source.ts`, `src/lib/content/config.ts`, `src/lib/content/repository.ts`, `src/lib/markdown.ts`.
- `scripts/build.ts`, `scripts/verify-db.ts`, `scripts/write-env.ts`, `scripts/generate-seed.ts`, `scripts/check-dist.ts` (cartella come argomento).
- `tests/source.test.ts`, `tests/markdown.test.ts`, `.env.example`, `package.json`, `README.md`, `docs/DECISIONI.md`, `src/pages/metodo.astro` (frase sullo stato).

## Limiti reali

- Runtime nativo sperimentale. Le versioni dei servizi sono fissate in `supabase/supabase.lock`, ma flag e comportamento dei comandi `stack` possono cambiare tra versioni della CLI.
- Docker Desktop non è usato. Per tornarci servirebbero l'integrazione WSL attiva e una soluzione al binding su tutte le interfacce: decisione dell'utente.
- Con Supabase la build non riceve mai le bozze, quindi `check-dist` non può confrontarle per data o titolo. Restano il controllo del marcatore e degli argomenti, e la prova RLS di `db:verify`.
- La build legge il database due volte: validazione iniziale e generazione Astro. Una modifica concorrente tra le due letture non viene rilevata.
- La sostituzione di `dist/` avviene con due rinomine, non con uno scambio atomico.
- Studio è configurato su 55323, ma non l'ho aperto né verificato in un browser.
- Non ho eseguito `npm run dev`, `npm run preview` né alcun browser.
- `config.toml` mantiene il riferimento predefinito `openai_api_key = "env(OPENAI_API_KEY)"` di Studio; la variabile non è impostata.
- Non esiste ancora un flusso di scrittura editoriale nel database: il seed è solo dimostrativo.
