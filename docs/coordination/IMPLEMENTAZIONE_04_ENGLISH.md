# Incarico 04 — sito in inglese, senza periodo coperto visibile

Implementa le nuove richieste dell'utente. Codex coordina e revisiona; tu scrivi tutto il codice applicativo.
Leggi AGENTS.md e CLAUDE.md, sessions/README.md e sessions/STATO_ATTUALE.md.
Sessione di Codex corrente: sessions/2026-10-31_18-56-48_sito-in-inglese.md. Non modificarla: crea il tuo registro come richiesto da CLAUDE.md.

Richieste:
1. Sito interamente in inglese: navigazione, titoli, footer, page Metodo, errori/404 visibili, etichette di accessibilità, etichette demo/stato scientifico/fonti/correzioni, metadati HTML e testi dimostrativi.
2. lang="en" e date inglesi leggibili. Nome provvisorio tradotto in "TCS Daily".
3. Nessun periodo coperto visibile dentro gli articoli. Togli il relativo blocco da ArticleMeta, ma conserva i campi coverage interni e la validazione: possono servire all'acquisizione futura.

Vincoli:
- Mantieni stile A, colori, spaziature e struttura; nessun redesign.
- Conserva permalinks, ID, slug, date editoriali, relazioni, status e RLS. Non introdurre i18n/multilingua: unica lingua pubblica inglese.
- Commenti tecnici, documentazione interna e registri possono restare italiani. Titoli bibliografici originali e nomi degli autori non si traducono arbitrariamente.
- Traduci anche i demo effettivamente letti da Supabase, non solo le fixture.
- NON usare db:reset, non cancellare/troncare le tabelle, non perdere dati dell'utente.
- Prima degli aggiornamenti conserva i fixture italiani di partenza in memoria o file ignorato per il confronto; verifica che i demo nel DB corrispondano prima di aggiornarli.
- Usa aggiornamenti mirati/transazione sui soli demo riconosciuti e sui loro testi/argomenti. Se un demo è stato modificato dall'utente o trovi altri dati, preservali e segnala la differenza anziché sovrascriverli.
- Rigenera il seed inglese per i nuovi avvii del progetto; documenta l'aggiornamento dei dati esistenti senza reset.
- Nessuna modifica allo schema, nessuna migrazione strutturale necessaria per una traduzione.
- Aggiorna check-dist e test per le nuove etichette/demo/date, preservando i controlli funzionali. Aggiungi una verifica significativa che i metadati articolo non mostrino coverage e che l'HTML sia inglese.
- Esegui check, db:verify e build da Supabase. La build normale deve continuare a leggere DB e non fare fallback alle fixture.
- Leggi/applica il checklist React in /mnt/c/Users/micha/.codex/plugins/cache/openai-curated-remote/vercel/0.54.1/skills/react-best-practices/SKILL.md.
- Niente altri agenti, commit, push, deploy, job o API AI. Nessun segreto nei log.
- Non fermare il server statico esistente sul 4321; Codex farà la verifica nel browser.
- Aggiorna README e stato reale senza riscrivere i report storici o il checkpoint gestito da Codex.

Consegna: report breve docs/coordination/REPORT_04_CLAUDE.md e registro datato in sessions, con modifiche, query di aggiornamento (senza credenziali), esiti reali e limiti.
