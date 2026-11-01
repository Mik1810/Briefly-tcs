# 002: Accorgersi dei fallimenti di workflow e build Vercel

- Stato: aperta
- Priorità: alta
- Creata: 2026-11-01

## Contesto

Pipeline: task ChatGPT → branch `posts` → GitHub Actions `publish-posts.yml` → RPC `publish_briefing` →
deploy hook Vercel. Il workflow esce con codice 1 se un post è invalido; il deploy hook viene chiamato ma il
workflow non controlla l'esito della build.

## Problema

- Non è verificato chi riceve le notifiche di GitHub Actions quando il push è fatto dall'app GitHub di ChatGPT.
- Se la build Vercel fallisce (per esempio dati non validi nel DB o errore di rendering), il sito resta alla
  versione precedente e nessuno se ne accorge.
- Se il task ChatGPT non scrive nulla per giorni, nessun segnale.

## Proposte (da scegliere)

1. Verificare e, se serve, attivare le notifiche email di GitHub Actions per i run falliti.
2. Notifiche di deploy fallito dalla dashboard Vercel (email), senza nuovi token.
3. Facoltativo: workflow giornaliero che controlla che la pagina del giorno esista dopo le 10:00 e fallisce in
   caso contrario (solo HTTP pubblico, nessuna credenziale).

## Criteri di chiusura

Un fallimento simulato del workflow e uno della build producono una notifica che l'utente riceve.
