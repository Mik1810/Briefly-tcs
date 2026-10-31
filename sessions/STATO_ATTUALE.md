# Stato attuale e ripresa

Aggiornato: 2026-10-31T18:56:48+01:00 — Europe/Rome.

## Leggere per primo

- Registro principale: [2026-10-31_13-47-21_riepilogo-e-registro.md](2026-10-31_13-47-21_riepilogo-e-registro.md).
- Decisioni: [docs/DECISIONI.md](../docs/DECISIONI.md).
- Avvio e comandi: [README del progetto](../README.md).
- QA: [VERIFICA_PROTOTIPO.md](../docs/coordination/VERIFICA_PROTOTIPO.md).

## Risultato disponibile

Prototipo locale in stile A — Rivista. Astro statico + React + Supabase locale nativo sperimentale.
Home, briefing, archivio, argomenti, Metodo, formule e controlli di esclusione bozze.
Tre briefing dimostrativi pubblicati e una bozza di controllo nel database.
Nessun articolo reale importato; nessuna redazione AI o attività giornaliera automatica configurata.

## Ambiente

- Progetto Windows: `C:\Users\micha\Desktop\sito tcs`.
- Percorso WSL: `/mnt/c/Users/micha/Desktop/sito tcs`.
- Ubuntu su WSL; Node v24.18.0 tramite nvm.
- Claude CLI disponibile. Claude scrive il codice; Codex coordina e revisiona.
- Branch main, nessun remote all'ultima verifica.
- Ultimo commit funzionale prima del registro: 26335f2. Ultimo commit prima di questa sessione: cf64630.
- Per il commit del registro e le modifiche successive usare `git log -5 --oneline`.

## Servizi verificati all'aggiornamento

- http://localhost:4321/ — HTTP 200, anteprima statica.
- http://127.0.0.1:55321/rest/v1/ — HTTP 200, API Supabase locale.
- DB: 55322; Studio configurato: 55323, non verificato nel browser.
- Non assumere che restino attivi dopo riavvio o sospensione.

## Come riprendere

1. Leggere questo checkpoint e il registro principale; controllare git status e git log.
2. Creare un nuovo file datato in sessions e registrare l'obiettivo della sessione.
3. Se necessario avviare il DB con npm run db:start; non fare db:reset come normale avvio, perché riapplica seed e schema.
4. Usare npm run db:verify per i controlli DB quando pertinenti.
5. Per modifiche usare npm run dev; per generare e vedere lo statico npm run build e npm run preview.
6. Se la porta 4321 è occupata dall'anteprima precedente, identificarne il processo prima di avviare un altro server.
7. Annotare azioni, verifiche, commit e stato finale; aggiornare questo checkpoint.

## Prossimo obiettivo

Definire e provare un flusso editoriale reale con fonti e bozze revisionabili, prima dell'automazione.
Modello/integrazione, credenziali, costi, scheduler e hosting restano da definire.
Non sostituire i demo con testi non verificati del briefing originale.

## Limiti da ricordare

Runtime Supabase sperimentale; build con più letture DB; sostituzione output con due rinomine.
Zoom 200% e Studio non verificati. Vedere report e registro per dettagli e prove effettive.

## Aggiornamento 2026-10-31T18:56:48+01:00

L’utente richiede sito in inglese e nessun periodo coperto visibile negli articoli. Implementazione ancora da fare. Sessione corrente: [2026-10-31_18-56-48_sito-in-inglese.md](2026-10-31_18-56-48_sito-in-inglese.md). Il registro retrospettivo precedente è stato completato; ora si passa alla traduzione tramite Claude.

## Aggiornamento 2026-10-31T18:59:08+01:00 — nome e delega attiva

Proposte di nome registrate in [2026-10-31_18-59-08_proposte-nome.md](2026-10-31_18-59-08_proposte-nome.md); preferenza Codex TCS Brief, nessuna scelta dell’utente ancora. Non applicare nomi al codice come se approvati. La delega di traduzione inglese è risultata in corso (processo Claude PID 64967); il vecchio handle terminale 6428 non è disponibile, perciò controllare processo e OUTPUT_04_CLAUDE.md prima di avviare altre CLI. Traduzione e rimozione del periodo coperto non sono ancora verificate.

## Aggiornamento 2026-10-31T19:03:43+01:00 — proposta Briefly.tcs

L’utente propone Briefly.tcs e chiede un parere; Codex suggerisce Briefly.tcs per la testata e briefly-tcs per il repository. Nome non ancora applicato, disponibilità non verificata. Vedere il registro delle proposte di nome.
