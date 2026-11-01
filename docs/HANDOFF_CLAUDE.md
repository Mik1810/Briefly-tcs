# Passaggio operativo a Claude — Briefly.tcs

Aggiornato: 2026-11-01T13:42:30+01:00, Europe/Rome. Primo deploy completato e verificato; leggere il blocco Esito finale.

## Incarico e vincoli dell'utente

Continua lo sviluppo di **Briefly.tcs**, blog quotidiano di informatica teorica per studenti magistrali e ricercatori. Il proprietario vuole che il task **ChatGPT online normale** produca automaticamente un post inglese e lo pubblichi, adattando a stile blog i briefing TCS che gia riceve.

- Solo abbonamento ChatGPT per generazione: niente API OpenAI, nessun OPENAI_API_KEY, nessuna automazione Codex quotidiana. Non promettere consumo nullo dell'abbonamento.
- Nessuna revisione umana editoriale obbligatoria; validazione/redazione e pubblicazione automatiche. Le verifiche automatiche non sono una revisione matematica indipendente.
- Testi pubblici in inglese. Non mostrare il periodo coperto nei post; campi interni coverage conservati per validazione.
- Sito rapido e senza fronzoli: Astro statico + componenti React renderizzati in build, zero JS necessario per leggere. No Next.js o framework nuovi pesanti.
- Design A approvato, avorio/bordeaux e serif. Non ridisegnare.
- Destinazioni scelte: Supabase hosted e Vercel; ambiente locale ancora utilizzabile.
- Tutto lo sviluppo in **Ubuntu WSL**. Codice applicativo a **Claude CLI**; Codex ha coordinato/revisionato. Ora l'utente chiede un passaggio a Claude per continuare. Non attendere una sessione Codex per poter svolgere il lavoro autorizzato.
- Registrare ogni attivita significativa in `sessions/YYYY-MM-DD_HH-MM-SS_*.md`, timestamp Europe/Rome con offset; aggiornare indice e checkpoint, versionare Git. Distinguere fatto/verificato/riferito/pianificato. Mai segreti o contenuto .env nei log.
- Nessun ampliamento permessi, nuovo costo, db reset o force push implicito. Non cambiare task TCS originale finche il flusso sostitutivo non e verificato.

## Da leggere prima di agire

1. `AGENTS.md`, `CLAUDE.md`, `sessions/README.md`, `sessions/STATO_ATTUALE.md`, ultimo registro indicato.
2. `docs/DECISIONI.md` (le decisioni piu recenti prevalgono sulle vecchie proposte API/Codex/revisione umana).
3. `docs/coordination/REPORT_07_CLAUDE.md`, `VERIFICA_07_SUPABASE_CLOUD.md`, report/verifica06 per Supabase.
4. Questo documento, poi `git status`, `git log -5 --oneline`, stato remoto. Non ricominciare da zero e non rifare prove gia passate senza nuovi problemi.

## Workspace, Git e comandi

- Windows: C:/Users/micha/Desktop/sito tcs
- WSL: /mnt/c/Users/micha/Desktop/sito tcs
- Repository: https://github.com/Mik1810/Briefly-tcs.git, branch main.
- Commit applicativo testato e gia PUSHATO: `4818aa88e63d74a34e9b735652453e920db192af`. Handoff e registri successivi possono avere commit documentali locali ulteriori: verificare Git.
- Node24 tramite nvm (`source ~/.nvm/nvm.sh`, `nvm use 24.18.0`). Engines `>=24.18.0 <25`, lock coerente, nessun cambio dipendenze.
- `npm run check`:35 test; Astro check finale0errori/avvisi.
- `npm run build:cloud` / `npm run dev:cloud`: Supabase hosted.
- `npm run build` / `npm run dev`: stack Supabase locale.
- `npm run build:fixture` / `dev:fixture`: demo espliciti offline, non fallback e non da distribuire come notizie.
- `.env` locale e `.env.cloud` privata sono ignorati Git. `.env.example` e tracciato. Non stampare le chiavi.
- Anteprima corrente http://localhost:4321 e Python static server da dist, NON Astrodev. Verificare porta prima di avviare altri server.
- Stack DB locale nativo sperimentale (non Docker): API55321, Postgres55322; non verificato/riavviato in questa sessione. `db:reset` cancella/ripristina schema e seed: NON usarlo per avvio.

## Supabase cloud effettivo

