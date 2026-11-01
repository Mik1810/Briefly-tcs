# 006: Reduce service_role write privileges in the hosted project

- Status: open
- Priority: medium
- Opened: 2026-11-01

## Context

In the hosted project `service_role` has every privilege on the six tables (Supabase default grants), unlike the
local stack, where it only has what the migrations grant. The `github_publisher` key (service_role) is stored
only in the GitHub Actions secrets.

## Problem

With that key, tables can be written directly through REST, bypassing `publish_briefing` (atomicity, enforced
status, no demo content). The risk rests entirely on keeping the key secret.

## Proposal

- Revoke INSERT/UPDATE/DELETE/TRUNCATE for service_role on the editorial tables, keeping SELECT and EXECUTE on
  `publish_briefing` (which runs as the postgres owner).
- First check that the dashboard and the owner's tools do not rely on those privileges.

## Closing criteria

Direct writes with the secret key are refused; publishing through the workflow still works.
