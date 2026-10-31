# Istruzioni di progetto

## Ambiente e ruoli

- Lavorare tramite Ubuntu su WSL nel workspace del progetto.
- Codex coordina, revisiona e documenta; il codice applicativo è scritto da Claude Code CLI, come richiesto dall'utente.
- Conservare la direzione grafica A e le decisioni in docs/DECISIONI.md.
- Tutto locale per ora; nessun deployment o push implicito.

## Registro obbligatorio richiesto dall'utente

- Prima di iniziare leggere sessions/README.md e sessions/STATO_ATTUALE.md, poi l'ultimo registro pertinente.
- Creare una sessione Markdown con nome YYYY-MM-DD_HH-MM-SS_<argomento>.md e timestamp Europe/Rome con offset.
- Registrare richiesta, obiettivo, stato iniziale e commit di partenza.
- Durante il lavoro annotare azioni significative, file/comandi, esiti, errori e correzioni, decisioni e deleghe a Claude.
- Separare completato, verificato, riferito da altri e pianificato; non inventare orari retrospettivi.
- Alla chiusura aggiornare checkpoint e indice, annotare test, commit, servizi, blocchi e prossimi passi.
- Versionare i registri con Git. Non inserire credenziali, token, password, contenuto di .env o output sensibili.
- I registri storici si correggono con nuove voci, mantenendo la traccia di quanto accaduto.
