# 003: Source titles containing LaTeX are shown raw

- Status: open
- Priority: medium
- Opened: 2026-11-01

## Context

In the 1 November post, the source of the second result is titled `Maximum Cardinality Matching in $n^{2+o(1)}$
Time`, copied exactly from arXiv. The task rules ask for the exact source title, while post titles and summaries
are plain text in Unicode.

## Problem

The source title is rendered as plain text, so `$n^{2+o(1)}$` appears raw in the source list.

## Proposals (to choose)

1. Render inline math in source titles with the same KaTeX renderer used for the body (keeps the exact title).
2. Ask the task to write source titles in Unicode as well (loses the literal citation).

Recommendation: option 1, since arXiv titles often contain formulas.

## Closing criteria

The source title of the 1 November post is readable on the page, with no added scripts, and a test covers it.
