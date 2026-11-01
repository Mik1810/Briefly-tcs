# Verifica Codex: Supabase cloud

Aggiornamento 2026-11-01T13:08:42+01:00, Europe/Rome.

## Stato verificato

Progetto briefly.tcs: dvjrhqkqyfkxaejwydog, regione Paris eu-west-3, organizzazione wiuuqjjwctaxgfubwshx.

- Schema editoriale 20261031122537 installato da SQL Editor il 31 ottobre. Sei tabelle vuote; RLS abilitata su tutte, anon solo SELECT con filtri di pubblicazione, authenticated senza privilegi applicativi. Nessun seed demo nel cloud.
- Il primo novembre, preflight di public.rls_auto_enable(): no-args, ritorno event_trigger, owner postgres, SECURITY DEFINER, search_path pg_catalog, trigger ensure_rls attivo. Definizione MD5 846ec2fbff751d24b890656d63c3a9bf. anon/authenticated avevano EXECUTE.
- Migrazione 20261101120237 scritta da Claude, revisionata e applicata da Codex via SQL Editor: revoca EXECUTE da PUBLIC/anon/authenticated, guardie su tipo funzione e privilegi owner, no-op se assente, abort se permessi residui.
- Verifica dopo applicazione: stesso MD5 e owner, SECURITY DEFINER e ensure_rls invariati; anon_execute=false, authenticated_execute=false, owner_execute=true.
- Test transazionale: CREATE TABLE di prova, assertion RLS attiva automaticamente, ROLLBACK. Verifica tabella assente e due ruoli senza EXECUTE: true/true/true.
- Security Advisor ora mostra zero errori, zero warning e zero suggerimenti. Evidenze screenshot in .local, escluse da Git perché includono intestazione account.
- Anteprima locale riavviata da dist preesistente, HTTP 200 su /metodo/. Nessun test frontend rilanciato: nessuna modifica al sito.

## Limiti e prossimi passi

Il sito locale usa ancora configurazione Supabase locale: non è stato collegato al cloud né fatto un deployment. Non sono state recuperate nuove chiavi.

Storia cloud supabase_migrations.schema_migrations assente alla verifica del 31 ottobre: le due migrazioni sono state eseguite manualmente. Prima di CLI db push occorre verificare e registrare coerentemente le versioni già applicate, senza rieseguire CREATE TABLE. Nessun db push eseguito.

Il connettore Supabase di questa sessione non è autorizzato alla nuova organizzazione, nonostante membership Developer verificata nella dashboard. Lavoro cloud svolto dalla normale dashboard autenticata in Chrome, scelta dall'utente. Non sono stati ampliati ruoli o ambito OAuth.

Nessun push Git, Vercel, pubblicazione di post o costo nuovo. Registri: sessions/2026-11-01_13-00-27_ripresa-supabase-sicurezza.md e registro precedente 2026-10-31_20-25-50.
