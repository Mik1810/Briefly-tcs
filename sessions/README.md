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

| [2026-10-31_20-15-21_supabase-cloud.md](2026-10-31_20-15-21_supabase-cloud.md) | Preparazione Supabase cloud; scelta organizzazione e verifica costi pendenti |

| [2026-10-31_20-23-56_supabase-invito-account.md](2026-10-31_20-23-56_supabase-invito-account.md) | Invito vecchio account come Developer inviato; accettazione pendente |

| [2026-10-31_20-25-50_supabase-accesso-dopo-invito.md](2026-10-31_20-25-50_supabase-accesso-dopo-invito.md) | Schema cloud installato e permessi verificati; ripresa completata il giorno seguente |
| [2026-11-01_13-00-27_ripresa-supabase-sicurezza.md](2026-11-01_13-00-27_ripresa-supabase-sicurezza.md) | Ripresa: correzione funzione auto-RLS applicata, test cloud e Security Advisor puliti |
| [2026-11-01_13-02-03_claude-supabase-rls-auto-enable.md](2026-11-01_13-02-03_claude-supabase-rls-auto-enable.md) | Claude: migrazione stretta permessi auto-RLS e report |

| [2026-11-01_13-12-53_collegamento-supabase-cloud.md](2026-11-01_13-12-53_collegamento-supabase-cloud.md) | Collegamento sito a Supabase cloud verificato; modulo Vercel pronto, consenso push/deploy pendente |
| [2026-11-01_13-13-42_claude-supabase-cloud-target.md](2026-11-01_13-13-42_claude-supabase-cloud-target.md) | Claude: target cloud, isolamento env, test e runtime Node24 |

| [2026-11-01_13-38-25_primo-deploy-handoff-claude.md](2026-11-01_13-38-25_primo-deploy-handoff-claude.md) | Push e primo deploy Vercel READY; handoff completo a Claude |
| [2026-11-01_13-54-23_claude-publisher-pipeline.md](2026-11-01_13-54-23_claude-publisher-pipeline.md) | Claude: publisher posts → Supabase → Vercel, provato in locale; campi del post da concordare |

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
I report preesistenti in `docs/coordination/` erano richiamati dal primo riepilogo; sono stati rimossi il
2026-11-03 su richiesta dell'utente insieme a piano, handoff, design e prove (storia Git fino a 5ee701b).

Ultima attività: [2026-10-31_20-15-21_supabase-cloud.md](2026-10-31_20-15-21_supabase-cloud.md), in attesa della scelta organizzazione Supabase.

Ultima attività: [2026-10-31_20-21-01_supabase-cambio-account.md](2026-10-31_20-21-01_supabase-cambio-account.md); nuovo account non ancora visibile al connettore Supabase.

Ultima attività: [2026-10-31_20-23-56_supabase-invito-account.md](2026-10-31_20-23-56_supabase-invito-account.md); invito inviato e verificato nella UI, attesa accettazione del destinatario.

Ultima sessione di ripresa: [2026-11-01_13-00-27_ripresa-supabase-sicurezza.md](2026-11-01_13-00-27_ripresa-supabase-sicurezza.md). Sicurezza cloud verificata; prossimo passo collegamento applicativo al DB online.

Ultima sessione: [2026-11-01_13-12-53_collegamento-supabase-cloud.md](2026-11-01_13-12-53_collegamento-supabase-cloud.md). Build cloud reale riuscita; Vercel pronto per consenso finale a push e Deploy.

Ultima sessione: [2026-11-01_13-38-25_primo-deploy-handoff-claude.md](2026-11-01_13-38-25_primo-deploy-handoff-claude.md). Sito https://briefly-tcs.vercel.app online; passaggio completo [HANDOFF_CLAUDE.md](../docs/HANDOFF_CLAUDE.md).

Ultima sessione: [2026-11-04_13-05-03_bozzetti-icona.md](2026-11-04_13-05-03_bozzetti-icona.md) — quattro bozzetti per l’icona, scelta aperta.
