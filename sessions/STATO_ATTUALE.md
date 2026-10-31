# Stato attuale e ripresa

Aggiornato: 2026-10-31T19:59:23+01:00 — Europe/Rome.

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

## Ricognizione del 2026-10-31T19:43:49+01:00

Ultima sessione: [2026-10-31_19-43-49_stato-e-prossimi-passi.md](2026-10-31_19-43-49_stato-e-prossimi-passi.md). Stato del codice invariato rispetto alla consegna inglese.
La prossima attività proposta è un ciclo editoriale reale, da fonti a bozza revisionata e pubblicazione locale.
Origine dei briefing, integrazione/modello e automazione restano da definire; nessuna nuova implementazione avviata.
Questa ricognizione ha controllato Git e documenti, senza ricontrollare l'attuale disponibilità dei servizi.

## Decisione prevalente del 2026-10-31T19:48:47+01:00: pubblicazione automatica

L’utente non vuole un passaggio di revisione umana. Prossimo obiettivo: redazione, controlli e pubblicazione automatici di post inglesi.
La precedente proposta di ciclo con approvazione umana è superata. La bozza può essere solo uno stato tecnico intermedio, non un blocco per attendere l’utente.
Da provare/scegliere: task ChatGPT con strumento di pubblicazione collegato o job locale con API OpenAI (uso separato dall’abbonamento).
Nessuna automazione o integrazione nuova è attiva. Ultimo registro: [2026-10-31_19-48-47_pubblicazione-automatica-fattibilita.md](2026-10-31_19-48-47_pubblicazione-automatica-fattibilita.md).

## Vincolo prevalente del 2026-10-31T19:51:20+01:00: solo abbonamento

Niente API OpenAI o credenziali API: l’utente dispone del solo abbonamento ChatGPT e vuole usarlo.
La precedente opzione API è scartata. Da provare un'automazione locale Codex autenticata con ChatGPT che rediga/controlli/pubblici e rigeneri il sito senza revisione umana.
Servono PC e app attivi; le esecuzioni consumano i limiti del piano. La Task online resta intatta. Nessuna nuova automazione ancora attiva.
Ultimo registro: [2026-10-31_19-51-20_solo-abbonamento-senza-api-openai.md](2026-10-31_19-51-20_solo-abbonamento-senza-api-openai.md).

## Preferenza prevalente del 2026-10-31T19:54:42+01:00: solo ChatGPT, niente Codex quotidiano

Non attivare la proposta di automazione Codex. L’utente vuole il task ChatGPT online come autore, senza API OpenAI.
Da verificare un collegamento di pubblicazione tramite strumento/plugin: accesso nell’account, compatibilità col task e conferme sulle scritture. Nessuna prova unattended ancora eseguita.
Il task usa comunque ChatGPT e i relativi limiti: non confondere l’esclusione di Codex con consumo nullo dell’abbonamento.
Ultimo registro: [2026-10-31_19-54-42_solo-chatgpt-senza-codex.md](2026-10-31_19-54-42_solo-chatgpt-senza-codex.md).

## Hosting previsto — 2026-10-31T19:59:23+01:00

L’utente intende usare Vercel per il sito e Supabase hosted per il DB. Progettare il publisher per queste piattaforme, mantenendo Astro statico.
Ogni pubblicazione nel DB dovrà attivare una nuova build/deployment: l’HTML statico non si aggiorna con la sola scrittura nel DB.
Il codice ha ancora il vincolo localhost sull’URL Supabase: hosting non ancora configurato o verificato. Nessun deployment richiesto/eseguito qui.
Resta prioritaria la prova Task ChatGPT → strumento di scrittura, senza API OpenAI e senza Codex quotidiano.
Registro: [2026-10-31_19-59-23_vercel-supabase-hosting-previsto.md](2026-10-31_19-59-23_vercel-supabase-hosting-previsto.md).

## Prova ChatGPT online — 2026-10-31T20:09:12+01:00

Registro: [2026-10-31_20-01-00_test-automazione-chatgpt.md](2026-10-31_20-01-00_test-automazione-chatgpt.md).

- Task singolo Briefly.tcs — scheduler probe creato e risultato automatico osservato nel pannello Programmate. Lettura README remoto corrispondente a verifica indipendente; nessun Codex scheduler o API OpenAI.
- Scrittura isolata su branch di test FALLITA: 403 Resource not accessible by integration, riprodotto direttamente col connettore GitHub. Nessun branch/file remoto creato.
- Il task singolo non è più nell'elenco Attiva; briefing quotidiano originale invariato. Non dare per provata la puntualità dell'orario dichiarato.
- Permessi installazione GitHub non ancora ispezionabili: Configure richiede autenticazione utente. Scheda lasciata aperta, chiesta autenticazione senza modificare permessi.
- Pubblicazione DB/build/Vercel e scrittura unattended non verificate; publisher non implementato. Nessun cambiamento applicativo o deployment in questa prova.
- Prossimo passo: sbloccare autenticazione, leggere permessi e diagnosticare 403 prima di riprovare scrittura singola e programmata. Evidenza: ../docs/testing/chatgpt-scheduler-probe-20261031.jpg.
