# Sintesi di Codex dopo la revisione di Claude

> Documento della proposta iniziale. Per React, Supabase, grafica A e Git prevale docs/DECISIONI.md.

Data: 31 ottobre 2026. Stato: proposta consolidata, da discutere con l'utente.
Leggere insieme a docs/PIANO.md. Questo documento precisa e aggiorna la proposta iniziale senza cancellarla.
La risposta integrale di Claude è conservata in CLAUDE_REVIEW.md; è una revisione, non una fonte tecnica verificata.
Claude ha letto i due documenti testuali; non ha visto la tavola raster. Nessun codice è stato scritto.

## Ambiente verificato

- Ubuntu su WSL disponibile e utilizzato per le operazioni di progetto.
- Claude Code CLI disponibile, versione 2.1.296, autenticato tramite account Claude.
- Node già presente su WSL, versione v24.18.0 nel percorso nvm.
- Progetto nella cartella Windows condivisa, vuota prima della pianificazione.
- In questa fase sono stati creati soltanto documenti e una tavola visiva. Nessuna dipendenza installata.
- Nessun repository remoto, deployment, attività pianificata o integrazione AI del blog configurata.

## Punti su cui concordiamo

1. Eleventy è la proposta più proporzionata per il nucleo attuale.
2. HTML e CSS statici, nessun runtime UI e nessun JavaScript necessario alla lettura.
3. Separare costruzione del blog da ricerca e produzione degli articoli.
4. Prototipo piccolo prima dell'automazione: home e articolo, poi archivio e argomenti.
5. Formula e font devono essere provati con contenuti realistici e misurati, non scelti solo sulla carta.
6. Una homepage compatta è utile a un notiziario frequente; tipografia editoriale per la lettura lunga.
7. Solo lavoro locale; hosting e scheduler restano fuori da questa fase.

## Aggiunte che Codex propone di integrare

- Home con gli ultimi 10 briefing, archivio paginato o suddiviso per anno. Il limite evita crescita senza controllo.
- Briefing quotidiano come unità di pubblicazione, con risultati dotati di ID e ancore stabili.
- Fonti, argomenti e stato scientifico a livello del singolo risultato.
- Pagine per argomento con titolo del risultato, data e link alla sua sezione del briefing.
- URL proposti: /briefing/YYYY-MM-DD/, /archivio/, /argomenti/<slug>/, /metodo/.
- Date editoriali come stringhe di calendario YYYY-MM-DD, distinte dagli istanti con offset.
- Finestre di raccolta consecutive definite con estremi non ambigui e deduplicazione persistente.
- Separare stato editoriale (bozza/pubblicato) da più dimensioni scientifiche: pubblicazione, formalizzazione e verifica.
- Non forzare stati scientifici ortogonali in una sola etichetta: un preprint può essere anche formalizzato.
- Correzioni strutturate con data e descrizione; aggiornamenti sostanziali segnalati visibilmente.
- Delimitatori matematici proposti: $...$ inline e $$...$$ in blocco; formule inline troppo lunghe spostate in blocco.
- Errori matematici o metadati invalidi devono interrompere la build con nome del file e motivo.
- Preferenza iniziale per KaTeX in build con risorse locali; MathML può essere valutato se riduce peso senza peggiorare la leggibilità nei browser scelti.
- Non scrivere un parser matematico personalizzato prima di valutare un'integrazione mantenuta.
- Build ordinaria completamente offline dopo l'installazione delle dipendenze; raccolta e controllo fonti esterne separati.
- Distinguere sempre installazione delle dipendenze, build del sito e processo editoriale.
- Costruire e validare un nuovo output separatamente prima di sostituire quello valido.
- Verificare la procedura di sostituzione sul filesystem effettivo: non promettere atomicità assoluta senza prova.
- Fonti grezze, log e dati personali fuori dalla cartella pubblicabile.
- Ogni articolo dichiara il ruolo reale dell'AI e l'eventuale livello di revisione effettivamente svolto.

## Valutazione grafica

Codex: preferenza A per identità e lettura, archivio compatto B.
Claude: preferenza B per home e archivio, A per articoli; giudizio basato sulle descrizioni.
Proposta comune da discutere: palette e testata di A, home compatta di B e articolo con tipografia A.
C rimane un'alternativa, non una proposta scartata dall'utente.
La tavola confronta A/B/C separati; non rappresenta ancora il layout ibrido.
Prima del codice l'utente sceglie direzione, densità della home e formato dei post.

## Precisazioni alla revisione di Claude

- Node è già installato: non serve chiedere il consenso per un'installazione che non è necessaria.
- git locale, fine riga LF e file esclusi sono preparazione tecnica ordinaria della futura implementazione, non decisioni di prodotto da scaricare sull'utente.
- Il percorso Windows è quello del workspace, ma non è stato imposto come vincolo permanente: non spostarlo senza necessità.
- Su /mnt/c prestazioni e watch possono richiedere attenzione: verificarli prima di proporre polling o trasferimenti di cartella.
- Non adottiamo come fatto il dettaglio su un possibile slittamento al giorno precedente in Europe/Rome: il problema da prevenire è la confusione tra date civili e istanti.
- Le affermazioni generali su ciclo di vita WSL, orologio e scheduler vanno verificate se e quando realizziamo l'automazione.
- I commenti legali della revisione non sono stati verificati e non entrano nei requisiti del prototipo locale.
- Le stime di righe di codice e dimensioni delle dipendenze di Claude non sono misure del progetto.
- Nessun nome di pacchetto, versione o comportamento futuro è approvato solo perché compare nella revisione.

## Lavoro assegnabile a Claude dopo la scelta dell'utente

1. Preparazione locale e generatore: confermare Node esistente, fissare le dipendenze e documentare avvio/build.
2. Home e articolo dimostrativi, con stile scelto e nessuna notizia inventata presentata come reale.
3. Resa delle formule e verifiche responsive; consegnare misure delle risorse.
4. Modello contenuti validato, bozze escluse e link deterministici.
5. Archivio, argomenti e Metodo; RSS facoltativo dopo il nucleo.
6. Verificare che errori di formula o metadati non distruggano l'ultima build valida.

Dopo ogni blocco: Claude comunica file toccati, verifiche eseguite e limiti; Codex revisiona e gli assegna le eventuali correzioni.
Codex non assume la scrittura del codice applicativo.
Nessun incarico di implementazione è ancora stato inviato.

## Scelte da chiedere ora all'utente

- Grafica A, B, C o ibrido A/B.
- Accettazione della proposta Eleventy e del nucleo home/articolo/archivio/argomenti/Metodo.
- Preferenza tra un briefing al giorno e post autonomi per ogni risultato.

Nome definitivo, font dedicati, RSS, generazione dei testi, revisione editoriale, scheduler e hosting si possono definire nei passi successivi.
