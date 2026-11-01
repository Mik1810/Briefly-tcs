# 006: Ridurre i privilegi di scrittura di service_role nel cloud

- Stato: aperta
- Priorità: media
- Creata: 2026-11-01

## Contesto

Nel cloud `service_role` ha tutti i privilegi sulle sei tabelle (grant predefiniti di Supabase), a differenza
dello stack locale dove ha solo quelli concessi dalle migrazioni. La chiave `github_publisher` (ruolo
service_role) è conservata solo nei secret di GitHub Actions.

## Problema

Con quella chiave si può scrivere direttamente sulle tabelle via REST, aggirando `publish_briefing` (atomicità,
stato imposto, niente demo). Il rischio dipende solo dalla riservatezza della chiave.

## Proposta

- Revocare INSERT/UPDATE/DELETE/TRUNCATE di service_role sulle tabelle editoriali, lasciando SELECT e EXECUTE su
  `publish_briefing` (che gira come owner postgres).
- Verificare prima che dashboard e strumenti usati dall'utente non dipendano da quei privilegi.

## Criteri di chiusura

Scrittura diretta con la chiave secret rifiutata; pubblicazione via workflow ancora funzionante.
