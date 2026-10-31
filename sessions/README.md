# Registro delle sessioni

Tutte le attività del progetto vengono registrate qui in Markdown, con data e ora **Europe/Rome** e offset esplicito.

## Da dove ripartire

1. Leggere [STATO_ATTUALE.md](STATO_ATTUALE.md).
2. Leggere la sessione principale indicata nel checkpoint e i registri Claude collegati.
3. Controllare git status, commit e servizi: gli stati storici possono essere superati da sessioni successive.

## Sessioni

| File | Contenuto |
| --- | --- |
| [2026-10-31_13-47-21_riepilogo-e-registro.md](2026-10-31_13-47-21_riepilogo-e-registro.md) | Sessione: riepilogo del progetto e introduzione del registro |
| [2026-10-31_18-56-48_sito-in-inglese.md](2026-10-31_18-56-48_sito-in-inglese.md) | Sessione: sito in inglese e metadati degli articoli |
| [2026-10-31_18-57-46_claude-sito-in-inglese.md](2026-10-31_18-57-46_claude-sito-in-inglese.md) | Sessione Claude — sito in inglese, periodo coperto nascosto |
| [2026-10-31_18-59-08_proposte-nome.md](2026-10-31_18-59-08_proposte-nome.md) | Sessione: nome del sito e repository |
| [2026-10-31_19-11-19_push-github-main.md](2026-10-31_19-11-19_push-github-main.md) | Sessione: diagnosi e collegamento GitHub main |
| [2026-10-31_19-17-57_claude-nome-briefly-tcs.md](2026-10-31_19-17-57_claude-nome-briefly-tcs.md) | Sessione Claude — applicazione del nome Briefly.tcs |
| [2026-10-31_19-43-49_stato-e-prossimi-passi.md](2026-10-31_19-43-49_stato-e-prossimi-passi.md) | Sessione: cosa manca per il blog quotidiano |
| [2026-10-31_19-48-47_pubblicazione-automatica-fattibilita.md](2026-10-31_19-48-47_pubblicazione-automatica-fattibilita.md) | Sessione: fattibilità della pubblicazione automatica |
| [2026-10-31_19-51-20_solo-abbonamento-senza-api-openai.md](2026-10-31_19-51-20_solo-abbonamento-senza-api-openai.md) | Solo abbonamento ChatGPT, API OpenAI escluse |
| [2026-10-31_19-54-42_solo-chatgpt-senza-codex.md](2026-10-31_19-54-42_solo-chatgpt-senza-codex.md) | Solo ChatGPT: pubblicazione tramite strumento collegato da verificare |
| [2026-10-31_19-59-23_vercel-supabase-hosting-previsto.md](2026-10-31_19-59-23_vercel-supabase-hosting-previsto.md) | Hosting previsto: Vercel e Supabase |
| [2026-10-31_20-01-00_test-automazione-chatgpt.md](2026-10-31_20-01-00_test-automazione-chatgpt.md) | Test ChatGPT: corsa/lettura osservata, scrittura bloccata 403 |

| [2026-10-31_20-09-58_ripresa-permessi-github.md](2026-10-31_20-09-58_ripresa-permessi-github.md) | GitHub sbloccato: scrittura interattiva e task automatico verificati |

Ultima prova conclusa: [2026-10-31_20-09-58_ripresa-permessi-github.md](2026-10-31_20-09-58_ripresa-permessi-github.md). Scrittura GitHub programmata riuscita; publisher Supabase/Vercel ancora da implementare.

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
