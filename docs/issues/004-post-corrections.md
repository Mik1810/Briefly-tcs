# 004: A workflow for correcting published posts

- Status: open
- Priority: medium
- Opened: 2026-11-01

## Context

The publisher never overwrites a published post: if the file changes, the workflow fails with "already
published with different content". The schema already has a `corrections` table and the page shows corrections
(substantive ones at the top, minor ones at the end), but nothing writes them. On 1 November the post title was
fixed by hand, first in the database (SQL Editor) and then in the file on `posts`.

## Problem

Fixing a mistake requires manual SQL and keeping database and file in sync by hand; getting the order wrong makes
later runs fail.

## Proposal

- A correction format in the repository (for example `corrections/YYYY-MM-DD-N.json` on the `posts` branch) with
  date, kind, text and affected result.
- An RPC `publish_correction` (service_role only) that inserts the correction and updates `updated_on` without
  rewriting the original text.
- Decide whether a correction may also change the text of a result or only add a note.

## Closing criteria

A test correction goes from file to public page without manual SQL, with tests.
