# Incarico 02 — Supabase locale, dopo il prototipo

Eseguire soltanto quando Codex invia esplicitamente questo incarico alla CLI.
Continua come autore del codice; Codex revisiona. Non usare altri agenti.
Non modificare grafica A o introdurre nuove funzioni di prodotto.

Scopo: sostituire il solo repository di fixture con una sorgente Supabase locale realmente verificata.
Leggi la skill /mnt/c/Users/micha/.codex/plugins/cache/openai-curated-remote/supabase/1.0.0/skills/supabase/SKILL.md e segui i riferimenti attuali.
Il manager ha già consultato il changelog: nessun breaking change recente identificato che riguardi la nuova istanza locale.
Docker Desktop è avviato; /var/run/docker.sock esiste in WSL. Il comando docker utente richiama docker.exe Windows: tienine conto.
Node è già presente. Dipendenze strettamente necessarie e container locali autorizzati.

Requisiti:
- CLI Supabase con versione esatta come dipendenza di sviluppo; usare --help prima dei comandi.
- Inizializza solo stack locale; nessun login cloud, link remoto, deploy, push o progetto hosted.
- Ascolto dei servizi locali solo su loopback, non sulla rete LAN. Non cambiare firewall o configurazione globale Docker.
- Usa un nome progetto e porte identificabili. Riduci i servizi attivi se sono inutili al database/REST/Studio.
- Schema piccolo: briefing e risultati/fonti, o JSON strutturato validato se più proporzionato; motivare la scelta.
- RLS su tutte le tabelle esposte. Lettura anonima soltanto dei contenuti pubblicati, nessuna scrittura anonima e nessuna lettura delle bozze.
- Crea e verifica lo schema secondo la skill, salvando migrazioni riproducibili e seed solo dimostrativi.
- Non resettare o cancellare altri database/volumi. Un eventuale reset è ammesso solo dell'istanza nuova di questo progetto.
- Mantieni gli stessi tre demo e la bozza; tutti chiaramente dimostrativi.
- Configurazione da ambiente ignorata da Git; template .env.example senza segreti.
- Non stampare o riportare chiavi privilegiate, password o token. Se il CLI status li restituisce, cattura in un processo e scrivi solo i campi necessari nel file ignorato.
- Lettura dati durante la generazione; nessun SDK Supabase nel browser e nessuna credenziale privilegiata nel bundle.
- npm run build deve leggere il database locale in modo esplicito/documentato; modalità fixture consentita soltanto esplicitamente per test/demo offline, senza fallback automatico.
- Errore DB = errore leggibile e niente nuovo output parziale che sostituisca l'ultima build valida; verifica questo comportamento.
- Prova RLS con una lettura pubblica e un tentativo lettura della bozza, e una scrittura anonima che deve essere negata.
- Esegui i controlli di schema/advisors se disponibili nella versione CLI; riporta esattamente eventuali limiti.
- Riesegui check e build, verifica conteggi/URL; non duplicare inutilmente test.
- Non committare e non avviare server web persistenti: li gestisce Codex.
- Non fermare Docker Desktop o servizi non appartenenti a questo progetto.

Documenta README e stato nelle decisioni. Report finale in docs/coordination/REPORT_02_CLAUDE.md:
comandi realmente eseguiti, verifica integrazione, migrazioni, esiti RLS, servizi/porte locali e limiti.
Se Docker/Supabase impediscono un'integrazione reale, descrivi il blocco preciso; non simulare il successo.

## Osservazione della revisione preliminare di Codex

Nel validatore iniziale updatedOn e correction.date rifiutano date uguali alla pubblicazione.
Un articolo può essere corretto lo stesso giorno: consentire uguaglianza e mantenere il rifiuto delle date precedenti.
Aggiungere una verifica mirata per la correzione nel giorno di pubblicazione.

## Altri esiti della revisione di Codex da correggere

- La correzione nello stesso giorno è già stata sistemata nel primo incarico: preservarla.
- Provato renderMarkdown('[prova](javascript:alert%281%29)', ...): produce href con javascript.
  Filtrare i protocolli pericolosi nei link del corpo Markdown e verificare con un test mirato.
  Preferire un'integrazione mantenuta, senza rompere la resa KaTeX o accettare HTML grezzo.
- I blocchi matematici con overflow devono essere raggiungibili e scorribili da tastiera, con semantica comprensibile.
