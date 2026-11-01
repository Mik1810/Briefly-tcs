# Verifica Codex: collegamento sito a Supabase cloud

2026-11-01T13:35:29+01:00, Europe/Rome. Codice a Claude CLI su WSL; review e test reali Codex.

## Risultato

Il sito legge in build Supabase hosted (progetto dvjrhqkqyfkxaejwydog) con chiave publishable e policy RLS. Configurazione cloud in .env.cloud ignorato Git, .env locale conservata. Nessuna scrittura DB né demo importata.

Comandi: npm run build e dev per locale; npm run build:cloud e dev:cloud per cloud. Node >=24.18.0 <25, coerente tra package e lock.

## Verifiche dirette

- REST GET sulle sei tabelle: HTTP200, zero righe.
- Prima build reale ha trovato regressione: Astro copiava .env locale nei worker, dopo preflight cloud corretto. Build abortita conservando dist.
- Fix Claude revisionato: Node --env-file-if-exists=.env.cloud prima di build/dev cloud, vite.envDir=false in targetcloud. Variabili esterne precedono file e Vercel puo usare sole env esterne. Il target locale non cambia.
- npm run check: 35 test passati, zero errori. Warning iniziali solo su JS generato in dist-staging; esclusioni generate da tsconfig aggiunte e successivo astro check di Claude concluso con zero errori/avvisi/suggerimenti (riferito). Nessuna dipendenza o versione libreria cambiata.
- npm run build:cloud reale riuscito: sorgente Supabase cloud, zero briefing, cinque pagine, check-dist senza problemi. Dist ora contiene questa build cloud.
- QA browser: home dopo reload mostra No published briefings, footer hosted Supabase; pagina Method disponibile in inglese. Primo caricamento mostrava vecchia cache demo, mentre file su disco e risposta HTTP erano gia corretti.
- Scansione output: zero occorrenze della chiave publishable nei file generati e zero tag script nelle pagine HTML.
- Dimensioni home HTML1.4kB (gzip0.7), CSS8.2kB (gzip2.2). Bundle React non collegato alle pagine resta come prima.

## Vercel preparato, non pubblicato

Team mik1810s-projects (Hobby), repository Mik1810/Briefly-tcs main. Connettore legge account ma create_project rifiuta403. CLI non installata. Dashboard Chrome autenticata: modulo Import compilato, nome briefly-tcs, preset Astro, install npm ci, build npm run build:cloud, output dist. Target cloud, URL e publishable inseriti in env Production/Preview con valori mascherati. Deploy non premuto, nessun progetto creato.

Prima di Deploy occorre push esplicito del main locale aggiornato: git fetch ha confermato che non ci sono commit remoti nuovi. Nessun push eseguito. AGENTS vieta push/deploy impliciti: richiesta di consenso solo dopo consegna verificabile. Schermate private in .local/cloud-home-20261101.jpg e .local/vercel-import-prepared-20261101.jpg.

## Rimane

Pubblicazione Vercel iniziale da autorizzare e provare. Storia migrazioni cloud ancora manuale: niente db push senza baseline allineata. Publisher automatico e post scientifici reali non implementati. Questa verifica non certifica l'automazione editoriale end-to-end.
