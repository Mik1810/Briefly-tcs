# Sessione: verifica accesso Supabase dopo invito

- Apertura: 2026-10-31T20:25:50+01:00.
- Richiesta: utente comunica invito accettato; proseguire configurazione Supabase.
- HEAD iniziale 36253be. Git pulito.
- Letti AGENTS, indice, checkpoint e registro invito.

## Verifiche iniziali

- list_organizations/list_projects restituiscono ancora solo vecchia organizzazione e due progetti. Non assumere che l'invito sia fallito: possibile autorizzazione OAuth limitata o propagazione.
- Prova read-only diretta list_tables sul progetto noto dvjrhqkqyfkxaejwydog prima di eventuali modifiche.

## Piano

Verificare membership dalla UI e accesso del connettore; se autorizzato, controllare schema prima di applicare migrazione esistente. Se il connettore non autorizza il nuovo progetto, non aggirare controllo con chiamate nascoste; usare dashboard solo con i controlli previsti e previa revisione della migrazione. Nessuna chiave/segreto nei log.

## 2026-10-31T20:26:58+01:00 — membership verificata, fallback dashboard

- Connettore list_tables sul nuovo progetto nega permesso; nessuna query modificativa inviata.
- Dashboard risultava disconnessa. Login ordinario Continue with GitHub ha riaperto account Mik1810 senza nuove richieste di autorizzazione.
- Team mostra vecchio account You / Developer, nuovo account Owner: accettazione realmente verificata.
- Documentazione MCP ufficiale https://supabase.com/docs/guides/ai-tools/mcp indica autorizzazione riferita all'organizzazione. Lista connettore ancora limitata a vecchia org; non cambiare ruoli né tentare di aggirare il token. Dashboard è sessione legittimamente autorizzata al progetto nuovo e viene usata come percorso alternativo, come già concordato.
- Piano aggiornato: aprire SQL Editor, confermare public vuoto e applicare solo lo schema locale esistente (niente seed demo). Verificare tabelle, RLS e grants tramite query read-only.

## 2026-10-31T20:28:10+01:00 — applicazione schema da dashboard

- SQL Editor, account Developer: query read-only su pg_tables/public restituisce 0 righe, confermando schema vuoto.
- Eseguito contenuto esatto della migrazione locale 20261031122537_editorial_schema.sql, SHA256 1868b251bac1ccd6c38815b628d51b844f49ab89823f95389a954e121670165a, tramite UI SQL Editor. Nessun SQL applicativo nuovo scritto da Codex; nessun seed eseguito. Esito da verificare.
- Applicazione manuale da SQL Editor: non assumere che supabase_migrations.schema_migrations sia stato registrato come con CLI/MCP apply_migration. Prima di un futuro db push verificare/allineare la storia migrazioni per non ripetere CREATE TABLE.

## 2026-10-31T20:29:43+01:00 — schema installato, verifiche SQL

- Migrazione ha restituito Success. No rows returned. Nessun demo importato.
- Primo tentativo della successiva query di verifica ha fallito con syntax error alla riga 141: fill del textarea Monaco aveva sostituito solo la porzione visibile lasciando testo precedente. Query non riuscita; corretto aprendo snippet vuoto, senza rieseguire la migrazione. Per le sostituzioni successive usato ControlOrMeta+A e Backspace, verificando textarea vuoto prima di inserire SQL.
- Query pg_class/pg_policies/has_table_privilege riuscita: 6 righe (briefings, corrections, result_topics, results, sources, topics). Tutte con RLS=true, anon_read=true, anon_write=false, authenticated_access=false, una policy anon SELECT, zero policy di scrittura.
- Query di conteggio: tutte sei tabelle hanno zero righe. Policy briefings_read_filter effettiva: status = pubblicato.
- to_regclass(supabase_migrations.schema_migrations) è NULL: schema applicato manualmente, storia migrazioni cloud da inizializzare/allineare prima di un futuro db push; non lanciare db push direttamente.
- Evidenza risultati RLS in .local/supabase-cloud-rls-20261031.jpg (non Git perché contiene intestazione account).
- Aperto Advisors per controllo post-DDL. Nessuna chiave recuperata, nessun codice applicativo modificato, nessuna delega Claude necessaria per rieseguire SQL già versionato.

## Ripresa del 2026-11-01T13:08:42+01:00 — chiusura della parte interrotta

Ieri, dopo l'ultima voce, Security Advisor aveva mostrato due warning su public.rls_auto_enable(); lavoro interrotto prima di ispezione e correzione. Questa voce non attribuisce un orario retrospettivo agli avvisi. Ripresa, correzione e verifica attuali nel registro [2026-11-01_13-00-27_ripresa-supabase-sicurezza.md](2026-11-01_13-00-27_ripresa-supabase-sicurezza.md) e in ../docs/coordination/VERIFICA_06_SUPABASE_CLOUD.md. Il presente registro, rimasto non committato, viene preservato e versionato insieme alla ripresa.
