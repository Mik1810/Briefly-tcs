# 005: Align the migration history of the hosted Supabase project

- Status: open
- Priority: medium
- Opened: 2026-11-01

## Context

In the hosted project `dvjrhqkqyfkxaejwydog` every migration was applied by hand in the SQL Editor:
`20261031122537_editorial_schema`, `20261101120237_revoke_rls_auto_enable_execute`,
`20261101140000_publish_briefing`, `20261101160000_results_ai_use`. The table
`supabase_migrations.schema_migrations` was missing.

## Problem

`supabase db push` would try to apply everything again (CREATE TABLE on existing tables). Every new migration has
to be pasted into the SQL Editor by hand.

## Proposal

- Check that the hosted schema matches the local one (tables, constraints, functions, grants).
- Mark the four versions as applied (`supabase migration repair --status applied ...`) without running them, after
  the owner's confirmation and with the CLI linked to the project.
- From then on, use `db push` for new migrations.

## Closing criteria

`supabase migration list` shows local and remote aligned; no `db reset` on the hosted project.
