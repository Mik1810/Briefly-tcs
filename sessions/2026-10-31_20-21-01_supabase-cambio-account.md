# Sessione: Supabase, nuovo account

- Apertura: 2026-10-31T20:21:01+01:00.
- Richiesta: utente riferisce login con altro account e nuova organizzazione appena creata.
- Autore: Codex; HEAD iniziale f181721.
- Letti istruzioni, checkpoint e ultimo registro.

## Verificato

- Nuove chiamate list_organizations/list_projects del connettore restituiscono ancora solo Mik1810 e i due progetti preesistenti. Il nuovo account non è ancora visibile al connettore di questa sessione.
- Nessuna creazione progetto o modifica a organizzazioni/dati/permessi. Nessuna chiave letta, nessun costo o deployment.
- Strumenti Plugin Management disponibili non offrono cambio account/reautenticazione mirata. Non usare uninstall_app per cambiare account senza esplicita richiesta.

## Ripresa

Chiedere all'utente di ricollegare il plugin Supabase al nuovo account e indicare il nome dell'organizzazione. Poi ripetere inventario, scegliere organizzazione e verificare costi prima di creare Briefly-tcs. Non usare Mik1810 senza nuova indicazione. Nessun codice/test applicativo o servizio modificato; registri versionati localmente.
