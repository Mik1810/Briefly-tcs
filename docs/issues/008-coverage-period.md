# 008: Internal coverage period does not match the "since the last post" window

- Status: closed on 2026-11-03 with option 2: when the post has no `coverage`, the publisher stores it from the
  date of the last post published before it (3 days back if there is none) to the previous day
  (`coverageSinceLastPost` in `scripts/lib/publisher.ts`). The value is excluded from the comparison of
  already-published posts, so older rows with the previous rule do not cause conflicts. Tests added.
- Priority: low
- Opened: 2026-11-01

## Context

By the owner's decision, the coverage period is neither written by ChatGPT nor shown: the publisher sets
`coverage_from = coverage_to = previous day`. The task, however, looks for news "since the last post", which can
span several days (for example after a weekend).

## Problem

The stored value may not match the period actually examined. Readers do not see it.

## Proposals (to choose)

1. Leave it as is (purely internal data).
2. Have the publisher compute `coverage_from` as the day after the last published post.

## Closing criteria

Decision recorded; if option 2 is chosen, a test for the computation.
