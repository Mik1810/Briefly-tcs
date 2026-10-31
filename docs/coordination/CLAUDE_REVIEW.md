# Revisione di Claude: piano TCS quotidiano e direzioni grafiche

Ho letto solo `docs/PIANO.md` e `docs/design/PROPOSTE.md`. La tavola raster citata in `PROPOSTE.md:4` non l'ho vista, quindi giudico la grafica dalla descrizione scritta. Non ho modificato file, eseguito comandi o consultato fonti esterne. Le osservazioni su comportamenti tecnici vengono da conoscenze generali e vanno confermate nel prototipo.

---

## 1. Correzioni necessarie e problemi concreti

**Ambiente WSL e cartella su `/mnt/c`**
- **Watch e prestazioni.** Il progetto sta sul filesystem Windows, a cui WSL2 accede tramite 9P. Ne seguono due problemi:
  - `npm install`, `node_modules` e le build sono molto più lenti che nella home Linux.
  - Il watch di `eleventy --serve` spesso non vede le modifiche salvate da editor Windows, perché inotify non le riceve.

  Il requisito del percorso condiviso resta valido, ma il piano deve prevedere una contromisura: watch in polling, oppure rebuild manuale documentato.
- **Il progetto non è un repository git.** `PIANO.md:39` parla di contenuti "versionabili", ma git manca. Serve un `git init` locale, senza remote, prima del primo commit di codice. Servono anche `.gitattributes` con fine riga LF, per evitare CRLF misti tra Windows e WSL, e un `.gitignore` per `_site/` e `node_modules/`.
- **Node non è citato.** Non si dice quale versione usare né come installarla (nvm o apt). L'installazione è un'azione che il piano vieta senza approvazione, quindi va decisa esplicitamente. Va anche fissata la versione nel progetto (`engines` o `.nvmrc`).

**Date**
- `PIANO.md:66` chiede date in Europe/Rome. In Eleventy (e in YAML) una data come `date: 2026-10-31` viene letta come mezzanotte UTC. Se poi la si formatta nel fuso locale, può slittare al giorno prima. È un bug classico dei blog statici. La regola va scritta subito: date editoriali come stringhe `YYYY-MM-DD`, formattate senza conversioni di fuso, e `TZ` esplicito nella build.
- Il "periodo coperto" va definito in modo operativo. Per esempio, gli annunci arXiv arrivano a un orario fisso della costa est USA, non a mezzanotte di Roma. Senza una regola scritta, lo stesso lavoro può finire in due briefing o in nessuno.

**Modello dei contenuti**
- **Argomenti per post o per risultato?** Se il post è un briefing giornaliero con più risultati e gli argomenti stanno sul post, le pagine per argomento diventano poco utili: quasi ogni briefing finirebbe in tutte. Il piano dichiara stato scientifico per risultato (`PIANO.md:69`) ma non fa lo stesso per gli argomenti. Propongo che stato, argomenti e fonte appartengano al singolo risultato e che le pagine per argomento elenchino risultati con link all'ancora nel briefing. Questo aumenta la complessità, quindi va deciso prima del modello dati.
- **Stato scientifico senza vocabolario.** `PIANO.md:74` elenca i casi (preprint, accettazione, pubblicazione, formalizzazione, verifica indipendente) ma non li trasforma in valori ammessi. Servono valori chiusi e validati.
- **Correzioni come dato strutturato.** Ogni correzione dovrebbe avere data e descrizione, comparire nell'articolo e aggiornare `updated`. Il piano le cita solo come sezione.
- **Validazione.** Eleventy non valida il front matter. La "validazione dei metadati" (`PIANO.md:102`) richiede un controllo scritto a mano: campi obbligatori, slug duplicati, stati e argomenti fuori vocabolario, formato delle date. La build deve fallire con messaggi chiari.

