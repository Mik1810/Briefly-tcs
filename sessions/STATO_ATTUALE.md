# Stato attuale e ripresa

Aggiornato: 2026-10-31T19:23:25+01:00 — Europe/Rome.

## Punto da cui ripartire

- Sessione principale: [2026-10-31_18-56-48_sito-in-inglese.md](2026-10-31_18-56-48_sito-in-inglese.md).
- [Indice completo](README.md), inclusi i registri di Claude e le lavorazioni parallele per nome/GitHub.
- [Decisioni](../docs/DECISIONI.md), [comandi di avvio](../README.md), [report inglese](../docs/coordination/REPORT_04_CLAUDE.md), [report nome](../docs/coordination/REPORT_05_CLAUDE.md).

## Stato effettivo

- Nome approvato e applicato: **Briefly.tcs**.
- Sito in inglese: interfaccia, date, contenuti dimostrativi, metadati e accessibilità; html lang=en.
- Il periodo coperto non compare nei blog post; campi interni coverage e validazione conservati.
- Stile A invariato: avorio/bordeaux, serif, articolo in evidenza. Sottotitolo inglese esistente conservato.
- Astro statico + React; nessun JavaScript necessario per leggere le pagine.
- Supabase locale nativo sperimentale; 3 briefing dimostrativi pubblicati e 1 bozza di controllo, ora in inglese.
- Schema, RLS, date, ID, URL e ancore conservati. Demo aggiornati senza reset (30 righe riconosciute).
- Nessuna acquisizione di notizie reali, redazione AI, automazione giornaliera o hosting attivato.

## Verifiche completate

Claude: check 0 errori, 25 test, db:verify e build da Supabase superati; 12 pagine generate.
Codex: controllo DB a vuoto (0 righe residue da tradurre), revisione del codice di aggiornamento e dell'articolo,
verifica nel browser di home/articolo in inglese e senza coverage visibile; zero script; mobile 360 px senza overflow globale.
Schermate finali: docs/design/qa/article-english-desktop.jpg e article-english-mobile.jpg.
Dettagli ed eventuali limiti nei registri e nei report; non considerare la traduzione una verifica scientifica dei demo.

## Ambiente e Git

- Windows: C:\Users\micha\Desktop\sito tcs.
- WSL: /mnt/c/Users/micha/Desktop/sito tcs, Ubuntu, Node v24.18.0 tramite nvm.
- Codex coordina/revisiona/documenta; Claude CLI scrive il codice. Leggere AGENTS.md e CLAUDE.md.
- Branch main. Remote origin: https://github.com/Mik1810/Briefly-tcs.git.
- Collegamento GitHub e primo push effettuati nella lavorazione parallela e registrati nella sessione 19-11-19_push-github-main.
- Ultimo commit applicativo di questa sessione: b836896. I nuovi commit di questa sessione sono locali; nessun push qui eseguito.
- Questo checkpoint viene versionato nel successivo commit documentale. Usare git log -5 --oneline e git status per HEAD e allineamento corrente.

## Servizi lasciati attivi

- http://localhost:4321/ — anteprima statica, verificata nel browser.
- API locale 127.0.0.1:55321, DB 55322, Studio configurato 55323.
- Non assumere disponibilità dopo riavvio/sospensione. Stack nativo, nessuna dipendenza dal socket Docker per questo progetto.

## Ripresa operativa

1. Leggere checkpoint e registri, verificare git status e git log; controllare eventuali lavori concorrenti.
2. Aprire un nuovo registro datato in sessions prima di agire.
3. Se necessario avviare DB con npm run db:start. Non usare db:reset come normale avvio: ripristina schema e seed.
4. Per lo sviluppo npm run dev; per generare npm run build; per vedere lo statico npm run preview.
5. Controllare chi occupa 4321 prima di avviare un secondo server.
6. Aggiornare registro e checkpoint con azioni, verifiche, servizi e commit reali, senza credenziali.

## Prossimo obiettivo e limiti

Definire un flusso editoriale con fonti, bozze revisionabili e una prova su un briefing reale.
Modello/integrazione, credenziali, eventuali costi, scheduler e hosting restano da definire prima dell'automazione.
Restano: runtime Supabase sperimentale, più letture DB per build, sostituzione output con due rinomine,
zoom browser 200% e Studio non verificati, RSS e approfondimenti autonomi non implementati.
Gli URL italiani rimangono per conservare i permalink; i testi pubblici sono inglesi.
