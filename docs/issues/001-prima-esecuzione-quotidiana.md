# 001: Verificare la prima esecuzione quotidiana del task ChatGPT

- Stato: aperta
- Priorità: alta
- Creata: 2026-11-01

## Contesto

Il task "Briefing quotidiano ricerca TCS" (ogni giorno alle 9:00, Europe/Rome) usa dal 1° novembre il testo di
`docs/CHATGPT_TASK_ISTRUZIONI.md` (versione 3 con regola sul titolo). Finora ha pubblicato solo tramite corse
singole avviate a mano; la corsa v2 si è fermata sulla richiesta "Allow ChatGPT to use GitHub?" finché l'utente
non ha cliccato. Non è noto se sia stato scelto "Consenti sempre" o "Consenti una volta".

## Problema

- La pubblicazione si blocca se ChatGPT chiede di nuovo la conferma GitHub e nessuno risponde.
- Gli orari dello scheduler non sono affidabili: corse partite in anticipo (fino a 3 minuti) e in ritardo
  (oltre 4 minuti).
- La finestra "dall'ultimo post" e la regola "nessun file se non c'è nulla" non sono ancora state provate in una
  corsa quotidiana vera.

## Da fare

- Il 2 novembre: controllare in ChatGPT la richiesta di conferma e scegliere "Consenti sempre".
- Verificare commit su `posts`, run "Publish posts", pagina pubblica, lunghezza e qualità dei risultati, campo
  `aiUse`, titolo senza nome del sito, assenza di risultati già trattati il 1° novembre.
- Ripetere il controllo per alcuni giorni, includendo un lunedì (finestra del fine settimana).

## Criteri di chiusura

Tre esecuzioni quotidiane consecutive pubblicate senza intervento, oppure un esito "nessun file" motivato.
