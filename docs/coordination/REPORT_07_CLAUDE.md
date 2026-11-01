# Report 07 — Claude: sito collegabile a Supabase cloud

Data: 2026-11-01 (Europe/Rome). Partenza b85d0b3. Nessun commit. Registro:
[sessions/2026-11-01_13-13-42_claude-supabase-cloud-target.md](../../sessions/2026-11-01_13-13-42_claude-supabase-cloud-target.md).

## Implementazione

- **Nuovo `src/lib/content/supabase/config.ts`** (sostituisce `readSupabaseConfig` di `source.ts`):
  - `TCS_SUPABASE_TARGET`: `local` (predefinito, anche se vuota) o `cloud`; altri valori → errore.
  - URL: deve essere solo un'origine (`href === origin + '/'`), senza credenziali. Local: http/https su
    `127.0.0.1`/`localhost`/`[::1]`. Cloud: `https:`, host `^[a-z0-9]{20}\.supabase\.co$`, nessuna porta esplicita
    diversa da 443. Gli errori riportano al massimo l'hostname, mai l'URL intero (potrebbe contenere password).
  - Precedenza per variabile: `process.env` > file del target (`.env` per local, `.env.cloud` per cloud). Il file si
    legge con `util.parseEnv` solo se manca una variabile, senza modificare `process.env`. Cloud non legge mai `.env`.
  - Chiave: ammesse `sb_publishable_…` e JWT legacy con `role: anon` (payload decodificato, firma non verificata).
    Rifiutate `sb_secret_…`, JWT `service_role`, JWT con altri ruoli/illeggibili e formati sconosciuti (vale anche
    per local). Nessun errore contiene la chiave.
  - Opzioni `{ env, cwd, target }` per i test e per `db:verify`, che forza `target: 'local'`.
- `supabase/source.ts`: `SupabaseConfig` include `target`; descrizione pubblica `local …`/`hosted Supabase database …`;
  messaggio di rete distinto (cloud: "Verificare la rete e TCS_SUPABASE_URL"), sempre "senza usare le fixture".
- `ContentSource.logLabel` (solo log): `Supabase cloud (<ref>.supabase.co)`, `Supabase local (127.0.0.1:55321)`,
  `fixture`. Usata da `scripts/build.ts` e `check-dist.ts`.
- `package.json`: `build`/`dev` impostano ora `TCS_SUPABASE_TARGET=local` esplicito; nuovi `build:cloud`, `dev:cloud`.
- `metodo.astro`: frase "reading the local Supabase database" → "generated at build time by reading the Supabase
  database" (corretta per entrambi i target). Nessun componente, CSS o dato toccato.
- `.env.example` e README (tabella target, precedenza, chiavi, log, DB vuoto). Nessuna config Vercel, nessuna dipendenza.

## Verifiche eseguite

- `npm run check`: astro check 0 errori/avvisi/suggerimenti; **33 test superati** (8 nuovi in
  `tests/supabase-config.test.ts`: selezione target, URL cloud/local ammessi e rifiutati, precedenza ambiente/file e
  assenza di ripiego su `.env`, chiavi privilegiate senza eco, cloud vuoto valido con fetch simulato, cloud
  irraggiungibile, `scripts/build.ts` con DB irraggiungibile su loopback:9 che esce 1 lasciando `dist/` invariato).
- Copia di `dist/` in `.local/preview-before-cloud` (74 file) prima della build fixture.
- `npm run build:fixture`: 12 pagine, check-dist senza problemi, `dist/` sostituito (ora contiene la build fixture).
- Build a DB vuoto una tantum: server HTTP in-process su 127.0.0.1 che risponde `[]`, `astro build` in
  `.local/empty-db-check` + check-dist: 5 pagine (home, archivio, argomenti, metodo, 404), stati vuoti presenti,
  nessuno `<script>`, check-dist pulito; `dist/` non toccato. Cartella e script temporanei rimossi, processo terminato.

## Correzione 1 — conflitto .env / .env.cloud in `build:cloud` (riferito da Codex, corretto da Claude)

