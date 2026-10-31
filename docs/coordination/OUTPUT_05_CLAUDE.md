Il sito ora si chiama **Briefly.tcs**: in testata "Briefly" è nel colore del testo e ".tcs" nel bordeaux già usato per l'accento, senza nessuna modifica al CSS.

**Modifiche nel codice** (gli unici quattro punti con il vecchio nome):
- **Testata:** `SiteHeader.tsx`. In home è il titolo principale, nelle altre pagine è un link alla home.
- **Titoli delle pagine e footer:** `BaseLayout.astro`. I titoli diventano "Archive · Briefly.tcs" e simili; il footer dice "Briefly.tcs — local prototype".
- **Titolo della home:** `index.astro`.

Il sottotitolo resta "Theoretical computer science briefings for graduate students and researchers.". Non ho applicato quello solo proposto.

**Verifiche** (in un ambiente senza le variabili `CLAUDE*`/`AI_AGENT`):
- `npm run check`: 0 errori, 25 test superati.
- `npm run build` da Supabase: 12 pagine, controlli dell'output superati.
- Nell'output generato:
  - testata, titoli e footer mostrano Briefly.tcs;
  - "TCS Daily" e "TCS quotidiano" non compaiono più;
  - il sito resta in inglese e il periodo coperto resta nascosto.

Come richiesto, non ho aggiunto test per una semplice sostituzione di nome.

**Documentazione:** ho aggiornato il nome corrente nel README e nella descrizione di `package.json`, e ho aggiunto una voce in DECISIONI senza cancellare la cronologia. I nomi interni restano `tcs-quotidiano`, sia per il pacchetto npm sia per lo stack Supabase.

**Cosa non ho toccato:** database, URL, schema, CSS, Git, il remote e il server sul 4321. Nessun commit né push.

Il report è in `docs/coordination/REPORT_05_CLAUDE.md`, il registro in `sessions/2026-10-31_19-17-57_claude-nome-briefly-tcs.md`.
