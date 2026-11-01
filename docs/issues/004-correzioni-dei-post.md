# 004: Flusso per correggere un post già pubblicato

- Stato: aperta
- Priorità: media
- Creata: 2026-11-01

## Contesto

Il publisher non sovrascrive mai un post già pubblicato: se il file cambia, il workflow fallisce con "già
pubblicato con contenuto diverso". Lo schema ha già la tabella `corrections` e la pagina mostra le correzioni
(sostanziali in testa, minori in fondo), ma nessun flusso le scrive. Il 1° novembre il titolo del post è stato
corretto a mano, prima nel DB (SQL Editor) e poi nel file su `posts`.

## Problema

Correggere un errore richiede SQL manuale e allineamento a mano di DB e file; facile sbagliare l'ordine e far
fallire i run successivi.

## Proposta

- Formato di correzione nel repository (per esempio `corrections/YYYY-MM-DD-N.json` sulla branch `posts`) con
  data, tipo, testo e risultato interessato.
- RPC `publish_correction` (solo service_role) che inserisce la correzione e aggiorna `updated_on`, senza
  riscrivere il testo originale.
- Decidere se una correzione può anche modificare il testo del risultato o solo aggiungere la nota.

## Criteri di chiusura

Una correzione di prova passa da file a pagina pubblica senza SQL manuale, con test.
