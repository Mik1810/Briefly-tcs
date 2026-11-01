# 003: Titoli delle fonti con LaTeX mostrati grezzi

- Stato: aperta
- Priorità: media
- Creata: 2026-11-01

## Contesto

Nel post del 1° novembre la fonte del secondo risultato ha titolo `Maximum Cardinality Matching in $n^{2+o(1)}$
Time`, copiato esattamente da arXiv. Le regole del task chiedono il titolo esatto della fonte; titoli e sommari
del post sono invece testo semplice in Unicode.

## Problema

Il titolo della fonte viene mostrato come testo semplice, con `$n^{2+o(1)}$` grezzo nella lista delle fonti.

## Proposte (da scegliere)

1. Rendere le formule inline nei titoli delle fonti con lo stesso renderer KaTeX del corpo (resta il titolo
   esatto della fonte).
2. Chiedere nel task di scrivere anche i titoli delle fonti in Unicode (si perde la citazione letterale).

Raccomandazione: opzione 1, perché i titoli arXiv contengono spesso formule.

## Criteri di chiusura

Il titolo della fonte del 1° novembre è leggibile nella pagina, senza script aggiunti, e un test copre il caso.
