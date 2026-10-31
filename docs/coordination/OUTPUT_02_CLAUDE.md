L'integrazione con Supabase locale funziona ed è verificata: `npm run build` legge i contenuti dal database, RLS lascia vedere solo i briefing pubblicati e le scritture anonime vengono rifiutate.

**Ho dovuto deviare dal brief sul punto Docker.** In questa WSL `/var/run/docker.sock` non esiste. C'è `docker-cli.sock`, ma nessun processo lo ascolta, e `docker` richiama `docker.exe` di Windows. Inoltre la CLI 2.122.0, con Docker, pubblica le porte su tutte le interfacce: l'ho verificato nel suo sorgente. Limitarle a loopback richiederebbe di cambiare la configurazione globale di Docker, che è vietato. Ho quindi usato il **runtime nativo della CLI** (`supabase start --runtime native`), che fa girare i servizi come processi in WSL. Ascoltano solo su `127.0.0.1`, e l'ho controllato sui socket reali con `ss -ltnp`. Il limite è che questi comandi sono **sperimentali** ed esclusi dalla garanzia di compatibilità della CLI. Se preferite Docker, servono due cose: attivare l'integrazione WSL in Docker Desktop e trovare una soluzione per le porte esposte. È una decisione vostra.

**Cosa c'è**
- **Stack locale `tcs-quotidiano`**: API/REST su 55321, Postgres su 55322, Studio su 55323, tutto su 127.0.0.1. I servizi inutili sono spenti. I dati stanno in `~/.supabase/`, fuori dal repository.
- **Schema relazionale** in una migrazione:
  - sei tabelle piccole, con vincoli (una data per briefing, argomenti dal vocabolario, ogni correzione legata a un risultato dello stesso briefing);
  - RLS attiva su tutte; il ruolo anonimo ha solo permesso di lettura e nessuna policy di scrittura.
  
  Il seed contiene i tre demo e la bozza, generati dalle fixture.
- **Lettura in build**: `fetch` verso l'API REST con la chiave publishable, che vale come ruolo anonimo. Nessun SDK Supabase e nessuna chiave nel browser. Lo script che scrive `.env` salva solo URL e chiave publishable e non stampa le chiavi.
- **Sorgente sempre esplicita**: `npm run build` legge da Supabase, `npm run build:fixture` dalle fixture. Senza indicazione la build si ferma, e non c'è mai un ripiego automatico sulle fixture.
- **Build protetta**: genera in `dist-staging/`, esegue i controlli e solo se passano sostituisce `dist/`.

**Verifiche eseguite**
- `npm run db:verify`:
  - i contenuti letti dal database sono identici alle fixture pubblicate;
  - la bozza esiste nel database ma l'utente anonimo riceve zero righe;
  - `POST`, `PATCH` e `DELETE` anonimi ricevono HTTP 401 (permesso negato) e i dati restano invariati.
- Gli advisors della CLI segnalano solo due avvisi informativi su indici non ancora usati, normali su un database appena creato.
- Con il database fermo la build si interrompe con un messaggio chiaro e `dist/` resta identico byte per byte. Stesso risultato se i controlli falliscono dopo la generazione: ho provato inserendo apposta il marcatore delle bozze in un risultato pubblicato, poi ho ripristinato il database con `db reset`, solo su questa istanza.
- `npm run check`: 0 errori e 25 test superati. La build finale da Supabase è riuscita.

**Correzioni chieste da Codex**
- **Link pericolosi**: i link `javascript:`, `data:` e `vbscript:` perdono l'`href`, grazie a `rehype-sanitize` applicato prima di KaTeX. Le formule si vedono come prima.
- **Formule larghe**: le formule in blocco ora si raggiungono con Tab, si scorrono con le frecce e hanno un'etichetta per gli screen reader. Anche quelle corte ricevono il focus, perché senza JavaScript non si sa in anticipo quali sbordano.
- **Correzione nello stesso giorno**: resta ammessa.

**Da sapere**
- Il gateway locale accetta anche richieste **senza chiave** e le tratta come anonime. RLS si applica comunque.
- La build legge il database due volte, una per la validazione e una per la generazione. Una modifica fatta in mezzo non verrebbe notata.
- Non ho aperto né Studio né alcun browser.
- **Lo stack resta avviato** per le vostre build e la QA; si ferma con `npm run db:stop`.

Non ho fatto commit. La cartella `docs/design/qa/` non è mia e non l'ho toccata. Il report con comandi, porte, migrazioni ed esiti RLS è in `docs/coordination/REPORT_02_CLAUDE.md`.
