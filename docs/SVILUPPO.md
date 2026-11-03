# Briefly.tcs: note di sviluppo

> Questo era il README del repository fino al 2026-11-01, quando il README è diventato una vetrina in inglese.
> Alcune frasi descrivono lo stato di allora (prototipo locale); per lo stato attuale vedere
> `sessions/STATO_ATTUALE.md`. Pipeline di pubblicazione: `docs/CHATGPT_TASK_ISTRUZIONI.md`, punti aperti:
> `docs/issues/`. Dal 2026-11-03 gli argomenti non esistono più (pagine, tabelle e script
> `translate-demo-db.ts` rimossi): le parti seguenti che li citano sono storiche.

Blog di informatica teorica per studenti magistrali e ricercatori. Nome del sito: **Briefly.tcs**, approvato dall'utente (docs/DECISIONI.md) e applicato con l'incarico 05. I nomi precedenti erano «TCS quotidiano» e «TCS Daily».
Nomi interni invariati: pacchetto npm `tcs-quotidiano`, stack Supabase `tcs-quotidiano`.
**Lingua pubblica: inglese** (interfaccia, Metodo, 404, etichette di accessibilità, metadati, demo; `lang="en"`, date come "October 31, 2026").
Commenti tecnici, documentazione interna e registri restano in italiano. URL e ID non sono cambiati (es. `/archivio/`, `/metodo/`, `#risultato-<id>`).
Stato: **prototipo locale navigabile** con database Supabase locale e contenuti dimostrativi. Sito ancora locale; remote GitHub origin collegato a https://github.com/Mik1810/Briefly-tcs, senza hosting attivato.

## Database: Supabase locale

I contenuti stanno in un **database Supabase locale**, letto durante la build tramite l'API REST con la chiave
publishable (ruolo `anon`). Le policy RLS restituiscono solo i briefing pubblicati: le bozze non arrivano alla build.
Nel browser non c'è nessun SDK Supabase e nessuna chiave. Schema in `supabase/migrations/`, dati dimostrativi in
`supabase/seed.sql`, generato dalle fixture con `npm run db:seed:generate`.

Lo stack usa il **runtime nativo sperimentale** della CLI Supabase (`[experimental] stack = true`):
i servizi girano come processi in WSL e ascoltano solo su `127.0.0.1`.
Non si usa Docker per due motivi: in questa WSL `/var/run/docker.sock` non è disponibile, e `supabase start` con Docker
pubblica le porte su tutte le interfacce. I dettagli sono in docs/coordination/REPORT_02_CLAUDE.md.
Dati e cache dello stack stanno in `~/.supabase/` (fuori dal repository).

Porte locali: API/REST 55321, Postgres 55322, Studio 55323 (tutte su 127.0.0.1).

## Aggiornare i demo di un database esistente (senza reset)

`npm run db:reset` cancella i dati: non usarlo per aggiornare i demo. Per portare i demo italiani di un database
già avviato alla versione inglese si usa `scripts/translate-demo-db.ts`:

```sh
node scripts/translate-demo-db.ts           # confronto a vuoto: nessuna scrittura
node scripts/translate-demo-db.ts --apply   # aggiorna solo le righe identiche alla baseline italiana
```

Lo script confronta ogni riga con la baseline italiana conservata in `.local/it-baseline/`, ignorata da Git.
Aggiorna solo le righe che coincidono in tutte le colonne, con un'unica istruzione SQL atomica.
Le righe modificate, estranee o mancanti vengono preservate e segnalate.
Il seed (`supabase/seed.sql`) è già in inglese: serve per le istanze nuove.

## Comandi

Richiede Node v24.18.0, già presente in WSL tramite nvm (`.nvmrc`). Eseguire da WSL nella cartella del progetto.
`engines.node` è `>=24.18.0 <25`: si resta sul major 24 testato (un intervallo aperto come `>=24` può far scegliere
a Vercel un major più recente).

```sh
npm ci                  # dipendenze esatte del lockfile, CLI Supabase 2.122.0 compresa
npm run db:start        # avvia lo stack nativo e scrive .env (URL e chiave publishable; nessuna chiave stampata)
npm run db:reset        # SOLO questa istanza: riapplica migrazioni e seed
npm run db:verify       # verifica integrazione e RLS: lettura pubblica, bozza invisibile, scritture anonime negate
npm run db:advisors     # controlli di sicurezza e prestazioni della CLI
npm run db:stop         # ferma lo stack (i dati restano)

npm run dev             # server di sviluppo che legge da Supabase (http://localhost:4321)
npm run check           # astro check + test di Node (in modalità fixture, senza database)
npm run build           # legge Supabase, genera, controlla e sostituisce dist/
npm run preview         # serve dist/ in locale

npm run build:fixture   # build dimostrativa offline dalle fixture, solo se richiesta esplicitamente
npm run dev:fixture

npm run build:cloud     # come build, ma legge il progetto Supabase cloud (.env.cloud o variabili d'ambiente)
npm run dev:cloud
```

### Target Supabase: locale o cloud

`TCS_SUPABASE_TARGET` (impostata dagli script) sceglie il database: `local` (predefinito) o `cloud`.

| Target | URL ammesso | File letto per i valori mancanti |
| --- | --- | --- |
| `local` | `http(s)://127.0.0.1`, `localhost` o `[::1]`, porta qualsiasi | `.env` (da `npm run db:env`) |
| `cloud` | solo `https://<ref>.supabase.co`, senza porta, percorso, query, frammento o credenziali | `.env.cloud` |

- Precedenza, variabile per variabile: **variabili d'ambiente già impostate** (per esempio su Vercel) > file del target.
  Il target cloud non legge mai `.env` e non ripiega sulle fixture: se mancano valori la build si ferma.