- Organizzazione nuova `wiuuqjjwctaxgfubwshx`, Free, creata dall'utente con nuovo account.
- Progetto `briefly.tcs`, ref `dvjrhqkqyfkxaejwydog`, Paris/eu-west-3. URL https://dvjrhqkqyfkxaejwydog.supabase.co
- Vecchio account Mik1810 invitato e accettato come Developer; nuovo account resta Owner. Non servono altri inviti o upgrade.
- Sei tabelle in public: topics, briefings, results, result_topics, sources, corrections. Vuote online (nessun demo importato).
- RLS su tutte, anon solo SELECT degli articoli pubblicati e discendenti; nessuna scrittura anon/authenticated. Enum e nomi interni italiani sono intenzionalmente preservati (`bozza`, `pubblicato`, ecc.); interfaccia/contenuti inglesi.
- Una voce al giorno: briefings.date PK; results/sources/relazioni ordinati, vincoli e chiavi esterne. Leggere schema e types/validate prima di scrivere un publisher.
- Migrazione editoriale `20261031122537_editorial_schema.sql` installata manualmente via SQL Editor il31ottobre.
- Migrazione `20261101120237_revoke_rls_auto_enable_execute.sql` applicata manualmente il1novembre: EXECUTE revocato a PUBLIC/anon/authenticated sulla funzione event_trigger preesistente public.rls_auto_enable(). Corpo, owner postgres e trigger ensure_rls invariati. Test CREATE TABLE/assertRLS/ROLLBACK passato. Security Advisor0errori/0avvisi.
- **Storia migrazioni cloud assente** (`supabase_migrations.schema_migrations` NULL nella verifica): prima di qualunque `supabase db push`, verificare schema reale e allineare le versioni gia applicate. NON rieseguire CREATE TABLE e NON dbreset cloud.
- Connettore Supabase di questa sessione limitato ancora alla vecchia organizzazione; nuovi progetti non visibili e query dirette negate. Dashboard Chrome autenticata funziona. Non dedurre account sbagliato dalla sola lista del connettore, non usare progetti PaperDeck/FuelRadar.
- Configurazione lettura usa solo publishable default, soggetta RLS, salvata privatamente in .env.cloud. Nessuna secret/service_role usata per leggere il sito. Un futuro publisher avra bisogno di credenziali server adeguate, mai nel browser o in JSON del post. Il divieto di API OpenAI non riguarda REST Supabase.

## Collegamento applicativo verificato

- `src/lib/content/supabase/config.ts`: targetlocal/cloud esplicito, cloudsoloHTTPS/ref20.supabase.co, nessun URL arbitrario, credenziali in URL, path o query. Solo publishable o legacyJWTanon; secret e service_role rifiutati.
- Precedenza: envesterne > file target. Cloud non legge `.env` locale.
- Problema risolto: Astro caricava `.env` nei worker sovrascrivendo la configurazione prevista dopo preflightcloud. I comandi cloud ora caricano `node --env-file-if-exists=.env.cloud` prima di Astro e `astro.config.mjs` imposta vite.envDir=false in cloud. NON rimuovere questa protezione. Vercel funziona con sole envesterne e nessun file.
- Check35/35; buildcloud reale riuscita:0briefing,5pagine statiche, check-dist pulito. Zero chiavi nei file generati e zero tag script nelle pagine. DBvuoto e uno stato valido, non un errore da coprire con fixture.
- Dist locale corrente e una build cloud vuota; la home mostra No published briefings. Prima anteprima demo conservata in .local/preview-before-cloud. Cache browser: reload se mostra ancora vecchi demo.
- Build preserva ultima dist valida se DB/config/check fallisce (staging + due rinomine, non scambio atomico stretto).

## Vercel e prima pubblicazione

- Team `mik1810s-projects`, id team_Qd3IHzX95pY32kEbon7UzV3Z, piano Hobby.
- Nome previsto `briefly-tcs`, repoGitHub Mik1810/Briefly-tcs main, presetAstro, root./, install `npm ci`, build `npm run build:cloud`, output `dist`. Nessun adapter necessario per puro statico.
- Tre env Production/Preview: TCS_SUPABASE_TARGET=cloud, TCS_SUPABASE_URL e TCS_SUPABASE_PUBLISHABLE_KEY. Valori nella dashboard/file privati, non in questo documento.
- Connettore Vercel legge team ma create_project403. Dashboard Chrome funziona: modulo import compilato, Deploy premuto dopo autorizzazione esplicita dell'utente, inizialmente fermo su Reauthenticate. **Vedi Esito finale qui sotto per stato reale successivo**.
- L'utente ha autorizzato pushmain e primo Deploy in questa sessione. Non confondere tale consenso con autorizzazione generica a cambiare altri servizi o spendere.

## Prova ChatGPT online gia riuscita e limiti

