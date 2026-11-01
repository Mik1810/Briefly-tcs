-- Revoca EXECUTE su public.rls_auto_enable() a PUBLIC, anon e authenticated.
--
-- La funzione non è creata da questo progetto: nel cloud esisteva già (opzione di RLS automatica,
-- vedi l'esempio "Enable RLS on new tables" in https://supabase.com/docs/guides/database/postgres/event-triggers).
-- Security Advisor (lint 0028/0029) la segnala perché è SECURITY DEFINER ed eseguibile da anon/authenticated.
--
-- Un event trigger invoca la funzione senza controllare EXECUTE dell'utente che esegue il DDL
-- (EventTriggerInvoke in src/backend/commands/event_trigger.c), quindi la revoca non dovrebbe alterare
-- l'abilitazione automatica della RLS. Va comunque verificata con il test in docs/coordination/REPORT_06_CLAUDE.md.
--
-- Ambito volutamente stretto: non cambia corpo, owner, SECURITY DEFINER, search_path, event trigger
-- né i grant di altri ruoli (postgres, service_role, ...).
-- - Funzione assente (es. stack locale): nessuna modifica, nessuna creazione.
-- - Funzione presente ma diversa da quanto atteso (ritorno, tipo, SECURITY DEFINER), o owner di cui il ruolo
--   corrente non ha i privilegi: errore, la migrazione si interrompe senza modifiche.
-- - Dopo la revoca anon e authenticated non devono più avere EXECUTE (stesso controllo del lint), altrimenti errore.
-- Riapplicabile: una seconda esecuzione trova i privilegi già revocati e non cambia nulla.

do $$
declare
  fn regprocedure := to_regprocedure('public.rls_auto_enable()');
  fn_rettype regtype;
  fn_kind "char";
  fn_secdef boolean;
  fn_owner regrole;
  grantees text[] := array['public'];
  role_name text;
begin
  if fn is null then
    raise notice 'public.rls_auto_enable() assente: nessuna modifica';
    return;
  end if;

  select p.prorettype, p.prokind, p.prosecdef, p.proowner
  into fn_rettype, fn_kind, fn_secdef, fn_owner
  from pg_catalog.pg_proc p
  where p.oid = fn;

  if fn_kind <> 'f' or fn_rettype <> 'pg_catalog.event_trigger'::regtype or not fn_secdef then
    raise exception 'public.rls_auto_enable() inattesa (prokind=%, ritorno=%, security definer=%): nessuna modifica',
      fn_kind, fn_rettype, fn_secdef;
  end if;

  -- Un non owner senza grant option revocherebbe nulla con un semplice warning: meglio fermarsi.
  if not pg_catalog.pg_has_role(current_user, fn_owner::oid, 'USAGE') then
    raise exception 'il ruolo % non ha i privilegi dell''owner % di public.rls_auto_enable(): nessuna modifica',
      current_user, fn_owner;
  end if;

  foreach role_name in array array['anon', 'authenticated'] loop
    if to_regrole(role_name) is not null then
      grantees := grantees || quote_ident(role_name);
    end if;
  end loop;

  execute format('revoke execute on function public.rls_auto_enable() from %s', array_to_string(grantees, ', '));

  if exists (
    select 1
    from pg_catalog.pg_proc p, aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
    where p.oid = fn and a.grantee = 0 and a.privilege_type = 'EXECUTE'
  ) then
    raise exception 'PUBLIC può ancora eseguire public.rls_auto_enable(): revoca annullata';
  end if;

  foreach role_name in array array['anon', 'authenticated'] loop
    if to_regrole(role_name) is not null and pg_catalog.has_function_privilege(role_name, fn, 'EXECUTE') then
      raise exception '% può ancora eseguire public.rls_auto_enable() (grant indiretto?): revoca annullata', role_name;
    end if;
  end loop;
end
$$;
