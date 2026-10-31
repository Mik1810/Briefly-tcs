# Tre direzioni grafiche

Stato: direzione A scelta dall’utente; B e C conservate come alternative esplorate. Nome provvisorio: TCS quotidiano.
La tavola raster è un riferimento visivo, non una specifica pixel per pixel o un sito funzionante.
Testi della tavola solo dimostrativi; la specifica testuale guida l'implementazione futura.

## A — Rivista

Personalità: una piccola rivista scientifica, sobria e contemporanea.
Sfondo avorio #F7F5F0, testo #20201E, accento bordeaux #7A263A.
Testata e titoli serif; navigazione e metadati sans serif.
Un articolo principale in apertura, seguito da una lista di articoli separati da righe sottili.
Niente copertine obbligatorie: la gerarchia nasce da tipografia e spaziatura.
Pagina articolo centrata, colonna di lettura circa 68 caratteri, sommario breve e fonti finali.
Mobile: una colonna, navigazione visibile che va a capo, nessun menu a scomparsa necessario.
Punto forte: identità editoriale e lettura lunga.
Compromesso: meno notizie visibili nella prima schermata rispetto a B.

## B — Bollettino

Personalità: aggiornamento quotidiano rapido, consultabile come un indice accademico.
Sfondo #FFFFFF, testo #20262E, collegamenti blu #245B8A.
Tipografia sans serif di sistema; date allineate e titoli compatti.
Home con ultimo briefing compatto e lista cronologica: data, titolo, argomento, descrizione breve.
Pagina articolo: titoli di sezione chiari e navigazione verso briefing precedente/successivo.
Mobile: date sopra ai titoli, righe più ariose, nessuna tabella larga.
Punto forte: massima velocità di consultazione e semplicità implementativa.
Compromesso: carattere visivo più impersonale.

## C — Quaderno

Personalità: appunti curati di un ricercatore, con maggiore attenzione alle formule.
Sfondo #F5F6F2, testo #202822, accento verde #315D48.
Testo di lettura serif, date e piccoli riferimenti monospace.
Home: margine laterale con data e argomento; corpo principale con titolo e sintesi.
Pagina articolo: margine per indice o riferimenti solo quando lo spazio lo consente.
Mobile: metadati e indice rientrano nel flusso prima del testo; nessuna colonna laterale fissa.
Punto forte: adatto ad approfondimenti e ragionamenti tecnici.
Compromesso: margini e formule richiedono una verifica mobile più attenta.

## Raccomandazione di Codex

A per la voce editoriale, con l'archivio compatto di B.
La home deve comunicare subito di cosa parla il blog e cosa è uscito di recente.
C resta valida se il progetto vira verso note tecniche lunghe più che notiziario.
Questa preferenza non equivale a una scelta approvata.

## Regole comuni

- Corpo articolo inizialmente circa 18 px e interlinea circa 1,65, da verificare con testi reali.
- Larghezza di lettura circa 65–72 caratteri; struttura esterna circa 1080 px su desktop.
- Contrasto AA, focus tastiera visibile e link riconoscibili senza affidarsi solo al colore.
- Nessuna animazione decorativa, gradiente, carosello o griglia di schede gonfie.
- Categorie e stato scientifico come etichette testuali sobrie; non assegnare un colore a ogni argomento.
- Font di sistema nel primo prototipo; font dedicati solo se il vantaggio visivo giustifica il peso.
- Niente immagini AI decorative per ogni articolo.
- Modalità scura e ricerca rinviate: non servono per scegliere la direzione iniziale.
- Nome, palette e dettagli modificabili prima dell'implementazione.

## Contenuti utili per giudicare il prototipo

Una home con almeno tre voci; un articolo breve; un articolo lungo con formule, link e aggiornamento.
Nessuna notizia inventata presentata come reale. Per i primi bozzetti usare esempi dichiarati.
Valutare home e pagina articolo, non solo la testata.