- **Errore reale (riferito da Codex)**: con `.env` locale e `.env.cloud` entrambi presenti, il preflight di
  `build:cloud` leggeva il cloud (0 briefing), ma durante il prerender `vite-plugin-env` di Astro copiava `.env` nel
  `process.env` (solo in build, senza sovrascrivere variabili già presenti); `readSupabaseConfig` vedeva 127.0.0.1 e
  rifiutava il target cloud. Build fallita, `dist/` preservato, nessuna chiave esposta. I test con env esplicite non
  coprivano questo caso.
- **Riprodotto da Claude** su copia temporanea del progetto in /tmp con `.env`/`.env.cloud` fittizi e fetch simulato
  (preload `--import`): stesso errore ("ricevuto host 127.0.0.1"), `dist/` preservato.
- **Correzione**:
  - `build:cloud`: `node --env-file-if-exists=.env.cloud scripts/build.ts`; `dev:cloud`:
    `node --env-file-if-exists=.env.cloud node_modules/astro/bin/astro.mjs dev` (percorso CLI verificato nel pacchetto).
    Node non sovrascrive variabili già impostate; figli e worker ereditano `process.env`.
  - `astro.config.mjs`: `vite: { envDir: false }` quando `TCS_SUPABASE_TARGET=cloud` (Vite 8.3.5 supporta `false`;
    Astro usa `config.vite.envDir ?? root`). Astro non carica più `.env` in cloud: nessun ripiego locale possibile.
  - `engines.node` `>=24.18.0 <25` in package.json e nella radice di package-lock (riga unica; versioni delle
    dipendenze verificate identiche dopo `npm install --package-lock-only --offline`).
- **Verifiche di Claude** (copie temporanee, valori fittizi, fetch simulato, nessuna rete):
  - `build:cloud` con entrambi i file: OK, 5 pagine, check-dist pulito, richieste solo all'host cloud con la chiave di `.env.cloud`.
  - Solo variabili esterne, nessun file (caso Vercel): OK, chiave esterna.
  - File presenti + chiave esterna: prevale l'esterna.
  - Solo `.env`, o URL cloud esterno senza chiave e senza `.env.cloud`: build fermata ("cloud mancante"), `dist/`
    preservato, nessuna richiesta verso il locale.
  - `dev:cloud` con entrambi i file: home e archivio HTTP 200, footer "hosted", stato vuoto, richieste solo cloud;
    server fermato. `build` locale continua a leggere `.env`.
  - `npm run check`: primo tentativo 2 errori TS (import con query di `astro.config.mjs`), corretto con specificatore
    dinamico; poi 0 errori e **35/35 test** (2 nuovi: collegamento script/`envDir` e precedenza di `--env-file-if-exists`).
  - `npm run build:fixture` dopo la correzione: avviato ma il processo è stato interrotto dal coordinatore (exit 137)
    per completare la verifica cloud senza sovrapposizioni; esito **non verificato** da Claude.
- **Riferito da Codex (non verificato da Claude)**: `npm run check` 35/35; `npm run build:cloud` reale riuscito su
  Supabase cloud (ref `dvjrhqkqyfkxaejwydog`), 0 briefing, 5 pagine, check-dist pulito, chiave mai stampata.
  Form Vercel preparato in Chrome senza premere Deploy; connettore `create_project` 403, nessuna risorsa creata.

## Correzione 2 — tsconfig

`astro check` analizzava il JS minificato in `dist-staging/` (avvisi inutili). `exclude` ora:
`dist`, `dist-staging`, `dist-previous`, `.local`, `node_modules`. Verificato da Claude: `astro check` 0 errori,
0 avvisi, 0 suggerimenti (48 file). Suite e build non ripetute, come richiesto (`dist/` contiene la build cloud di Codex).

## Limiti

- La regex del riferimento progetto assume 20 caratteri `[a-z0-9]` (il ref reale riferito da Codex la soddisfa).
- Il controllo JWT legge il ruolo dichiarato senza verificare la firma: è un guard-rail; RLS resta la protezione reale.
- Il test su `astro.config.mjs` importa Astro e dura circa 7 s.
- La build precedente all'incarico è in `.local/preview-before-cloud`.
- DECISIONI.md non aggiornato (lasciato a Codex). Nessun `.env` letto o modificato, nessun db push/reset/migrazione,
  nessun commit/push/deploy.
