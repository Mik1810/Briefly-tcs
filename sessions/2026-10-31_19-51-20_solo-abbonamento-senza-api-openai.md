# Sessione: automazione con il solo abbonamento

- Data/ora: 2026-10-31T19:51:20+01:00, Europe/Rome.
- Autore: Codex. Commit iniziale: 798b468.
- Richiesta: niente API OpenAI; l'utente dispone del solo abbonamento ChatGPT e vuole evitare API a consumo.

## Decisione vincolante

Esclusa la precedente proposta di cron del progetto con API OpenAI. Nessuna chiave o fatturazione API da configurare.
Pubblicazione automatica senza revisione umana resta richiesta. Sito in inglese, stile A e locale restano invariati.

## Verifica documentale, eseguita

Consultate e aperte le pagine ufficiali:
- https://learn.chatgpt.com/docs/automations
- https://learn.chatgpt.com/docs/pricing

La documentazione conferma attività locali sui progetti nel desktop e accesso a Codex con abbonamento ChatGPT.
Le attività consumano l'uso/limiti del piano; non sono garantite esecuzioni illimitate.
Per lavoro su file locali servono computer acceso e app desktop attiva.

## Proposta da provare, non ancora implementata

Automazione locale Codex autenticata con ChatGPT: ricerca/selezione → post inglese e controlli automatici → scrittura Supabase locale → build.
Possibile valutare il riuso del briefing della chat già individuata, ma la lettura in una corsa schedulata non è stata provata.
Questa automazione locale è distinta dalla Task ChatGPT online esistente, che resta intatta.
Non si propone di automatizzare il sito ChatGPT via scraping o di convertire l'abbonamento in una chiave API.
Il codice del flusso di pubblicazione, quando richiesto, resta affidato a Claude; Codex coordina e verifica.

## Stato e chiusura

Aggiornati registri e decisioni. Nessun codice, dato o servizio modificato, nessuna API chiamata a pagamento, nessun task creato.
Nessun nuovo test eseguito: ricognizione documentale, non implementazione. Nessun push o deployment.
Prossimo passo: una prova locale del flusso con accesso da abbonamento, prima di attivare la ricorrenza.