- Task originale TCS: https://chatgpt.com/c/6ac94ce8-68f4-83eb-a4b8-9c5a7a26394c (Briefing quotidiano ricerca TCS). Contenuto completo/prompt non ricostruito: ispezionarlo prima di riscriverlo. Mai modificarlo senza prova pipeline completata.
- Chat tecnica separata: https://chatgpt.com/c/6ae63b52-0d38-83eb-983b-eba766226f6a
- Dopo permessi GitHub corretti, ChatGPT normale ha creato branch e file JSON con una prima approvazione una tantum.
- Task singolo unattended nella stessa chat ha scritto e riletto autonomamente `.automation-probes/scheduled-20261031-2018.json` nel branch remoto `automation-probe/chatgpt-20261031-2001`, commit235bdeadc92ecfaa3a3165d7f74344c3996f1dd9. Esistenza/contenuto verificati separatamente, nessuna conferma durante quella corsa.
- Questo prova una scrittura GitHub con quelle autorizzazioni/chat, NON tutte le scritture future o nuove chat, NON un publisher Supabase/Vercel end-to-end. Puntualita dell'ora descritta dal modello non certificata.
- I task di prova sono singoli/completati o in pausa; nessun nuovo generatore quotidiano attivo e nessun post scientifico reale pubblicato. Non chiamare automazioni Codex per sostituirli.

## Obiettivo successivo per Claude

Dopo verifica infrastruttura, completare la pipeline **ChatGPT task → documento post su GitHub → publisher deterministico → Supabase → nuova build Vercel**. Il ponte GitHub e promettente perche provato, ma importer/azioni/deployhook non esistono ancora. Nessun modello AI serve nel publisher.

1. Leggi contratto attuale types/validate e schema. Definisci payload post inglese con fonti e identificatore/data idempotente; non rompere contenuti esistenti o tradurre enum interni.
2. Pianifica brevemente soluzione minima (es. GitHub Actions per import JSON validato e avvio build), poi realizza parti locali autorizzate e una prova isolata. Prima di nuove credenziali/accessi/costi specifica cosa serve; non chiedere di incollare segreti in chat.
3. Validazione automatica stretta, pubblicazione atomica dei dati correlati, gestione duplicati/riprova, nessun doppio post al giorno, errori visibili e tracciati. Nessuna revisione umana obbligatoria per articolo. Input malformato non deve produrre dati parziali o notizie inventate.
4. Scritture solo da server con credenziali appropriate/minimi privilegi, RLS pubblica preservata. Mai dare INSERT anon per comodita.
5. Nuovi dati Supabase NON aggiornano da soli questo sito statico: trigger build verificato e controllo esito necessario, senza loop tra commit/log/build.
6. Prova con articolo tecnico di test separato e riconoscibile, e verifica browser→HTML→fonteDB. Solo dopo pipeline end-to-end provata integra il taskChatGPT originario e conferma possibilita senza ulteriori click nelle condizioni finali.
7. Mantieni rigore TCS: citazioni primarie, distinguere teorema pubblicato/preprint/risultato classico/verifica automatica. Nessuna validazione lessicale e una prova matematica.

Non iniziare con un redesign, migrazione a Next, modello via API, cron Codex, dbreset o import massivo dei demo. Conserva tutto il lavoro gia verificato.

## Esito finale della sessione di consegna

Verificato 2026-11-01T13:46:14+01:00: **READY, Production**.

- Sito pubblico: https://briefly-tcs.vercel.app
- Deployment iniziale: dpl_8rgy2fiPQ5Gc3W7x4rpCxPkyoJ9B
- Dashboard: https://vercel.com/mik1810s-projects/briefly-tcs/8rgy2fiPQ5Gc3W7x4rpCxPkyoJ9B
- URL immutabile: https://briefly-kfopxaum1-mik1810s-projects.vercel.app
- Commit applicativo distribuito:4818aa88e63d74a34e9b735652453e920db192af, branchmain. Build24s, installnpmci/audit0vulnerabilita.
- Tre warning npm sono tutti Unknown env config cache-dir nell'ambiente build Vercel; non hanno impedito il deploy. .env.cloud not found e atteso: la build usa env Vercel e logga correttamente Supabase cloud/0briefing.
- Riautenticazione Vercel completata dall'utente. Nessun OTP/password gestito da Codex.
- Verifiche pubbliche HTTP200 su /, /archivio/, /argomenti/, /metodo/: inglese, fontehosted, nessuno script, nessuna chiave e nessun postdemo. Browserhome conferma No published briefings.
- Dashboard Overview osservata con0 Function Invocations e Error Rate0%; non equivale a monitoraggio continuativo o scan completo di log. Connettore Vercel nega anche list_deployments403, quindi metadati/log letti dalla dashboard. Nessuna CLI Vercel autenticata/configurata su WSL.
- Analytics e Speed Insights non attivati; nessun dominio personalizzato configurato. Non introdurli senza bisogno.
- Il footer dice ancora local prototype: piccolo testo residuo da adeguare al prossimo intervento UI se opportuno, senza redesign.
- Questo documento/registri vengono versionati e pushati dopo il primo deploy. Git integration puo generare un deployment documentale ulteriore dello stesso codice: controllare ultimo stato in dashboard prima di nuove modifiche.
- Non c'e ancora un publisher o una nuova automazione quotidiana: il prossimo lavoro e la pipeline descritta sopra, non rifare la configurazione infrastrutturale.

Registro della consegna: sessions/2026-11-01_13-38-25_primo-deploy-handoff-claude.md.