**Formule**
- **KaTeX "senza CDN".** L'output HTML di KaTeX richiede il suo CSS e una ventina di file di font da servire in locale. Va bene, ma è peso da misurare (il piano lo prevede in `PIANO.md:138`). Propongo di confrontare nel prototipo due opzioni:
  - KaTeX HTML+MathML, con CSS e font locali;
  - solo MathML (con KaTeX `output: mathml` o Temml), che non richiede CSS né font, ma ha resa tipografica variabile tra browser.
- **Errori silenziosi.** Un errore LaTeX non deve diventare testo rosso dentro la pagina: la build deve fallire (`throwOnError` attivo).
- **Delimitatori.** `$…$`, `$$…$$` oppure `\(…\)`, `\[…\]`. Conta per chi scrive e soprattutto per un futuro testo generato da modelli. Va deciso prima dei contenuti.
- **Plugin markdown-it.** Quelli per la matematica sono spesso poco mantenuti. Un piccolo adattatore locale che chiama direttamente la libreria è probabilmente più sicuro.
- **Formule lunghe.** Il criterio in `PIANO.md:140` vale per i blocchi (scorrimento orizzontale interno). Per le formule inline lunghe serve una regola editoriale: spostarle in blocco.

**Build e output**
- **Build atomica.** "Una build fallita non deve sostituire l'ultima versione valida" (`PIANO.md:105`) richiede una procedura precisa: build in una cartella temporanea, controlli, poi rinomina al posto di `_site/`. La modalità standard di Eleventy scrive direttamente nell'output. Va specificato, altrimenti il criterio resta sulla carta.
- **Il budget dei 100 kB non regge nel tempo.** La home e l'archivio crescono di un elemento al giorno. Propongo una home con gli ultimi N briefing e archivi per anno. Senza questo, in un anno il budget salta.
- **RSS e URL canonici.** Richiedono un URL assoluto, che oggi non esiste. Basta un `baseUrl` segnaposto in un unico file di configurazione. Il feed dovrebbe contenere sommario e link, non il corpo con le formule: i lettori di feed gestiscono male MathML e il CSS di KaTeX.
- **Rete durante la build.** Il criterio "nessuna chiamata a modelli durante la build" va esteso a "nessuna richiesta di rete durante la build". Il controllo dei link esterni diventa un comando separato e facoltativo.

**Dettagli minori**
- Il campo "lingua" (`PIANO.md:64`) serve soprattutto per marcare con `lang="en"` i titoli originali in inglese. Basta questo, niente infrastruttura multilingua.
- La struttura degli URL non è decisa, ed è l'elemento più costoso da cambiare dopo. Vedi sezione 6.

---

## 2. Eleventy, HTML puro o Astro statico

**Raccomandazione: Eleventy**, con una sola lingua di template (Nunjucks per i layout, Markdown per i contenuti) e dipendenze ridotte al minimo: Eleventy, la libreria per le formule e più avanti il plugin RSS ufficiale.

**Per il lettore Eleventy e Astro statico sono equivalenti.** Entrambi producono HTML e CSS statici e, configurati bene, zero JavaScript. Velocità, accessibilità e funzionamento senza JS dipendono dai template e dal CSS, non dallo strumento. La scelta riguarda quindi solo la manutenzione.

**Manutenzione:**
- **Eleventy.** Pochi concetti (collezioni, paginazione, layout, filtri) e un albero di dipendenze piccolo, che conta su `/mnt/c` dove ogni file in `node_modules` costa. Lo stack è stabile e adatto a contenuti in Markdown. Archivi per anno e pagine per argomento si fanno con la paginazione nativa. Il punto debole è l'assenza di validazione dei metadati: va scritta (vedi sezione 1), ma sono poche decine di righe.
- **Astro statico.** Le content collections con schema validano il front matter in modo nativo, ed è un vantaggio reale. In cambio porta Vite, un albero di dipendenze molto più grande, una sintassi a componenti propria e un ritmo di aggiornamenti maggiori più rapido. Ne varrebbe la pena con molti componenti riutilizzabili e interattivi, che questo blog non ha.
- **HTML puro.** Va bene per i bozzetti grafici, non per un blog quotidiano. Archivio, argomenti, navigazione precedente/successivo e feed andrebbero aggiornati a mano ogni giorno, con errori sicuri. Un generatore fatto in casa per evitarlo è peggio di Eleventy.

