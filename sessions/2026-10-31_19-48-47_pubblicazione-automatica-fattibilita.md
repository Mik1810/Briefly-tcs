# Sessione: pubblicazione automatica e attività ChatGPT

- Apertura: 2026-10-31T19:48:47+01:00 — Europe/Rome.
- Autore: Codex, coordinamento e verifica documentale.
- Commit iniziale: d5a21de.
- Richiesta: niente revisione umana; ChatGPT deve produrre articoli in stile blog e pubblicarli automaticamente, eventualmente tramite un'attività programmata e API.

## Decisione dell'utente

La revisione umana prima della pubblicazione non è richiesta. La pipeline deve redigere, controllare e pubblicare automaticamente.
Questa scelta supera la precedente proposta di bozze da approvare. I controlli automatici su formato, fonti e duplicati restano parte del processo da progettare.

## Eseguito

- Riletti AGENTS, checkpoint e stato Git: nessuna modifica applicativa pendente all'avvio.
- Consultata documentazione ufficiale OpenAI su scheduled tasks, strumenti MCP, ricerca web API e prezzi/uso.
- Scoperto il tool automation_update disponibile: gestisce automazioni Codex, non prova che l'attività ChatGPT online possa usare una API personalizzata.
- Nessuna automazione creata o modificata. L'attività ChatGPT originaria resta intatta.
- Nessuna API chiamata a pagamento, credenziale richiesta o salvata, endpoint esposto o dato pubblicato.

## Risultati documentali

- Le attività ChatGPT possono usare strumenti collegati nei casi supportati; i task web non lavorano direttamente nelle cartelle del PC.
- Un server MCP personalizzato può esporre strumenti di scrittura. Il supporto effettivo nei task e il comportamento delle approvazioni vanno provati sul conto dell'utente; non sono stati verificati qui.
- Non è stabilito che il task esistente possa fare POST autenticati arbitrari fornendogli soltanto un URL.
- L'API OpenAI supporta ricerca web e generazione attraverso Responses; un job del progetto può orchestrare ricerca, articolo inglese, controlli, scrittura Supabase e build.
- L'uso API ha tariffazione separata dall'uso incluso nell'abbonamento ChatGPT; nessuna stima di costo ancora fatta.
- Nell'assetto attuale locale, il processo di pubblicazione necessita dei servizi locali attivi. Un task cloud non può raggiungere direttamente il localhost del PC; serve un'integrazione raggiungibile o un processo locale.

## Opzioni proposte, non implementate

1. Conservare l'attività ChatGPT con uno strumento di pubblicazione collegato: prova di compatibilità e autorizzazioni prima di promettere funzionamento unattended.
2. Job del progetto + API OpenAI: orchestration esplicita, separata dalle Tasks ChatGPT e dal loro abbonamento; modello/accesso/budget/scheduler da scegliere.

Proposta di flusso: fonti → stesura blog in inglese → controllo automatico → salvataggio pubblicato in Supabase → build.
I controlli automatici non devono essere etichettati come revisione scientifica indipendente.

## Fonti aperte

- https://learn.chatgpt.com/docs/automations
- https://developers.openai.com/training/walkthroughs/scheduled-tasks
- https://developers.openai.com/api/docs/guides/custom-mcp-server
- https://developers.openai.com/api/docs/guides/tools-web-search
- https://learn.chatgpt.com/docs/pricing

## Chiusura

Aggiornati decisioni, checkpoint e indice dei registri. Nessuna implementazione applicativa o prova dell'account ChatGPT eseguita.
Prossimo lavoro: scegliere e provare il collegamento concreto per la pubblicazione automatica, senza introdurre il passaggio di approvazione umana rifiutato dall'utente.
Versionamento dei soli documenti nel commit che contiene questo registro; nessun push o deployment.
