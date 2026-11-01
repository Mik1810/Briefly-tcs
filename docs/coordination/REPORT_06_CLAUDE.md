# Report 06 di Claude — EXECUTE su public.rls_auto_enable()

Data: 2026-11-01 (Europe/Rome). Commit iniziale: 36253be. Nessun commit, push, deploy o accesso cloud da parte di Claude.
Registro: [sessions/2026-11-01_13-02-03_claude-supabase-rls-auto-enable.md](../../sessions/2026-11-01_13-02-03_claude-supabase-rls-auto-enable.md).
Incarico: [IMPLEMENTAZIONE_06_SUPABASE_SECURITY.md](IMPLEMENTAZIONE_06_SUPABASE_SECURITY.md).

## Scopo

Risolvere i warning Security Advisor 0028/0029 (funzione SECURITY DEFINER eseguibile da anon/authenticated)
revocando solo EXECUTE a PUBLIC, anon e authenticated su `public.rls_auto_enable()`.
Invariati: corpo, owner, SECURITY DEFINER, search_path, event trigger e grant di altri ruoli (postgres, service_role).

## File

- `supabase/migrations/20261101120237_revoke_rls_auto_enable_execute.sql`: nome creato con
  `supabase migration new revoke_rls_auto_enable_execute` (CLI 2.122.0, dopo `--help`).
  SHA256 10169616762c4e2569098b95478179b6ace112bfa176a9902b2655240257d780; ultima modifica 13:04:45+01:00.
- `docs/testing/supabase-rls-auto-enable.md`: preflight, condizioni per procedere, test con annullamento, verifica dopo.
- Non modificati: frontend, `.env`, `config.toml`, migrazione editoriale, file di altri.

## Guardie della migrazione (un unico blocco DO, atomico)

- `to_regprocedure('public.rls_auto_enable()')` NULL: notice e nessuna modifica. Nessuna funzione creata.
  Gli overload con argomenti non sono toccati.
- Presente ma con `prokind` ≠ `f`, ritorno ≠ `event_trigger` o senza SECURITY DEFINER: errore, nessuna modifica.
- Ruolo corrente senza i privilegi dell'owner (`pg_has_role(..., 'USAGE')`): errore. Evita la REVOKE
  di un non-owner, che a norma di documentazione si limita a un warning senza revocare.
- Revoca da `public` più anon/authenticated (solo se i ruoli esistono).
- Controlli dopo: grant PUBLIC residuo in `aclexplode`, oppure `has_function_privilege` ancora true
  per anon/authenticated (stesso criterio del lint), ad es. tramite grant indiretto: errore e revoca annullata.
- Riapplicabile: una seconda esecuzione non cambia nulla.

## Preflight e verifica (dettaglio nel runbook)

- 1a: righe `pg_proc` per nome (firma, ritorno, prokind, linguaggio, prosecdef, proconfig, owner, proacl, md5 corpo).
- 1b: `pg_get_functiondef`, da confrontare con l'esempio "Enable RLS on new tables" della documentazione Supabase.
- 1c: `pg_event_trigger` con legame alla funzione (atteso `ensure_rls`, `ddl_command_end`, `O`).
- 1d: `aclexplode` dei grant. 1e: EXECUTE effettivo per ruolo e privilegi owner del ruolo corrente.
- 1f: `to_regclass('supabase_migrations.schema_migrations')`.
- Test 3: blocco DO che crea `public.rls_auto_enable_probe`, legge `relrowsecurity` e solleva un errore voluto
  (annullamento garantito anche in autocommit), poi controllo che non resti nulla.
- Verifica 5: ripetere 1a–1e. Atteso anon/authenticated false, nessun PUBLIC, altri grant/owner/md5/trigger invariati,
  Advisor senza i due warning.

## Controlli eseguiti da Claude (solo locali)

Il DB locale del progetto era spento (`pg_isready` 55322: nessuna risposta): non avviato.
Prove su un cluster PostgreSQL 17.10 temporaneo in /tmp, solo socket Unix, poi fermato e cancellato.
Ruoli simulati come su Supabase; funzione copiata dall'esempio della documentazione; event trigger `ensure_rls`.

- Funzione assente: notice, nessun errore. Solo overload con argomenti: notice, overload intatto.
- Ruolo non owner: errore, ACL invariata. Grant indiretto ad anon tramite gruppo: errore, ACL invariata.
- Owner: ACL da `{=X,postgres,anon,authenticated,service_role}` a `{postgres=X,service_role=X}`.
  Riesecuzione identica; md5 corpo, owner, prosecdef, proconfig e trigger invariati.
- Funzione inattesa (ritorno void, oppure non SECURITY DEFINER): errore, nessuna modifica.
- Query del runbook eseguite (estratte dal Markdown). Test 3 come postgres prima e dopo: `relrowsecurity=t`, nessun residuo.
- Come authenticated, senza EXECUTE, il trigger scatta comunque. Fallisce con "must be owner of table"
  sia con EXECUTE che senza: limite preesistente della funzione, non introdotto dalla revoca.
- Chiamata diretta: "trigger functions can only be called as triggers".

## Verifiche cloud: riferite da Codex, non eseguite da Claude

Da [VERIFICA_06_SUPABASE_CLOUD.md](VERIFICA_06_SUPABASE_CLOUD.md) (13:08:42+01:00):

- preflight conforme (owner postgres, ensure_rls:O);
- migrazione applicata via SQL Editor; MD5 del corpo identico prima e dopo;
- anon/authenticated EXECUTE=false, owner true;
- test CREATE TABLE/RLS/ROLLBACK superato senza residui;
- Advisor: 0 errori e 0 warning.

Claude non ha visto il cloud. Non ha verificato quale versione del file sia stata applicata,
anche se il file non è cambiato dopo le 13:04:45.

## Limiti

- Storia migrazioni cloud: `supabase_migrations.schema_migrations` era assente (31 ottobre) ed entrambe le
  migrazioni sono state applicate a mano. Prima di qualsiasi `db push` registrare in modo coerente
  20261031122537 e 20261101120237, senza rieseguirle. Nessun `db push` eseguito.
- Lo stack locale non contiene la funzione: lì la migrazione è un no-op (non provata sullo stack locale, perché era spento).
- Il cluster di prova non riproduce supautils né i ruoli reali Supabase.

## Fonti consultate

- PostgreSQL 17, REVOKE (non owner, superuser, membri dell'owner): https://www.postgresql.org/docs/17/sql-revoke.html
- PostgreSQL 17, privilegi e EXECUTE a PUBLIC di default: https://www.postgresql.org/docs/17/ddl-priv.html
- PostgreSQL 17, CREATE FUNCTION, sezione "Writing SECURITY DEFINER Functions Safely": https://www.postgresql.org/docs/17/sql-createfunction.html
- PostgreSQL 17, event trigger: https://www.postgresql.org/docs/17/event-trigger-definition.html, https://www.postgresql.org/docs/17/sql-createeventtrigger.html
- PostgreSQL 17, sorgente `EventTriggerInvoke` (nessun controllo ACL alla chiamata):
  https://github.com/postgres/postgres/blob/REL_17_STABLE/src/backend/commands/event_trigger.c
- Supabase, Event Triggers (esempio `rls_auto_enable`/`ensure_rls`, supautils): https://supabase.com/docs/guides/database/postgres/event-triggers
- Supabase, Database Functions (revoca da public e anon): https://supabase.com/docs/guides/database/functions
- Lint 0028 (splinter): https://github.com/supabase/splinter/blob/main/lints/0028_anon_security_definer_function_executable.sql
  (la pagina linter della documentazione non era leggibile senza JavaScript)
