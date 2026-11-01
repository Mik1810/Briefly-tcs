# 008: Periodo coperto interno non coerente con la finestra "dall'ultimo post"

- Stato: aperta
- Priorità: bassa
- Creata: 2026-11-01

## Contesto

Su decisione dell'utente il periodo coperto non è scritto da ChatGPT né mostrato: il publisher imposta
`coverage_from = coverage_to = giorno precedente`. Il task però cerca le novità "dall'ultimo post" (anche più
giorni, per esempio dopo il fine settimana).

## Problema

Il dato interno può non corrispondere al periodo realmente esaminato. Non è visibile ai lettori.

## Proposte (da scegliere)

1. Lasciare così (dato puramente interno).
2. Far calcolare al publisher `coverage_from` come giorno successivo all'ultimo post pubblicato.

## Criteri di chiusura

Decisione registrata; se si sceglie l'opzione 2, test sul calcolo.
