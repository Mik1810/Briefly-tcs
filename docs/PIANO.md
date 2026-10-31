# TCS quotidiano — piano di lavoro

Stato: proposta da discutere, non specifica approvata. Data: 31 ottobre 2026.
Nome provvisorio. Questa fase produce documenti e proposte visive, non codice applicativo.

## Requisiti confermati

- Tutto in locale. Nessuna pubblicazione, registrazione di siti o attivazione di servizi.
- Lavoro tramite Ubuntu su WSL; progetto condiviso in /mnt/c/Users/micha/Desktop/sito tcs.
- Blog veloce, sobrio, centrato sulla lettura e sulle formule.
- Evitare framework pesanti; Next.js non è previsto.
- Possibile hosting futuro su Vercel, da valutare in seguito senza legare il sito alla piattaforma.
- Codex coordina, mantiene il piano e revisiona. Claude CLI su WSL scriverà il codice.
- Prima si definiscono piano e direzione grafica, poi si implementa.
- L'attività ChatGPT esistente resta intatta; il suo contenuto è un riferimento editoriale, non una fonte scientifica verificata.

## Proposta di prodotto

Blog italiano rivolto a studenti avanzati e ricercatori di theoretical computer science.
Un post giornaliero raccoglie le novità significative; approfondimenti autonomi solo quando utili.
La frequenza è un obiettivo editoriale: non si inventano notizie per riempire un giorno vuoto.
Non si assume che i messaggi del briefing siano scientificamente corretti senza controllo delle fonti.

Prima versione: home, articolo, archivio cronologico, pagine per argomento, pagina Metodo.
Home: ultimo briefing e lista dei precedenti. Niente caroselli, immagini decorative o dashboard.
Articolo: titolo descrittivo, data e periodo coperto, sintesi, risultati, fonti e correzioni.
Archivio e argomenti: normali pagine e collegamenti, utilizzabili senza JavaScript.
Metodo: selezione delle fonti, ruolo dell'AI, revisione e politica di correzione.
RSS semplice è un'aggiunta sensata, ma può seguire il primo prototipo.
Ricerca testuale, commenti, account, newsletter e statistiche non fanno parte del nucleo iniziale.

## Architettura proposta, da approvare

Preferenza: Eleventy + Markdown + template HTML + CSS scritto a mano.
Eleventy è uno strumento di build; il lettore riceve pagine statiche, senza runtime UI obbligatorio.
Nessun React, router client o libreria di componenti è necessario per questa proposta.
Formule convertite durante la build con una libreria dedicata; KaTeX è un candidato da verificare nel prototipo.
Caratteri di sistema inizialmente; eventuali font dedicati locali e limitati, dopo la scelta grafica.
Contenuti salvati come file, versionabili e trasferibili. Nessun database nella prima versione.
L'output statico deve essere separato dai sorgenti e rigenerabile.

Alternative:
- HTML/CSS puro: perfetto per un bozzetto, ma duplicare manualmente articoli e archivi rende fragile il blog quotidiano.
- Astro statico: alternativa valida se emergono esigenze di componenti più strutturati; non richiede SSR per questo blog.
- Generatore personalizzato: evitabile; introduce manutenzione su funzionalità già standard.

Fonti tecniche consultate il 31 ottobre 2026:
- https://www.11ty.dev/ — generatore statico, Markdown, nessun framework JavaScript obbligatorio lato lettore.
- https://docs.astro.build/en/guides/on-demand-rendering/ — prerendering statico predefinito.
Le versioni e i pacchetti si sceglieranno all'implementazione, controllando le dipendenze effettive.

## Separare sito e redazione

Percorso di lettura: file editoriali validati → build → HTML/CSS e risorse locali → browser.
Percorso editoriale futuro: fonti → raccolta → selezione → scrittura → controlli → bozza/pubblicazione → build.
L'AI non viene chiamata quando un lettore apre una pagina.
Non si presume che l'attività ChatGPT possa scrivere direttamente nella cartella locale.
Il trasferimento dal briefing e l'eventuale automazione richiedono una scelta esplicita successiva.
Non sono ancora scelti modello, API, credenziali, costi, scheduler o modalità di approvazione editoriale.
La scelta di Claude come autore del codice non determina il modello che scriverà gli articoli.

## Contratto editoriale proposto

Ogni post avrà identificativo e slug stabili, titolo, sommario, lingua, data di pubblicazione e aggiornamento.
Separare il periodo di ricerca dalla data di pubblicazione delle fonti.
Date editoriali in Europe/Rome; memorizzazione con offset esplicito quando serve un orario.
Argomenti da un vocabolario iniziale ridotto: complessità, algoritmi, grafi, combinatoria, logica.
Stati editoriali: bozza o pubblicato; solo il secondo entra nel sito e nei feed.
Stato scientifico per ogni risultato, perché un briefing può mescolare più tipi di evidenza.
Conservare titolo originale, autori, URL canonico, identificativo/versione e provenienza dei lavori.
Raccolta e testo redazionale devono restare distinguibili.

