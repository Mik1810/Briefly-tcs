# 002: Notice failures of the publish workflow and of the Vercel build

- Status: open
- Priority: high
- Opened: 2026-11-01

## Context

Pipeline: ChatGPT task → `posts` branch → GitHub Actions `publish-posts.yml` → RPC `publish_briefing` → Vercel
deploy hook. The workflow exits with code 1 on an invalid post; the deploy hook is called, but the workflow does
not check the build result.

## Problem

- It is unverified who receives GitHub Actions notifications when the push comes from ChatGPT's GitHub app.
- If the Vercel build fails (for example invalid data in the database or a rendering error), the site stays on
  the previous version and nobody notices.
- If the ChatGPT task writes nothing for days, there is no signal.

## Proposals (to choose)

1. Check and, if needed, enable email notifications for failed GitHub Actions runs.
2. Failed-deployment notifications from the Vercel dashboard (email), with no new tokens.
3. Optional: a daily workflow that checks after 10:00 that today's page exists and fails otherwise (public HTTP
   only, no credentials).

## Done on 2026-11-03

- `.github/workflows/daily-post-check.yml` (on `main`): every day at 11:00 UTC (12:00 in Rome in winter, 13:00 in
  summer) it checks `/briefing/<today>/`; if missing it opens an issue "Daily post missing: <date>" with the likely
  cause (no file on `posts`, or file present but publish/build failed), or comments on the open one.
- `publish-posts.yml` (on `main` and `posts`): on failure it opens an issue "Publish failed (<date>, run <id>)"
  with the publisher errors and the run link. Uses only `GITHUB_TOKEN` (`issues: write`).
- Tested: the check passes for 2026-11-03 and opened #11 for 2026-10-31 (no post). The failure step was simulated
  locally; it has not run on GitHub yet.
- Still open: the owner must confirm that GitHub issue notifications arrive (email or app).

## Closing criteria

A simulated workflow failure and a simulated build failure each produce a notification the owner receives.