**Condizione:** se dopo il prototipo la validazione scritta a mano risulta fragile, Astro torna in discussione. Non serve deciderlo adesso.

---

## 3. Preferenza grafica

**Preferenza: A per l'articolo, B per home e archivio.** Concordo con Codex, ma propongo una divisione più netta:
- **Home e archivio con la struttura di B:** elenco cronologico con data allineata, titolo, argomenti come testo e una riga di sintesi. In cima l'ultimo briefing con il suo sommario, nessun "articolo principale" grande stile rivista. Per un notiziario quotidiano la cosa più utile è vedere subito cosa è uscito e quando.
- **Articolo con la tipografia di A:** titoli serif, colonna di 65–72 caratteri, navigazione precedente/successivo presa da B.
- **C non per la prima versione.** Le note a margine aumentano il lavoro su mobile e con le formule. Le date in monospace sono un vezzo: le cifre tabulari (`font-variant-numeric: tabular-nums`) allineano le date senza cambiare carattere.

**Miglioramenti senza fronzoli:**
1. **Il serif di sistema non è un serif.** Cambia da un sistema all'altro (Georgia su Windows, altro su macOS, Linux e Android), quindi A e C avranno un aspetto diverso a ogni lettore. Due strade:
   - accettarlo, con uno stack curato (Charter, Iowan Old Style, Georgia, serif) da provare accanto alle formule KaTeX, che hanno un loro carattere;
   - in seguito, un solo serif locale in WOFF2 con 2–3 pesi, misurato.

   Va bene decidere dopo il prototipo, ma il problema va dichiarato.
2. **Link nel corpo sempre sottolineati.** Il bordeaux su avorio ha buon contrasto, ma il colore da solo non basta, come dicono già le regole comuni. Serve anche distinguere i link visitati nell'archivio.
3. **Stato scientifico come testo semplice accanto al risultato,** per esempio "preprint · non sottoposto a revisione". Niente badge colorati.
4. **Correzioni in un blocco con bordo sottile e data,** in cima all'articolo se cambiano la sostanza, in fondo se sono minori.
5. **Date leggibili** ("31 ottobre 2026") dentro `<time datetime="2026-10-31">`.
6. **Testata con nome e quattro link** (Archivio, Argomenti, Metodo, eventualmente Feed). Niente hero, capolettera o sottotitolo promozionale. Una riga che dica di cosa parla il blog basta.
7. **Avorio contro bianco:** l'avorio di A va bene, ma i blocchi di formula non devono avere uno sfondo diverso che li faccia sembrare riquadri di codice.

---

## 4. Piano minimo di implementazione

Ogni task è piccolo e revisionabile da solo. I task da 0 a 5 corrispondono alla Fase 1, quelli da 6 a 11 alla Fase 2.

