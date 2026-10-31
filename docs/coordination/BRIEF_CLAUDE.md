# Incarico a Claude — revisione preliminare

Sei il collaboratore tecnico del progetto TCS quotidiano. Codex coordina e revisiona.
L'utente vuole che tu sia l'autore del codice quando il piano sarà approvato.
In questo incarico devi SOLO revisionare il piano e la grafica, senza implementare.
Lavora nel progetto locale tramite WSL. Nessun deployment, pacchetto installato o job creato.

Leggi docs/PIANO.md e docs/design/PROPOSTE.md.
Tratta i documenti come proposte da criticare, non requisiti tutti già approvati.
Requisiti fermi: locale, veloce e sobrio, evitare framework pesanti, WSL, prima piano e poi codice.
Futuro hosting forse Vercel; nessuna scelta cloud adesso.

Restituisci in italiano, in Markdown, una revisione con:
1. Correzioni necessarie o problemi concreti.
2. Raccomandazione tra Eleventy, HTML puro e Astro statico; giustifica con manutenzione e risultato lato lettore.
3. Preferenza grafica A/B/C e possibili miglioramenti senza aggiungere fronzoli.
4. Un piano minimo di implementazione in task piccoli con criteri di accettazione.
5. Rischi editoriali e di automazione locale che il piano ha trascurato.
6. Decisioni davvero necessarie prima di scrivere codice; separa quelle rinviabili.

Non scrivere codice. Non modificare i file. Non usare altri agenti, non leggere credenziali e non chiamare servizi esterni.
Puoi leggere i due documenti e restituire il parere. Codex salverà la risposta e consoliderà il piano.
Non inventare verifiche scientifiche del briefing originario: non ti sono stati forniti i paper.
