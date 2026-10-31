# Sessione: solo ChatGPT per la pubblicazione quotidiana

- Data e ora: 2026-10-31T19:54:42+01:00, Europe/Rome.
- Autore: Codex. Commit iniziale: ce77b43.
- Richiesta: evitare l'uso del piano/quota Codex e usare solo ChatGPT.

## Chiarimento necessario

Evitare Codex nella pipeline giornaliera è un obiettivo distinto dal non usare alcun limite dell'abbonamento.
Un task che usa ChatGPT rimane un utilizzo di ChatGPT; non va promesso consumo zero di ogni quota.
L'utente vuole evitare API OpenAI e preferisce non usare un'automazione Codex quotidiana.
Questo non cambia il ruolo di Codex/Claude nello sviluppo già autorizzato.

## Verifica documentale eseguita

- https://learn.chatgpt.com/docs/automations: task web con strumenti/plugin disponibili alla chat, senza accesso diretto a cartelle locali.
- https://developers.openai.com/api/docs/guides/custom-mcp-server: strumenti di lettura/scrittura, soggetti a disponibilità e conferme; scritture con conferma predefinita.
- https://developers.openai.com/api/docs/guides/secure-mcp-tunnels: ponte verso servizi privati, ma richiede chiave runtime Platform e permessi; non proposto come soluzione immediata senza chiavi.

## Percorso da verificare, non implementato

Task ChatGPT online → strumento di pubblicazione dedicato → Supabase/sito → build.
Il publisher è un programma del progetto, senza modello AI e senza API di generazione OpenAI.
Per il sito locale serve un collegamento raggiungibile dal task: localhost da solo non basta.
Prima verificare che il task della chat possa invocare lo strumento di scrittura e completare senza conferme a ogni esecuzione.
Non è stato controllato l'accesso effettivo dell'account o eseguita una prova unattended; fattibilità di questa configurazione specifica ancora da dimostrare.

## Chiusura

Preferenza aggiornata nei documenti: non attivare una nuova automazione Codex come percorso predefinito.
Nessun codice o dato modificato; nessun task creato/modificato, chiave richiesta, tunnel esposto, push o deployment.
Nessun test applicativo ripetuto, perché si tratta di chiarimento e verifica documentale.
