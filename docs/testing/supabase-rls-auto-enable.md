# public.rls_auto_enable(): controlli prima e dopo la revoca di EXECUTE

Procedura per la migrazione `supabase/migrations/20261101120237_revoke_rls_auto_enable_execute.sql`
sul progetto cloud briefly.tcs. Preparata il 2026-11-01 da Claude, che non l'ha eseguita sul cloud.
Codex riferisce di averla applicata con verifiche e test superati ([VERIFICA_06_SUPABASE_CLOUD.md](../coordination/VERIFICA_06_SUPABASE_CLOUD.md),
2026-11-01T13:08:42+01:00). Claude non ha verificato quell'esito. La procedura resta valida per ripetere i controlli.
Esito delle prove locali e fonti: [REPORT_06_CLAUDE.md](../coordination/REPORT_06_CLAUDE.md).

Ordine obbligatorio: 1 → 2 → 3 (facoltativo ma consigliato) → 4 → 5 → 3 di nuovo.
Le query 1, 2 e 5 sono solo letture. Il test 3 crea una tabella e la annulla sempre con un errore voluto.
Eseguire tutto con lo stesso ruolo che applicherà la migrazione (SQL Editor: di norma `postgres`).

Non usare `supabase db push`: lo schema editoriale è stato importato a mano e
`supabase_migrations.schema_migrations` non esiste sul cloud (registro 2026-10-31_20-25-50).

## 1. Ispezione (sola lettura)

Ogni blocco funziona anche se la funzione non esiste: restituisce zero righe o NULL.

```sql
-- 1a. Tutte le funzioni con questo nome in public (anche eventuali overload)
select p.oid::regprocedure as funzione,
       pg_get_function_identity_arguments(p.oid) as argomenti,
       p.prorettype::regtype as ritorno,
       p.prokind,
       l.lanname as linguaggio,
       p.prosecdef as security_definer,
       p.proconfig as impostazioni,
       p.proowner::regrole as owner,
       p.proacl,
       md5(p.prosrc) as md5_corpo
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join pg_language l on l.oid = p.prolang
where n.nspname = 'public' and p.proname = 'rls_auto_enable';
```

```sql
-- 1b. Definizione completa (NULL se la funzione no-args non esiste)
select pg_get_functiondef(to_regprocedure('public.rls_auto_enable()')) as definizione;
```

```sql
-- 1c. Event trigger del database (tutti, per vedere anche quelli che usano altre funzioni)
select e.evtname, e.evtevent, e.evtenabled, e.evttags, e.evtowner::regrole as owner,
       e.evtfoid::regprocedure as funzione,
       e.evtfoid = to_regprocedure('public.rls_auto_enable()') as usa_rls_auto_enable
from pg_event_trigger e
order by e.evtname;
```

```sql
-- 1d. Privilegi registrati sulla funzione (grantee PUBLIC compare come PUBLIC)
select case when a.grantee = 0 then 'PUBLIC' else a.grantee::regrole::text end as grantee,
       a.grantor::regrole as grantor, a.privilege_type, a.is_grantable
from pg_proc p,
     aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
where p.oid = to_regprocedure('public.rls_auto_enable()')
order by 1;
```

```sql
-- 1e. EXECUTE effettivo per ruolo (stesso criterio dei lint 0028/0029) e privilegi del ruolo corrente
select r.rolname,
       has_function_privilege(r.rolname, to_regprocedure('public.rls_auto_enable()'), 'EXECUTE') as execute
from pg_roles r
where r.rolname in ('anon', 'authenticated', 'service_role', 'postgres', 'supabase_admin', current_user)
order by r.rolname;

select current_user,
       p.proowner::regrole as owner,
       pg_has_role(current_user, p.proowner, 'USAGE') as ha_privilegi_owner,
       (select rolsuper from pg_roles where rolname = current_user) as superuser
from pg_proc p
where p.oid = to_regprocedure('public.rls_auto_enable()');
```

```sql
-- 1f. Storia migrazioni (atteso NULL, quindi niente db push)
select to_regclass('supabase_migrations.schema_migrations') as storia_migrazioni;
```

## 2. Condizioni per procedere

Salvare l'output di 1a–1e (senza intestazioni dell'account) come confronto per il punto 5.
Procedere solo se **tutte** valgono; altrimenti fermarsi e riferire a Codex, senza modifiche:

- 1a: una sola riga, `argomenti` vuoto, `ritorno` = `event_trigger`, `prokind` = `f`, `security_definer` = true.
- 1b: corpo equivalente all'esempio "Enable RLS on new tables" della documentazione Supabase
  (abilita solo la RLS sulle nuove tabelle di `public`, `search_path = pg_catalog`), senza altre istruzioni.
- 1c: la funzione è usata da `ensure_rls` (`ddl_command_end`, abilitato `O`, tag CREATE TABLE / CREATE TABLE AS / SELECT INTO)
  o da nessun trigger. Altri trigger o tag diversi: fermarsi.
- 1d/1e: EXECUTE ad anon e/o authenticated (è la causa degli avvisi). Annotare chi altro ha EXECUTE: deve restare uguale.
- 1e: `ha_privilegi_owner` = true. Se false, la migrazione si ferma da sola con errore: serve una decisione,
  non un cambio di owner o di ruolo implicito.

## 3. Test funzionale con annullamento (dopo il punto 2)

Crea una tabella di prova in `public`, legge se la RLS è stata attivata e poi solleva un errore voluto:
l'errore annulla l'intero blocco, quindi non resta nulla anche in autocommit.
Il messaggio d'errore atteso contiene `relrowsecurity=true`.

```sql
do $$
declare
  rls boolean;
begin
  create table public.rls_auto_enable_probe (id integer);
  select c.relrowsecurity into rls from pg_class c where c.oid = 'public.rls_auto_enable_probe'::regclass;
  raise exception 'rls_auto_enable_probe: relrowsecurity=% (errore voluto, tutto annullato)', rls;
end
$$;
```

```sql
-- Conferma che la tabella di prova non esiste (atteso NULL)
select to_regclass('public.rls_auto_enable_probe') as residuo;
```

Eseguirlo prima della migrazione (riferimento) e dopo (deve dare lo stesso esito).
`relrowsecurity=false` prima della migrazione indica che il trigger non scatta per questo ruolo: fermarsi e riferire.

## 4. Applicazione

Solo dopo il via di Codex/utente. Contenuto esatto del file di migrazione, un'unica esecuzione.
Se va applicata da SQL Editor, la storia migrazioni resta non registrata come per lo schema editoriale.
Esiti possibili: notice "assente" (nessuna modifica), errore con "nessuna modifica"/"revoca annullata"
(nulla è cambiato: riferire), oppure successo.

## 5. Verifica dopo la revoca (sola lettura)

Rieseguire 1a–1e e confrontarli con l'output salvato:

- 1e: `anon` e `authenticated` con `execute` = false.
- 1d: nessuna riga PUBLIC, anon o authenticated; tutte le altre righe identiche (es. postgres, service_role).
- 1a: `owner`, `security_definer`, `impostazioni` e `md5_corpo` invariati; 1c invariato.
- Poi ripetere il test 3 e rieseguire Security Advisor: i due avvisi su `rls_auto_enable` non devono comparire.
