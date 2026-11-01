# Incarico 06: permessi funzione auto-RLS Supabase

Codice a Claude CLI su WSL, coordinamento Codex. Leggere AGENTS, CLAUDE, checkpoint e registri, incluso 2026-10-31_20-25-50 e registro corrente 2026-11-01. Conservare le modifiche esistenti.

## Evidenza

Progetto cloud briefly.tcs dvjrhqkqyfkxaejwydog, public contiene 6 tabelle editoriali vuote, RLS e grants controllati. Schema importato ieri manualmente da SQL Editor: supabase_migrations.schema_migrations assente. NON db push.
Security Advisor ha rilevato due warning sulla funzione preesistente public.rls_auto_enable(): SECURITY DEFINER eseguibile da anon/authenticated. Non creata dal nostro schema. Definizione cloud ancora da ispezionare: login Chrome in ripristino, connettore non autorizzato alla nuova organizzazione.

## Obiettivo limitato

Preparare (NON applicare al cloud) una migrazione stretta e riapplicabile per revocare solo EXECUTE a PUBLIC, anon e authenticated su public.rls_auto_enable(), senza modificare corpo, owner, security definer, event trigger o grants di altri ruoli. Guardare esistenza, firma no-args e ritorno event_trigger; se assente non creare funzione. Documentare che verifica corpo/legame event trigger sul cloud e permessi di owner devono precedere applicazione. In caso funzione inattesa evitare modifiche implicite.

Usare CLI supabase migration new dopo --help per creare nome timestamp. Non inventare nome. Nessun reset/start/stop DB né connessione remota o segreto. Aggiungere query preflight e verifica read-only in docs, anche test sicuro della funzionalita event trigger con transazione/rollback da eseguire DOPO l'ispezione se appropriato, non eseguirlo ora nel cloud.

Verificare documentazione ufficiale su function grants e event triggers, con fonti. Eseguire controlli statici utili, dire onestamente se SQL non eseguito per mancanza accesso. Non modificare frontend, .env, config credenziali, non fare commit/push/deploy o inviare messaggi. Registro proprio sessions datato Europe/Rome e report docs/coordination/REPORT_06_CLAUDE.md. Codex aggiorna indice/checkpoint.
