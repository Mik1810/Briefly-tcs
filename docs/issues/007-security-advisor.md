# 007: Ricontrollare il Security Advisor dopo le nuove migrazioni

- Stato: aperta
- Priorità: bassa
- Creata: 2026-11-01

## Contesto

Il Security Advisor del progetto cloud era a 0 errori/avvisi il 1° novembre mattina. Dopo sono state aggiunte la
funzione SECURITY DEFINER `publish_briefing` e la colonna `results.ai_use`.

## Da fare

Riaprire Security Advisor e Performance Advisor nella dashboard Supabase e annotare l'esito; correggere eventuali
avvisi con una migrazione.

## Criteri di chiusura

Advisor senza errori, oppure avvisi motivati e registrati.