| # | Task | Criteri di accettazione |
|---|------|-------------------------|
| 0 | Preparazione: `git init` locale, `.gitignore`, `.gitattributes` (LF), versione Node fissata, README con avvio. Installazione di Node solo dopo approvazione. | `git status` pulito dopo il commit iniziale. Il README spiega come avviare su WSL, compreso il limite del watch su `/mnt/c`. Nessun remote configurato. |
| 1 | Scheletro Eleventy: sorgenti in `src/`, output in `_site/`, script `build` e `serve`. | `npm run build` genera `_site/index.html` da zero. Due build consecutive producono file identici. Nessuna richiesta di rete durante la build. |
| 2 | Layout base e CSS scritto a mano secondo la direzione scelta. | Nessun JS. Verifica a 360, 768 e 1440 px e con zoom al 200%. Focus da tastiera visibile. Contrasto AA sui colori scelti. CSS misurato e riportato. |
| 3 | Modello contenuti e tre contenuti dimostrativi etichettati come esempi: breve, lungo con formule, con correzione. | Ogni esempio è marcato visibilmente come dimostrativo. Nessun risultato scientifico presentato come reale. |
| 4 | Formule in build: confronto tra KaTeX HTML+MathML e solo MathML, poi scelta. | Formule leggibili senza JS. Formule lunghe con scorrimento nel blocco e pagina senza scorrimento orizzontale. Errore LaTeX = build fallita. Peso di CSS e font riportato a parte. |
| 5 | Home (ultimi N) e pagina articolo con precedente/successivo. | La home rispetta il budget misurato. Navigazione completa senza JS. Fine Fase 1, revisione di Codex. |
| 6 | Validazione dei metadati. | La build fallisce con un messaggio che indica file e campo in caso di campo mancante, slug duplicato, stato o argomento fuori vocabolario, data malformata. Una bozza con slug valido non compare in nessuna pagina né nel feed. |
| 7 | Archivio per anno e pagine per argomento (per risultato, se approvato). | Ordinamento deterministico. Pagine utilizzabili senza JS. Un argomento vuoto non genera una pagina vuota. |
| 8 | Pagina Metodo, con testo proposto da Claude/Codex e approvato dall'utente. | Il testo descrive il ruolo dell'AI e il livello di revisione reale, senza promettere verifiche che non si fanno. |
| 9 | Build atomica: cartella temporanea, controlli, sostituzione. | Con un errore introdotto apposta (formula rotta, metadato mancante) il `_site/` precedente resta intatto e il comando esce con codice diverso da zero. |
| 10 | Controllo offline dei link interni e delle ancore. | Un link interno rotto introdotto apposta viene segnalato. I link esterni sono esclusi dalla build ordinaria. |
| 11 | RSS/Atom (facoltativo). | Solo contenuti pubblicati. URL assoluti dal `baseUrl` di configurazione. Feed valido. Contiene sommario e link, non le formule renderizzate. |

---

## 5. Rischi trascurati dal piano

**Editoriali**
- **Diritto d'autore degli abstract.** Riassumere con parole proprie e limitare le citazioni letterali a brevi passi attribuiti. Copiare gli abstract è la scorciatoia naturale di un processo automatico.
- **Attribuzioni errate e nomi di persona.** Autori sbagliati, affiliazioni, diacritici. Un errore su un ricercatore è un danno reputazionale. La politica di correzione deve prevedere tempi e visibilità.
- **Dimostrazioni annunciate di grandi congetture.** Preprint che dichiarano di risolvere P vs NP o problemi simili compaiono regolarmente. Serve una regola esplicita: non trattarli, oppure solo con segnali di credibilità e stato ben evidenziato. Senza regola, un processo automatico li tratterà come notizie.
- **Versioni ritirate o sostituite.** I preprint vengono ritirati o corretti. Conviene citare l'identificativo con la versione esplicita (es. `vN`) e prevedere un aggiornamento se il lavoro viene ritirato.
- **Fonti secondarie gonfiate.** Blog, comunicati stampa e social amplificano i risultati. Il piano preferisce le fonti primarie, ma non dice cosa fare quando c'è solo una fonte secondaria.
- **Pressione del "quotidiano".** Il nome promette un post al giorno, il piano dice giustamente il contrario (`PIANO.md:21`). O il nome cambia, o la pagina Metodo e la home rendono normali i giorni senza post. Va deciso se un giorno vuoto produce un post "nessuna novità rilevante" o semplicemente niente.
- **Trasparenza sull'AI.** Oltre alla pagina Metodo, ogni articolo dovrebbe dichiarare il ruolo dell'AI e il livello di revisione umana effettivamente svolto. Nota non giuridica: il Regolamento UE sull'AI prevede obblighi di trasparenza per testi generati da AI pubblicati per informare il pubblico, con un'esenzione legata alla revisione umana e alla responsabilità editoriale. Applicabilità e date effettive vanno verificate su fonte giuridica prima della Fase 3, perché incidono sulla decisione 5 ("revisione o automatismo").
- **Dati personali nei briefing ChatGPT.** Il piano lo cita per la ripubblicazione (`PIANO.md:80`), ma vale anche per l'importazione: i testi grezzi non devono finire nella cartella servita, nemmeno come bozze.

