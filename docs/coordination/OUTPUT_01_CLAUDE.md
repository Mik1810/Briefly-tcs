Il prototipo locale è completo e navigabile. `npm run check` e `npm run build` passano in WSL. Non ho fatto nessuna verifica in browser né avviato server: la parte visiva (360/768/1440 px, zoom, tastiera) resta alla QA di Codex.

**Cosa c'è**
- **Stack:** Astro 7.4.4 statico con 14 componenti React renderizzati in build, CSS scritto a mano e font di sistema. Le pagine non contengono nessun `<script>` né risorse remote.
- **Pagine:** home in stile A (ultimo briefing in evidenza, righe sotto), pagina briefing, archivio per anno, argomenti, singolo argomento, Metodo e 404.
- **Briefing (`/briefing/YYYY-MM-DD/`):** formule KaTeX generate in build con risorse locali, metadati, stato scientifico, fonti per ogni risultato e correzioni. Ogni risultato ha il suo link `#risultato-<id>`. Una formula sbagliata interrompe la build.
- **Contenuti demo:** tre briefing con l'etichetta "Contenuto dimostrativo", tutti su risultati classici da manuale (O(n log n), n², Dijkstra, Karatsuba, Catalan). Quello del 29 ottobre è lungo, con formule e due correzioni. C'è anche una bozza di controllo con un argomento usato solo da lei.
- **Dati:** sono fixture dietro una piccola interfaccia, scelta in `src/lib/content/config.ts`. Il valore `'supabase'` oggi fa fallire la build, senza ripiego sulle fixture. README, piè di pagina, Metodo e `docs/DECISIONI.md` dicono chiaramente che il DB non è collegato.

**Verifiche eseguite davvero**
- `astro check`: 0 errori. Passano 20 test con il test runner integrato di Node, nessuna dipendenza in più. Coprono date di calendario, regole sui metadati, esclusione delle bozze, errori nelle formule e HTML grezzo.
- `scripts/check-dist.ts` gira dopo ogni build e controlla:
  - nessuna traccia della bozza in `dist/`;
  - nessuna pagina per argomenti senza risultati pubblicati;
  - date e link ai risultati presenti;
  - link interni validi;
  - nessuno script né risorsa remota.
- Ho provato che i controlli funzionano rompendo apposta il codice e poi ripristinandolo: disattivando il filtro bozze falliscono 2 test; inserendo 6 problemi in `dist/`, `check-dist` li segnala tutti.
- Due build consecutive danno file identici. La build riesce anche senza rete.

**Misure**
- **Home:** HTML 3,9 kB e CSS 8,2 kB (1,4 e 2,2 kB compressi).
- **Articolo lungo:** HTML 59,7 kB e CSS 37,3 kB, di cui 29,8 kB sono il CSS di KaTeX.
- **Font KaTeX:** 250 kB in formato woff2.

**Limiti**
- Astro copia comunque in `dist/` il runtime React (`client.js`, 216 kB), perché lo aggiunge per ogni integrazione registrata. Nessuna pagina lo collega, quindi il browser non lo scarica. L'ho lasciato invece di rimuoverlo con un aggiramento.
- Se una build fallisce, `dist/` non viene sostituita in modo sicuro e può restare a metà.
- Le formule larghe scorrono dentro il loro blocco, ma il blocco non riceve il focus da tastiera.
- Non ho fatto RSS né gli approfondimenti come tipo di contenuto separato.

**Una cosa fuori dall'incarico:** mentre lavoravo sono comparsi `IMPLEMENTAZIONE_02_SUPABASE.md` e `VERIFICA_PROTOTIPO.md`. Non ho toccato l'incarico Supabase. Ho però applicato la nota di revisione che conteneva, perché riguardava un difetto del mio codice: ora correzioni e aggiornamenti nello stesso giorno della pubblicazione sono accettati, con un test dedicato.

Nessun commit fatto, `.git/config` non toccato. Il report con file chiave, comandi e misure è in `docs/coordination/REPORT_01_CLAUDE.md`.
