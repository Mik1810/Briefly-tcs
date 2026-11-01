# 007: Re-run the Supabase Security Advisor after the new migrations

- Status: open
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
