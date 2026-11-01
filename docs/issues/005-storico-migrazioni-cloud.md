# 005: Allineare lo storico delle migrazioni del Supabase cloud

- Stato: aperta
- Priorità: media
- Creata: 2026-11-01

## Contesto

Nel progetto cloud `dvjrhqkqyfkxaejwydog` tutte le migrazioni sono state applicate a mano nell'SQL Editor:
`20261031122537_editorial_schema`, `20261101120237_revoke_rls_auto_enable_execute`,
`20261101140000_publish_briefing`, `20261101160000_results_ai_use`. La tabella
`supabase_migrations.schema_migrations` risultava assente.

## Problema

`supabase db push` tenterebbe di riapplicare tutto (CREATE TABLE già esistenti). Ogni nuova migrazione richiede
copia manuale nell'SQL Editor.

## Proposta

- Verificare che lo schema cloud coincida con quello locale (confronto di tabelle, vincoli, funzioni, grant).
- Registrare le quattro versioni come già applicate (`supabase migration repair --status applied ...`) senza
  eseguirle, dopo conferma dell'utente e con collegamento CLI al progetto.
- Da allora usare `db push` per le nuove migrazioni.

## Criteri di chiusura

`supabase migration list` mostra locale e remoto allineati; nessun `db reset` sul cloud.
