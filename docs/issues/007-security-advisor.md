# 007: Re-run the Supabase Security Advisor after the new migrations

- Status: closed on 2026-11-03. After rerunning the linter: Security Advisor 0 errors, 0 warnings, 0 suggestions;
  Performance Advisor 0 errors, 0 warnings, 1 info ("Unused Index" on `public.result_topics`, expected while
  topics are set aside, see 009).
- Priority: low
- Opened: 2026-11-01

## Context

The Security Advisor of the hosted project showed 0 errors and 0 warnings on the morning of 1 November. Since
then the SECURITY DEFINER function `publish_briefing` and the column `results.ai_use` were added.

## To do

Open the Security Advisor and Performance Advisor in the Supabase dashboard and record the result; fix any
warnings with a migration.

## Closing criteria

No advisor errors, or warnings justified and recorded.