Ogni risultato spiega: problema, enunciato essenziale, ipotesi, novità rispetto al precedente bound e limiti.
Distinguere preprint, accettazione, pubblicazione, formalizzazione e verifica indipendente.
Un link raggiungibile non basta a verificare un teorema: occorre controllare che il contenuto sostenga l'enunciato.
Un controllo automatico va presentato come tale, senza chiamarlo revisione matematica indipendente.
Niente superlativi o conseguenze più forti di quelle supportate dalla fonte.
Fonti primarie preferite: manoscritti, arXiv, ECCC, atti e pagine ufficiali degli autori.
Deduplicare per identificativo del lavoro e versione; una revisione importante è un aggiornamento esplicito.
Non ripubblicare automaticamente i vecchi briefing: prima verificare i contenuti e rimuovere i riferimenti personali.
I testi dimostrativi del prototipo saranno etichettati chiaramente come esempi, senza notizie scientifiche inventate.

## Fasi e consegne

### 0 — Piano e grafica, fase corrente

Codex: raccoglie requisiti e prepara tre direzioni visive.
Claude: revisiona architettura, piano e rischi; suggerisce semplificazioni senza implementare.
Consegne: piano consolidato, confronto visivo, decisioni pendenti, risposta di Claude.
Uscita: scelta dell'utente su grafica e nucleo iniziale; nessun codice prima di questa scelta.

### 1 — Prototipo statico locale

Claude implementa home e pagina articolo con contenuti dimostrativi etichettati.
Codex revisiona codice, leggibilità, accessibilità e peso delle risorse.
Verifica desktop e mobile; indice e testo principale leggibili senza JavaScript.
Consegna: avvio locale documentato e prototipo navigabile.
Nessuna integrazione AI o pianificazione giornaliera in questa fase.

### 2 — Blog completo, sempre locale

Claude aggiunge archivio, argomenti, Metodo, eventuale RSS e validazione dei metadati.
Codex controlla esclusione delle bozze, date, link, formule e consistenza del sito generato.
Verifica un articolo breve, uno lungo con formule e una correzione; verifica almeno due date di briefing.
Una build fallita non deve sostituire l'ultima versione locale valida.
Consegna: blog mantenibile da file con istruzioni riproducibili.

### 3 — Un ciclo editoriale reale controllato

Prima scegliere insieme il percorso: importazione manuale assistita, procedura locale o integrazione API.
Confrontare un campione di fonti reali con il testo prodotto; valutare precisione e qualità editoriale.
Definire il comportamento nei giorni senza notizie e in caso di ricerca incompleta.
Separare la revisione umana proposta dalla pubblicazione automatica, ancora da decidere.
Consegna: un briefing reale verificato e una procedura ripetibile, con limiti documentati.

### 4 — Automazione locale, solo dopo la prova editoriale

Scegliere esplicitamente frequenza, orario, fonti, modello e modalità di approvazione.
Una procedura locale non garantisce esecuzione quando il computer è spento o WSL non è disponibile.
Definire recupero all'avvio, lock contro esecuzioni sovrapposte e deduplicazione.
Errori di raccolta o verifica non devono sovrascrivere articoli validi o pubblicare bozze incomplete.
Credenziali fuori dai contenuti e dai file serviti; nessun segreto nel browser.
Nessun job viene creato durante la fase di piano.

### 5 — Hosting futuro, fuori dal lavoro attuale

Valutare Vercel o altro hosting statico partendo dall'output già funzionante in locale.
La pubblicazione del sito e l'esecuzione del processo editoriale sono due decisioni distinte.
Nessuna migrazione a Next.js è prevista come requisito dell'hosting.

## Criteri di accettazione proposti

- Articoli, archivio e navigazione funzionano con JavaScript disabilitato.
- Nessuna richiesta a CDN, font remoti, tracker o servizi AI per leggere un articolo locale.
- Nessuna chiamata a modelli durante la build ordinaria del sito.
- Base HTML/CSS della home entro 100 kB non compressi; obiettivo, da misurare sul prototipo.
- JavaScript applicativo iniziale pari a zero; ogni futura eccezione va motivata.
- Risorse matematiche e font misurate separatamente, senza nasconderle nel budget della pagina articolo.
- Layout verificato a 360, 768 e 1440 px, con tastiera e ingrandimento al 200%.
- Formule lunghe contenute nel blocco matematico, senza far scorrere orizzontalmente tutta la pagina.
- Date e ordinamenti deterministici, bozze escluse, slug univoci, pagine interne senza collegamenti rotti.
- Nessun punteggio prestazionale promesso senza misurazione e contesto di prova.

## Divisione del lavoro

Utente: priorità, scelte grafiche e approvazione del piano.
Codex: coordinamento, task circoscritti, revisione, controlli e sintesi delle decisioni.
Claude CLI: consulenza tecnica nella fase corrente; autore del codice nelle fasi successive.
Le revisioni di Claude e Codex vanno registrate come proposte, non come decisioni già approvate dall'utente.
Codex chiederà a Claude le correzioni di codice, senza assumere il ruolo di implementatore.

## Decisioni pendenti

1. Direzione grafica A/B/C o combinazione motivata.
2. Conferma del nucleo iniziale e della proposta Eleventy.
3. Nome definitivo e pubblico: italiano proposto, da confermare.
4. Briefing unico giornaliero proposto, contro post singoli per ogni risultato.
5. Revisione prima della pubblicazione oppure automatismo: non ancora deciso.
6. Produzione degli articoli, fonti, modello, eventuali costi e accesso: da affrontare dopo il blog locale.
