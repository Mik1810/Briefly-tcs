Il sito ora è tutto in inglese e il periodo coperto non compare più negli articoli. Ho tradotto i demo anche nel database senza reset; `check`, `db:verify` e la build da Supabase sono tutti superati.

**Cosa è cambiato**
- **Lingua:** sono in inglese navigazione, titoli, footer, Metodo (riscritta), 404, etichette di accessibilità, metadati, stato scientifico, fonti, correzioni ("Demo content") e tutti i demo. La pagina ha `lang="en"` e le date sono nel formato "October 31, 2026". La testata è "**TCS** Daily".
- **Periodo coperto:** ho tolto il blocco da `ArticleMeta`. I campi `coverage`, la validazione e la colonna nel database restano.
- **Invariati:** stile A (nessun CSS toccato), URL e ancore (`/archivio/`, `/metodo/`, `#risultato-…`), ID, slug, date, stati, relazioni, schema e RLS. Restano invariati anche i titoli bibliografici originali e i nomi degli autori.

**Database senza reset**
- Ho salvato le fixture italiane di partenza in `.local/it-baseline/`, cartella ignorata da Git.
- Il confronto a vuoto ha dato tutte le righe del database identiche a quella baseline: nessuna modifica dell'utente, nessun dato estraneo o mancante.
- `scripts/translate-demo-db.ts --apply` ha aggiornato 30 righe su 30 in un'unica istruzione SQL. Ogni aggiornamento tocca una riga solo se è ancora identica all'originale italiano. Rilanciato a vuoto, lo script non trova più nulla da aggiornare.
- Il seed è rigenerato in inglese per le nuove istanze; il README spiega la procedura senza reset.

**Verifiche** (in un ambiente senza le variabili `CLAUDE*`/`AI_AGENT`)

| Comando | Esito |
|---|---|
| `npm run check` | 0 errori di tipo, 25 test superati |
| `npm run db:verify` | superato: i contenuti letti dal database coincidono con le fixture inglesi, la bozza resta invisibile, le scritture anonime sono rifiutate |
| `npm run build` da Supabase | 12 pagine, controlli superati, nessun ripiego sulle fixture |

`check-dist` ora controlla anche: `lang="en"`, la meta description, le date in inglese e l'assenza del periodo coperto nei metadati. Controlla inoltre che testo visibile, titoli ed etichette di accessibilità non contengano termini italiani. L'ho provato su una copia di `dist/` reinserendo il periodo coperto, `lang="it"`, una parola italiana e una data italiana: li ha segnalati tutti.

**Due cose da decidere voi**
- **Nome:** durante il lavoro in `docs/DECISIONI.md` è comparso il nome approvato **Briefly.tcs**. Non l'ho applicato, perché l'incarico diceva "TCS Daily" e DECISIONI chiede di coordinarsi prima di toccare il codice. Restano da decidere come dividere la testata nella parte in bordeaux e il sottotitolo, non ancora approvato.
- **Commit intermedio:** il commit `26bf0fc first commit` (Mik1810, 19:06) contiene gran parte di questo lavoro prima delle verifiche finali. Il remote GitHub è configurato e il branch risulta allineato a `origin/main`. Nessun file sensibile è nel repository (`.local/`, `.env`, `dist/`). Restano da versionare: README, DECISIONI, la descrizione in `package.json`, una piccola correzione in `check-dist`, il mio registro e il report.

**Limiti**
- Gli URL restano in italiano per non rompere i permalink.
- Il controllo dell'italiano si basa su un elenco di termini, quindi non garantisce che ogni frase sia in inglese.
- `ArticleMeta` non si può testare direttamente con il test runner di Node, che non carica file TSX: la verifica avviene sull'HTML generato.
- Nessuna verifica nel browser da parte mia.

Il server di Codex sul 4321 e lo stack Supabase restano attivi. Non ho fatto commit né push. Il report è in `docs/coordination/REPORT_04_CLAUDE.md`, il registro in `sessions/2026-10-31_18-57-46_claude-sito-in-inglese.md`.
