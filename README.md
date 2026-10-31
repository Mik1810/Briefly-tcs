# TCS quotidiano

Blog italiano di informatica teorica per studenti magistrali e ricercatori. Nome provvisorio.
Stato: **prototipo locale navigabile** con database Supabase locale e contenuti dimostrativi. Nessun deployment, nessun remote Git.

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

## Comandi

Richiede Node v24.18.0, già presente in WSL tramite nvm (`.nvmrc`). Eseguire da WSL nella cartella del progetto.

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
```

La sorgente si sceglie con `TCS_CONTENT_SOURCE`, impostata esplicitamente da ogni script (`supabase` o `fixture`).
Senza questa variabile la build si ferma. Con un database non raggiungibile la build fallisce con un messaggio chiaro:
**non c'è nessun ripiego sulle fixture**.

`npm run build` genera prima in `dist-staging/`, esegue `scripts/check-dist.ts` e solo se tutto riesce sostituisce `dist/`.
Una build fallita (database fermo, dati non validi, controlli non superati) lascia intatta l'ultima `dist/` valida.

Gli script disattivano la telemetria di Astro (`ASTRO_TELEMETRY_DISABLED=1`) e della CLI Supabase
(`SUPABASE_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`). La build non usa modelli AI né servizi remoti.
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

- [Decisioni aggiornate e stato reale, prevalenti](docs/DECISIONI.md)
- [Piano iniziale e fasi](docs/PIANO.md)
- [Proposte grafiche](docs/design/PROPOSTE.md) · [Tavola di confronto](docs/design/CONFRONTO.png)
- [Incarico 01](docs/coordination/IMPLEMENTAZIONE_01.md) · [Report 01 di Claude](docs/coordination/REPORT_01_CLAUDE.md)
- [Incarico 02](docs/coordination/IMPLEMENTAZIONE_02_SUPABASE.md) · [Report 02 di Claude](docs/coordination/REPORT_02_CLAUDE.md)
- [Incarico a Claude e aggiornamenti](docs/coordination/BRIEF_CLAUDE.md)
- [Prima revisione di Claude](docs/coordination/CLAUDE_REVIEW.md) · [Sintesi](docs/coordination/SINTESI.md)

I testi dimostrativi non sono notizie di ricerca reali: descrivono risultati classici da manuale.
Tavola generata con ImageGen; prompt in docs/design/PROMPT_IMMAGINE.txt.
