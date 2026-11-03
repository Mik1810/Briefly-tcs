# Briefly.tcs: note di sviluppo

Guida pratica per lavorare sul progetto. Stato e storia: `sessions/STATO_ATTUALE.md`, decisioni: `docs/DECISIONI.md`,
punti aperti: `docs/issues/`.

## Ambiente

- Ubuntu in WSL, cartella `/mnt/c/Users/micha/Desktop/sito tcs`.
- Node 24.18.0 tramite nvm (`.nvmrc`; `engines` `>=24.18.0 <25`). `npm ci` installa le versioni esatte del lockfile,
  CLI Supabase compresa.
- Astro statico con componenti React renderizzati in build; formule KaTeX in build; l'unico script inviato al
  browser è la copia del link di un risultato (`src/lib/copy-link.ts`, accettato da `check-dist` solo se identico).

## Comandi

```sh
npm run check          # astro check + test di Node (fixture, nessun database)
npm run dev:cloud      # sviluppo sui dati del progetto Supabase cloud (.env.cloud o variabili d'ambiente)
npm run build:cloud    # build come in produzione; dist/ sostituita solo se check-dist passa

npm run db:start       # stack Supabase locale nativo (API 55321, DB 55322) e scrittura di .env
npm run dev            # sviluppo sullo stack locale (dati demo)
npm run build          # build dallo stack locale
npm run db:verify      # integrazione e RLS dello stack locale
npm run db:stop        # ferma lo stack (i dati restano)
npm run db:seed:generate  # rigenera supabase/seed.sql dalle fixture

npm run build:fixture  # build offline dalle fixture demo
```

`npm run db:reset` cancella e ricrea il database locale: non usarlo per avviare lo stack.

## Configurazione Supabase

- `TCS_SUPABASE_TARGET` (impostata dagli script) sceglie `local` o `cloud`. Valori da variabili d'ambiente o, se
  mancanti, da `.env` (local) o `.env.cloud` (cloud); entrambi ignorati da Git, formato in `.env.example`.
- Il sito legge solo con la chiave publishable (ruolo anon, soggetto a RLS); chiavi secret e service_role sono
  rifiutate. Il target cloud non legge mai `.env`.
- Vercel ha `TCS_SUPABASE_TARGET`, `TCS_SUPABASE_URL` e `TCS_SUPABASE_PUBLISHABLE_KEY` come variabili di progetto.

## Pubblicazione dei post

- Il task ChatGPT scrive `posts/YYYY-MM-DD.json` (formato `briefly-post/2`, `src/lib/content/post.ts`) sulla branch
  orfana `posts`, che contiene solo i post, il workflow e `vercel.json` (Vercel non la costruisce).
- `.github/workflows/publish-posts.yml` gira sulla branch `posts` ma prende il codice da `main`: valida i post
  (`scripts/publish-posts.ts`), li scrive con la RPC `publish_briefing` e chiama il deploy hook Vercel. Ogni
  modifica del workflow va copiata anche su `posts`.
- Secret GitHub: `TCS_SUPABASE_URL`, `TCS_SUPABASE_SECRET_KEY` (chiave `github_publisher`), `VERCEL_DEPLOY_HOOK_URL`.
- Prova senza scrivere: workflow "Publish posts" con `dry_run` (GitHub → Actions → Run workflow, ref `posts`).
- Avvisi: issue GitHub assegnate al proprietario se il publisher fallisce o se alle 11:00 UTC la pagina del giorno
  non esiste (`.github/workflows/daily-post-check.yml`).
- Un post pubblicato non viene sovrascritto: se il file cambia, il workflow fallisce in modo visibile.

## Migrazioni del database

- Nuovo file in `supabase/migrations/`; in locale `npx supabase migration up --local`.
- Nel cloud lo storico (`supabase_migrations.schema_migrations`) è allineato. Senza CLI collegata: eseguire il file
  nell'SQL Editor e, nella stessa transazione, inserire versione e nome nello storico. Con CLI collegata
  (`supabase login`, `supabase link`, password del database): `supabase db push`.
- Mai `db reset` sul cloud.

## Controlli

- `tests/`: date, validazione dei contenuti, Markdown e formule, configurazione Supabase, formato dei post e
  publisher (database simulato).
- `scripts/check-dist.ts` dopo ogni build: bozze assenti, testo solo in inglese, metadati, link e ancore interni
  validi, nessuna risorsa remota, nessuno script tranne la copia del link, nessuna pagina degli argomenti.
