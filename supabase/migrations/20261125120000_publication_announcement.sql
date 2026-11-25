-- Nuovo stato di pubblicazione "annuncio": risultato annunciato pubblicamente (blog di un laboratorio,
-- comunicato, talk) senza ancora un paper disponibile. Deciso il 2026-11-25 (sessione
-- 2026-11-01_13-54-23_claude-publisher-pipeline): annunci come omega = 9/4 o la GRH non venivano pubblicati.

alter table public.results drop constraint if exists results_publication_check;

alter table public.results
  add constraint results_publication_check
  check (publication in ('risultato-classico', 'annuncio', 'preprint', 'accettato', 'pubblicato'));
