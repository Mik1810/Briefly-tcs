Ho corretto `db:verify`: ora passa anche in un terminale normale, e la build da Supabase (non fixture) è riuscita.

**Causa.** `supabase db query --local` non chiedeva un formato di uscita, quindi la CLI lo sceglieva da sola. Se vede le variabili dell'agente (`CLAUDECODE`, `AI_AGENT`) restituisce JSON, altrimenti stampa una tabella Unicode. Io avevo eseguito `db:verify` solo nel mio ambiente, per questo l'errore non era emerso.

**Correzione** (solo `scripts/verify-db.ts`, grafica e schema invariati):
- **Formato esplicito:** il comando usa sempre `--output-format json`.
- **Due forme di JSON:** anche così la forma cambia. In un terminale normale arriva l'elenco delle righe, nell'ambiente dell'agente arriva un oggetto `{boundary, rows, warning}`. Lo script accetta solo queste due forme e controlla che ogni riga sia un oggetto.
- **Errori senza dati:** se qualcosa non torna, il messaggio non riporta l'uscita della CLI, che potrebbe contenere dati del database.
- **Altri parser ricontrollati:** `write-env.ts` chiedeva già il JSON esplicito, e la forma di `status` è la stessa nei due ambienti. `db:start` scarta il proprio output e nessun altro script legge l'uscita della CLI.

**Esiti in ambiente pulito** (tolte tutte le variabili `CLAUDE*` e `AI_AGENT`; non ci sono variabili `SUPABASE_*` di formato):

| Comando | Esito |
|---|---|
| `npm run db:env` | `.env` scritto, nessuna chiave stampata |
| `npm run db:verify` | superato: 3 pubblicati e 1 bozza nel database; l'utente anonimo vede solo i 3 pubblicati, identici alle fixture; bozza a zero righe; 5 scritture anonime rifiutate con HTTP 401 (codice 42501), dati invariati; senza chiave HTTP 200 con 3 righe |
| `npm run db:verify` nell'ambiente dell'agente | superato anche lì |
| `npm run check` | 0 errori di tipo, 25 test superati |
| `npm run build` (Supabase) | 3 briefing ricevuti e validati, 12 pagine, controlli superati, `dist/` sostituito; il piè di pagina riporta "Dati: database Supabase locale…" |

Il server di Codex sul 4321 è ancora attivo. Ho aggiunto la sezione "Correzione dopo la verifica indipendente di Codex" in `docs/coordination/REPORT_02_CLAUDE.md`. Nessun commit né push.
