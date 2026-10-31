# Registro delle sessioni

Tutte le attività del progetto vengono registrate qui in Markdown, con data e ora **Europe/Rome** e offset esplicito.

## Da dove ripartire

1. Leggere [STATO_ATTUALE.md](STATO_ATTUALE.md).
2. Leggere l'ultima sessione elencata sotto e gli eventuali registri di Claude collegati.
3. Controllare `git status`, commit e disponibilità dei servizi prima di assumere che lo stato sia ancora identico.

## Sessioni

| File | Contenuto |
| --- | --- |
| [2026-10-31_13-47-21_riepilogo-e-registro.md](2026-10-31_13-47-21_riepilogo-e-registro.md) | Riepilogo retrospettivo completo, situazione verificata e introduzione del registro |

Ultima sessione in corso: [2026-10-31_18-56-48_sito-in-inglese.md](2026-10-31_18-56-48_sito-in-inglese.md).

## Regole del registro

- All'inizio di ogni nuova sessione creare `YYYY-MM-DD_HH-MM-SS_<argomento>.md` usando l'ora di Roma.
- Specificare autore, richiesta, obiettivo, stato iniziale e commit di partenza.
- Durante il lavoro aggiungere voci con timestamp: azione, motivazione, file/comandi rilevanti, esito, eventuali errori e correzioni.
- Registrare anche deleghe a Claude, report ricevuti, revisione di Codex, cambiamenti del piano e decisioni dell'utente.
- Separare chiaramente attività **eseguite**, risultati **verificati**, osservazioni **riferite da Claude** e passi **pianificati**.
- Registrare controlli falliti e limiti reali; non annotare come completata un'attività solo proposta.
- Non ricostruire orari mancanti: indicare che sono ignoti oppure usare timestamp verificabili da Git o dai report.
- A fine sessione aggiungere: consegna, test, commit, servizi lasciati attivi o fermati, blocchi e prossime azioni.
- Aggiornare `STATO_ATTUALE.md` e questo indice; versionare i registri con Git insieme alle modifiche pertinenti.
- Conservare la cronologia: eventuali rettifiche vanno aggiunte come nuove voci, non cancellando attività pregresse.
- Non registrare chiavi, password, token, contenuto di `.env` o output contenenti credenziali.
- Questo è un registro operativo: dettagli tecnici estesi possono essere collegati ai report, evitando di duplicarli integralmente.

## Coordinamento Codex / Claude

Codex mantiene riepilogo e checkpoint. Claude, per ogni nuovo incarico, scrive il proprio registro datato in questa cartella e lo comunica a Codex.
Codex collega il registro e gli esiti della revisione nella sessione principale.
I report preesistenti in `docs/coordination/` restano conservati e sono richiamati dal primo riepilogo.
