# Incarico 01 a Claude — prototipo locale

L'utente ha confermato il piano: procedere. Sei l'autore di tutto il codice applicativo.
Codex è coordinatore e revisore. Usa WSL nel workspace corrente.
Leggi docs/DECISIONI.md e docs/design/PROPOSTE.md; puoi vedere docs/design/CONFRONTO.png con Read se supportato.
Le scelte correnti sono Astro + React, Supabase locale, grafica A esatta (non ibrido).
Un briefing al giorno con più risultati; approfondimenti autonomi possibili.
Pubblico: studenti magistrali e ricercatori. Produzione iniziale in bozza da revisionare.

Implementa un prototipo completo e navigabile locale, senza attendere ulteriori scelte:
- Astro statico + componenti React riutilizzabili + TypeScript, CSS scritto a mano.
- Nessun Next, Tailwind, libreria UI, CDN o font remoto. Niente JavaScript client se non strettamente necessario.
- Dipendenze con versioni esatte e lockfile. Usa Node già presente v24.18.0 in nvm, non installare Node.
- Home nello stile A: avorio, bordeaux, testata serif, articolo in evidenza, righe editoriali sobrie.
- Pagine articolo con corpo leggibile, formule renderizzate durante build con risorse KaTeX locali, metadati, fonti e correzioni.
- Archivio, argomenti e Metodo semplici, tutti collegati e funzionanti.
- Tre briefing dimostrativi con almeno un risultato ciascuno, uno lungo e con formule, ed esempio di correzione.
- Un contenuto bozza extra per controllare che non appaia in home, archivio, argomenti o dist.
- Label esplicita 'Contenuto dimostrativo' per ogni articolo demo; nessuna scoperta inventata presentata come reale.
- Esempi matematici standard come O(n log n) e n^2; non introdurre rivendicazioni reali del briefing originale.
- Date editoriali stringa YYYY-MM-DD, slug/ID validati, link alle singole sezioni dei risultati.
- Accessibilità: skip link, nav leggibile da tastiera, focus, link sottolineati nel corpo, contrasto e responsività.
- Testata di A, nessuna hero enorme, immagini decorative, ombre, pillole colorate, o animazioni.
- Layout a 360/768/1440 px e formule lunghe con overflow solo nel blocco, nessuno scroll globale.
- Sorgente dei contenuti di demo isolata dietro una piccola interfaccia: Supabase è il database previsto, ma non installare né avviare Supabase in questo incarico.
- Documenta chiaramente che i dati correnti sono fixture e non un'integrazione DB già funzionante. Nessun fallback silenzioso futuro da DB a fixture.
- README con npm run dev, check e build, e limite attuale sul DB.
- Esegui build e typecheck appropriati. Aggiungi solo controlli significativi su esclusione bozze, date e metadati, non test che copiano l'implementazione.
- Non avviare browser né server persistenti: Codex farà QA e avvierà il server.
- Aggiorna docs/DECISIONI.md distinguendo decisioni approvate e stato reale.

Vincoli:
- Nessun deployment, remote Git, push, job, API AI, accesso alle credenziali o progetto Supabase cloud.
- Nessun altro agente o subagente.
- Non committare: Codex revisionerà e creerà i commit. Non cambiare .git/config o identità Git.
- Non modificare documenti storici di revisione; preserva le immagini e i file di piano.
- Installare le dipendenze strettamente necessarie al progetto è autorizzato.
- Se incontri un errore, correggilo e continua; riporta i limiti reali senza dichiarare test non eseguiti.
- Dopo più componenti TSX leggi e applica il checklist in /mnt/c/Users/micha/.codex/plugins/cache/openai-curated-remote/vercel/0.54.1/skills/react-best-practices/SKILL.md.

Scrivi al termine un breve report in docs/coordination/REPORT_01_CLAUDE.md con file chiave, architettura, comandi/verifiche realmente eseguiti, misure e limiti.
