# Correzione richiesta da Codex dopo verifica indipendente

Ho eseguito npm run db:verify in WSL nel terminale ordinario, non dentro il tuo ambiente CLI.
Fallisce prima delle prove API: JSON.parse(result.stdout) in scripts/verify-db.ts:26 riceve una tabella Unicode.
Il comando privilegiato supabase db query --local non richiede esplicitamente output JSON.
Correggi questa dipendenza dall'ambiente. Usa l'opzione documentata --output-format json, verifica la forma della risposta
senza stampare dati sensibili, e rivedi altri parser CLI che assumano JSON senza richiederlo.

Esegui il comando in un ambiente normale (rimuovi CLAUDECODE/CLAUDE_CODE e variabili di formato CLI se influenti),
riporta gli esiti veri di db:verify e completa una build con Supabase come sorgente (non fixture).
Non modificare la grafica o lo schema; nessun commit o push. Aggiorna REPORT_02_CLAUDE.md con la correzione.
Nessun altro agente. Il server statico di Codex è sul 4321: non fermarlo.
