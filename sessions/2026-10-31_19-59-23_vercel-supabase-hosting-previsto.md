# Sessione: compatibilità Vercel e Supabase

- Data/ora: 2026-10-31T19:59:23+01:00, Europe/Rome.
- Autore: Codex. Commit iniziale: 21827f8.
- Richiesta: l'utente intende scegliere Vercel per il sito e Supabase per il database, e chiede compatibilità con ChatGPT-only.

## Verificato

- Letti AGENTS, checkpoint, stato Git e indicazioni delle skill Vercel deployments/Supabase.
- Aperte fonti primarie: https://docs.astro.build/en/guides/deploy/vercel/ ; https://vercel.com/docs/deploy-hooks ; https://supabase.com/docs/guides/functions/auth .
- Astro statico è supportato da Vercel. I Deploy Hooks permettono di richiedere una nuova build/deployment da un evento esterno.
- Il sito attuale usa output statico: una modifica nel DB non cambia l'HTML già generato senza rigenerazione.
- Il codice attuale accetta solo URL Supabase localhost/127.0.0.1: richiederà configurazione/adattamento esplicito per la produzione hosted. Compatibilità architetturale non significa deploy già pronto.

## Architettura proposta, non implementata

Task ChatGPT online → strumento di pubblicazione protetto → database Supabase hosted → deploy hook Vercel → sito statico aggiornato.
Il publisher può vivere in una funzione server e non richiede un modello AI o API OpenAI di generazione.
Le API del sito/database sono distinte dalle API OpenAI escluse dall'utente.
Con tutti i componenti necessari hosted, il flusso non dipende dal PC locale.
Rimane da provare sull'account il passaggio Task ChatGPT → strumento di scrittura senza conferme ricorrenti: Vercel/Supabase non garantiscono da soli questa capacità.

## Decisione e stato

Piattaforme previste per la produzione: Vercel + Supabase, come espresso dall'utente.
Il lavoro resta locale finché non viene richiesto il deployment. Nessuna creazione progetto cloud, migrazione, pubblicazione o push in questa sessione.
Nessun codice, dato, chiave o automazione modificato; nessun test applicativo ripetuto per una domanda architetturale.
Prossimo lavoro: prova del collegamento ChatGPT-only e progettazione del publisher; successivamente configurazione cloud esplicita.