- `.env.cloud` è privato e ignorato da Git (formato in `.env.example`); va creato a mano con URL e chiave publishable.
- Chiave: solo publishable (`sb_publishable_…`) o JWT legacy con ruolo `anon`. Chiavi `sb_secret_…`, JWT `service_role`
  o formati sconosciuti vengono rifiutati senza riportarne il contenuto nell'errore.
- Log di build e check-dist indicano il target e l'host (`Supabase cloud (<ref>.supabase.co)`), mai la chiave.
- Un database vuoto è valido: home, archivio e argomenti mostrano gli stati vuoti, Metodo resta disponibile.
- `npm run db:verify` usa sempre lo stack locale.
- Come arrivano i valori cloud ad Astro: `build:cloud` e `dev:cloud` avviano Node con `--env-file-if-exists=.env.cloud`,
  che carica il file in `process.env` prima di Astro senza sovrascrivere variabili già impostate; i processi figli
  e i worker le ereditano. Se il file manca (es. Vercel con sole variabili esterne) non è un errore.
- In modalità cloud `astro.config.mjs` imposta `vite.envDir: false`: Astro non carica `.env`. Senza questo, durante
  `astro build` Astro copiava i valori di `.env` locale nel `process.env` dei worker, che ricevevano l'URL 127.0.0.1.

La sorgente si sceglie con `TCS_CONTENT_SOURCE`, impostata esplicitamente da ogni script (`supabase` o `fixture`).
Senza questa variabile la build si ferma. Con un database non raggiungibile la build fallisce con un messaggio chiaro:
**non c'è nessun ripiego sulle fixture**.

`npm run build` genera prima in `dist-staging/`, esegue `scripts/check-dist.ts` e solo se tutto riesce sostituisce `dist/`.
Una build fallita (database fermo, dati non validi, controlli non superati) lascia intatta l'ultima `dist/` valida.

Gli script disattivano la telemetria di Astro (`ASTRO_TELEMETRY_DISABLED=1`) e della CLI Supabase
(`SUPABASE_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`). La build non usa modelli AI; l'unico servizio remoto
possibile è il progetto Supabase cloud, solo con `build:cloud`/`dev:cloud`.
Il progetto sta su `/mnt/c`: installazione e build sono più lente che nella home Linux, e il watch di `npm run dev`
potrebbe non accorgersi di file salvati da editor Windows. In quel caso riavviare il server.

## Architettura

- **Astro statico** con **componenti React** renderizzati in HTML durante la build. Nessuna direttiva `client:*`:
  le pagine non includono JavaScript. CSS scritto a mano in `src/styles/global.css`, font di sistema.
- **Formule**: Markdown con `$…$` e `$$…$$`, convertito in build con unified + remark-math + rehype-katex
  (`src/lib/markdown.ts`). CSS e font di KaTeX serviti localmente, solo nelle pagine articolo.
  Una formula non valida interrompe la build.
- **Contenuti**: modello in `src/lib/content/types.ts`; tutto passa da `src/lib/content/repository.ts`,
  che sceglie la sorgente (`supabase/source.ts` o `fixtures/`), valida i dati (`validate.ts`) ed esclude le bozze.
- **Markdown sicuro**: nessun HTML grezzo; `rehype-sanitize` elimina link con protocolli diversi da http, https e mailto
  (per esempio `javascript:`). Le formule in blocco sono regioni etichettate, raggiungibili e scorrevoli da tastiera.
- **URL**: `/`, `/briefing/YYYY-MM-DD/` (un briefing al giorno, con ancore `#risultato-<id>`),
  `/archivio/`, `/argomenti/`, `/argomenti/<slug>/`, `/metodo/`.
- Le date editoriali sono stringhe `YYYY-MM-DD`, mai convertite con un fuso orario.

## Controlli

- `tests/` (test runner di Node, nessuna dipendenza): date di calendario, regole dei metadati, esclusione delle bozze,
  errori di formula, HTML grezzo e link pericolosi, scelta della sorgente ed errore con database irraggiungibile.
- `npm run db:verify`: integrazione reale con lo stack locale e prove RLS.
- `scripts/check-dist.ts`, dopo ogni build: nessuna traccia delle bozze in `dist/`, pagine per argomento solo con
  risultati pubblicati, date e ancore presenti, etichetta "Contenuto dimostrativo", link interni e ancore validi,
  nessun `<script>` né risorsa remota. Stampa le misure di HTML, CSS, font e JS.

## Documenti

- [Decisioni aggiornate e stato reale, prevalenti](DECISIONI.md)
- [Piano iniziale e fasi](PIANO.md)
- [Proposte grafiche](design/PROPOSTE.md) · [Tavola di confronto](design/CONFRONTO.png)
- [Incarico 01](coordination/IMPLEMENTAZIONE_01.md) · [Report 01 di Claude](coordination/REPORT_01_CLAUDE.md)
- [Incarico 02](coordination/IMPLEMENTAZIONE_02_SUPABASE.md) · [Report 02 di Claude](coordination/REPORT_02_CLAUDE.md)
- [Incarico a Claude e aggiornamenti](coordination/BRIEF_CLAUDE.md)
- [Prima revisione di Claude](coordination/CLAUDE_REVIEW.md) · [Sintesi](coordination/SINTESI.md)

I testi dimostrativi non sono notizie di ricerca reali: descrivono risultati classici da manuale.
Tavola generata con ImageGen; prompt in docs/design/PROMPT_IMMAGINE.txt.

## Registro delle sessioni

Per riprendere leggere [sessions/STATO_ATTUALE.md](../sessions/STATO_ATTUALE.md) e [indice dei registri](../sessions/README.md).
Ogni sessione di Codex e Claude registra attività, esiti, errori, commit e prossimi passi con data e ora Europe/Rome.
