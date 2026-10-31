# TCS quotidiano

Blog italiano di informatica teorica per studenti magistrali e ricercatori. Nome provvisorio.
Stato: **prototipo locale navigabile**, con contenuti dimostrativi. Nessun deployment, nessun remote Git.

## Limite attuale sul database

I dati mostrati provengono da **fixture TypeScript dimostrative** (`src/lib/content/fixtures/`).
**Supabase è il database previsto ma non è installato, avviato né collegato.**
Non esiste ancora un'integrazione con un database funzionante.

La sorgente è scelta in un solo punto (`src/lib/content/config.ts`). Impostare `'supabase'` oggi interrompe la build.
Quando l'integrazione esisterà, un database non disponibile dovrà far fallire la build: **nessun ripiego silenzioso sulle fixture**.

## Comandi

Richiede Node v24.18.0, già presente in WSL tramite nvm (`.nvmrc`). Eseguire da WSL nella cartella del progetto.

```sh
npm ci           # installa le dipendenze esatte del lockfile
npm run dev      # server di sviluppo locale (http://localhost:4321)
npm run check    # astro check (TypeScript) + test di Node su date, metadati, bozze e formule
npm run build    # genera dist/ e poi esegue scripts/check-dist.ts sull'output
npm run preview  # serve dist/ in locale
```

Gli script disattivano la telemetria di Astro (`ASTRO_TELEMETRY_DISABLED=1`).
La build non usa la rete né modelli AI: è stata verificata anche in un namespace senza rete.
Il progetto sta su `/mnt/c`: installazione e build sono più lente che nella home Linux, e il watch di `npm run dev`
potrebbe non accorgersi di file salvati da editor Windows. In quel caso riavviare il server.

## Architettura

- **Astro statico** con **componenti React** renderizzati in HTML durante la build. Nessuna direttiva `client:*`:
  le pagine non includono JavaScript. CSS scritto a mano in `src/styles/global.css`, font di sistema.
- **Formule**: Markdown con `$…$` e `$$…$$`, convertito in build con unified + remark-math + rehype-katex
  (`src/lib/markdown.ts`). CSS e font di KaTeX serviti localmente, solo nelle pagine articolo.
  Una formula non valida interrompe la build.
- **Contenuti**: modello in `src/lib/content/types.ts`; tutto passa da `src/lib/content/repository.ts`,
  che sceglie la sorgente, valida i dati (`validate.ts`) ed esclude le bozze prima che le pagine li vedano.
- **URL**: `/`, `/briefing/YYYY-MM-DD/` (un briefing al giorno, con ancore `#risultato-<id>`),
  `/archivio/`, `/argomenti/`, `/argomenti/<slug>/`, `/metodo/`.
- Le date editoriali sono stringhe `YYYY-MM-DD`, mai convertite con un fuso orario.

## Controlli

- `tests/` (test runner di Node, nessuna dipendenza): date di calendario, regole dei metadati, esclusione delle bozze,
  errori di formula e HTML grezzo.
- `scripts/check-dist.ts`, dopo ogni build: nessuna traccia delle bozze in `dist/`, pagine per argomento solo con
  risultati pubblicati, date e ancore presenti, etichetta "Contenuto dimostrativo", link interni e ancore validi,
  nessun `<script>` né risorsa remota. Stampa le misure di HTML, CSS, font e JS.

## Documenti

- [Decisioni aggiornate e stato reale, prevalenti](docs/DECISIONI.md)
- [Piano iniziale e fasi](docs/PIANO.md)
- [Proposte grafiche](docs/design/PROPOSTE.md) · [Tavola di confronto](docs/design/CONFRONTO.png)
- [Incarico 01](docs/coordination/IMPLEMENTAZIONE_01.md) · [Report 01 di Claude](docs/coordination/REPORT_01_CLAUDE.md)
- [Incarico a Claude e aggiornamenti](docs/coordination/BRIEF_CLAUDE.md)
- [Prima revisione di Claude](docs/coordination/CLAUDE_REVIEW.md) · [Sintesi](docs/coordination/SINTESI.md)

I testi dimostrativi non sono notizie di ricerca reali: descrivono risultati classici da manuale.
Tavola generata con ImageGen; prompt in docs/design/PROMPT_IMMAGINE.txt.
