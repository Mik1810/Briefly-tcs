# 009: Topics are set aside

- Status: closed on 2026-11-03. The owner chose to remove topics entirely: `/topics/` pages, topic components,
  model fields, validation, fixtures, seed and checks were removed; migration `20261103210000_drop_topics.sql`
  updates `publish_briefing` and drops `topics` and `result_topics` (applied locally and in the hosted project,
  recorded in the migration history). `/topics/` and `/argomenti/` redirect to the home page. The obsolete
  one-off script `scripts/translate-demo-db.ts` was deleted with them.
- Priority: low
- Opened: 2026-11-01

## Context

By the owner's decision of 1 November, topics are neither written by the task nor shown: the "Topics" menu item
was removed, topic links are hidden and the field is rejected in the post format. The `topics` and
`result_topics` tables and the `/argomenti/` pages remain in the code (not linked). The hosted `topics` table is
empty.

## To decide when reopened

- Whether to bring topics back, with which vocabulary (the current five or a wider one), and whether ChatGPT or
  the publisher assigns them.
- Otherwise, remove the unused pages and code for good.

## Closing criteria

The owner's decision is recorded and applied.
