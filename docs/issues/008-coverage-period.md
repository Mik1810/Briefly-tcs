# 008: Internal coverage period does not match the "since the last post" window

- Status: open
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
