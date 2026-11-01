# Incarico 07: sito collegabile a Supabase cloud

Lavorare WSL, leggere AGENTS/CLAUDE/checkpoint/decisioni. Codice a Claude, review Codex. Registro proprio sessions, report REPORT_07_CLAUDE.md. Partenza b85d0b3; preservare registro coordinatore non committato.

## Obiettivo

Il sito Astro statico deve poter leggere durante build/dev il progetto Supabase cloud già creato, senza perdere il locale e senza nuove dipendenze. Schema cloud vuoto (sei tabelle RLS); nessun seed demo da importare.

## Requisiti

- readSupabaseConfig/source oggi rifiuta host non-locali. Introdurre selezione esplicita target local/cloud (default locale per compatibilità); modalità cloud HTTPS su dominio progetto *.supabase.co, senza username/password/path/query/fragment/porta non standard. Vietare host arbitrari/http cloud. Locale solo loopback.
- Configurazione cloud privata .env.cloud ignorata Git, .env locale non modificata. URL e chiave forniti via env già impostate per futura Vercel; precedenza documentata, nessun fallback cloud verso .env locale o fixture. Il target deve distinguersi nei log senza stampare chiavi.
- Usare solo chiave publishable/anon soggetta RLS, mai secret/service_role. Valutare validazione minima per rifiutare chiavi privilegiate (inclusi legacy JWT service_role) senza stampare contenuti in errori. Non leggere .env reali né altre credenziali.
- Comandi npm semplici build:cloud/dev:cloud e .env.example/documentazione aggiornati, niente config Vercel di hosting ancora necessaria. Non hardcodare dati account/chiavi.
- DB vuoto è valido: build genera home/archivio/argomenti/metodo in inglese già con empty states; nessuna demo o auto-insert. Conservare design A e zero JS pubblico. Non toccare componenti se non serve.
- Test mirati a selezione/configurazione, URL e precedenza, rifiuto chiavi privilegiate, eventuale errore rete che non perde build precedente. Eseguire npm run check e build fixture (contenuti non toccati); se si può verificare il cloud senza chiavi non inventare. Codex proverà chiave e build cloud separatamente.
- Prima di build fixture salvare dist attuale in .local/preview-before-cloud (solo copia, no restore/reset dati). Non modificare file .env e niente db push/reset/migrazioni. Storia migrazioni cloud ancora da allineare in attività separata.
- Nessun push, deployment, Vercel project, risorsa a pagamento o credenziali. Non creare servizi extra.

Scrivi implementazione, test necessari, report conciso e registro datato. Termina senza commit: coordina Codex. Evita ricerche/test estranei o cluster DB temporanei per questo incarico.