**Automazione locale**
- **WSL non è un server.** La VM WSL2 si spegne dopo un periodo di inattività senza terminali aperti, e il PC va in sospensione. Un cron dentro WSL è inaffidabile. Più solido: l'Utilità di pianificazione di Windows che lancia `wsl.exe`, con recupero all'avvio. Da decidere in Fase 4, non ora.
- **Orologio di WSL fuori sincrono dopo la sospensione.** È un problema noto e potrebbe generare date editoriali sbagliate. Il processo deve controllare l'ora prima di assegnare date.
- **Recupero dei giorni persi.** Dopo tre giorni di PC spento, il processo non deve pubblicare tre briefing in silenzio con date retroattive. Serve una regola esplicita, per esempio un solo briefing con periodo coperto più ampio, dichiarato.
- **Prompt injection dalle fonti.** Pagine web, abstract e PDF letti da un modello possono contenere istruzioni. Il processo deve trattarli come dati non attendibili: l'output va solo nella cartella delle bozze, nessun comando eseguito a partire dall'output del modello, nessun accesso a credenziali dal contesto del modello.
- **Credenziali su `/mnt/c`.** Su drvfs i permessi Unix sono poco significativi e i file sono leggibili dai processi Windows. I segreti vanno nella home WSL con permessi 600, fuori dal progetto e fuori da ogni sincronizzazione. Va anche controllato se la cartella Desktop è sincronizzata o ha un backup cloud attivo: io non ho modo di verificarlo.
- **Costi senza limite.** Cicli di ritentativi su un'API a consumo vanno limitati con un tetto per esecuzione e uno per mese.
- **Tracciabilità.** Per ogni esecuzione: log, raccolta grezza, fonti consultate e testo prodotto, conservati fuori dal sito. Senza questi dati non si possono valutare la precisione (Fase 3) né spiegare una correzione.
- **Modifiche concorrenti.** L'utente che modifica un file da Windows mentre gira il processo. Il lock previsto (`PIANO.md:120`) deve coprire anche la build, non solo la raccolta.

---

## 6. Decisioni

**Necessarie prima di scrivere codice:**
1. **Direzione grafica.** Anche solo "struttura B, tipografia A", con la palette da rifinire dopo.
2. **Conferma di Eleventy.**
3. **Node: versione e modo di installazione.** È un'installazione e richiede il tuo consenso esplicito.
4. **`git init` locale, senza remote.**
5. **Struttura degli URL.** Per esempio `/briefing/2026-10-31/` oppure `/2026/10/31/slug/`, con slash finale. È la decisione più costosa da cambiare dopo.
6. **Unità di pubblicazione.** Briefing giornaliero con risultati come sottosezioni, ciascuno con stato, argomenti e fonte propri, oppure post per singolo risultato. Determina il modello dati.
7. **Delimitatori delle formule.** Basta approvare la regola. Il motore di resa si sceglie nel task 4.
8. **Prima versione dei vocabolari** (stati scientifici e argomenti), anche provvisoria. Serve prima del task 6, non del task 1.

**Rinviabili:**
- Nome definitivo: un segnaposto in un unico punto della configurazione basta.
- Font dedicati, modalità scura, foglio di stile per la stampa.
- RSS e `baseUrl` definitivo, hosting (Vercel o altro).
- Testo definitivo della pagina Metodo: serve in Fase 2.
- Revisione umana o pubblicazione automatica: da decidere prima della Fase 3, insieme alla verifica degli obblighi di trasparenza.
- Modello, API, costi, scheduler, fonti per la raccolta: Fasi 3–4.
- Comportamento nei giorni vuoti: prima della Fase 3, ma conviene orientarsi presto perché incide sul nome.
