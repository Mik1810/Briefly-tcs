# 001: Verify the first scheduled daily run of the ChatGPT task

- Status: open
- Priority: high
- Opened: 2026-11-01

## Context

Since 1 November the ChatGPT task "Briefing quotidiano ricerca TCS" (daily at 9:00, Europe/Rome) uses the text in
`docs/CHATGPT_TASK_ISTRUZIONI.md` (version 3, with the title rule). So far it has only published through one-off
runs started by hand. The v2 run stopped on the prompt "Allow ChatGPT to use GitHub?" until the owner clicked;
it is not known whether "Always allow" or "Allow once" was chosen.

## Problem

- Publishing stalls if ChatGPT asks for the GitHub confirmation again and nobody answers.
- Scheduler timing is unreliable: runs started up to 3 minutes early and more than 4 minutes late.
- The "since the last post" window and the "no file when there is nothing new" rule have not been exercised by a
  real daily run yet.

## To do

- On 2 November, check ChatGPT for the confirmation prompt and choose "Always allow".
- Check the commit on `posts`, the "Publish posts" run, the public page, length and quality of the results, the
  `aiUse` field, a title without the site name, and that nothing covered on 1 November is repeated.
- Repeat for a few days, including a Monday (weekend window).

## Closing criteria

Three consecutive daily runs published without intervention, or a justified "no file" outcome.
