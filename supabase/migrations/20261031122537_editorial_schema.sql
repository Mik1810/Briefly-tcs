-- Schema editoriale di TCS quotidiano.
--
-- Scelta relazionale (sei tabelle piccole) invece di un unico JSON per briefing:
-- - vincoli nel database su ciò che conta per la pubblicazione: un briefing per data, slug validi,
--   argomenti da vocabolario (chiave esterna), correzioni legate a un risultato dello stesso briefing;
-- - RLS per riga: il ruolo anon legge solo i briefing pubblicati e ciò che ne dipende;
-- - risultati, argomenti e fonti saranno interrogati e deduplicati singolarmente dal futuro flusso editoriale.
-- La validazione completa resta anche in src/lib/content/validate.ts, eseguita a ogni build.
--
-- Accesso: auto_expose_new_tables = false in config.toml, quindi nessun ruolo API ha privilegi
-- se non concessi qui. anon riceve solo SELECT; nessuna scrittura per anon o authenticated.

create table public.topics (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (btrim(name) <> '' and strpos(name, '$') = 0),
  description text not null check (btrim(description) <> '' and strpos(description, '$') = 0),
  position smallint not null unique
);

create table public.briefings (
  -- Un briefing al giorno: la data editoriale è la chiave e lo slug dell'URL.
  date date primary key,
  status text not null check (status in ('bozza', 'pubblicato')),
  demo boolean not null,
  title text not null check (btrim(title) <> '' and strpos(title, '$') = 0),
  summary text not null check (btrim(summary) <> '' and strpos(summary, '$') = 0),
  coverage_from date not null,
  coverage_to date not null,
  updated_on date,
  intro text check (intro is null or btrim(intro) <> ''),
  ai_disclosure text not null check (btrim(ai_disclosure) <> ''),
  check (coverage_from <= coverage_to),
  check (coverage_to <= date),
  check (updated_on is null or updated_on >= date)
);

create table public.results (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  briefing_date date not null references public.briefings (date) on delete cascade,
  position smallint not null,
  title text not null check (btrim(title) <> '' and strpos(title, '$') = 0),
  summary text not null check (btrim(summary) <> '' and strpos(summary, '$') = 0),
  body text not null check (btrim(body) <> ''),
  publication text not null check (publication in ('risultato-classico', 'preprint', 'accettato', 'pubblicato')),
  formalization text not null check (formalization in ('non-indicata', 'formalizzato')),
  verification text not null check (
    verification in ('non-verificato', 'controllo-automatico', 'revisione-redazionale', 'revisione-indipendente')
  ),
  unique (briefing_date, position),
  -- Destinazione della chiave esterna composta delle correzioni.
  unique (id, briefing_date)
);

create table public.result_topics (
  result_id text not null references public.results (id) on delete cascade,
  topic_slug text not null references public.topics (slug),
  position smallint not null,
  primary key (result_id, topic_slug),
  unique (result_id, position)
);

create index result_topics_topic_slug_idx on public.result_topics (topic_slug);

create table public.sources (
  id bigint generated always as identity primary key,
  result_id text not null references public.results (id) on delete cascade,
  position smallint not null,
  title text not null check (btrim(title) <> ''),
  authors text[] not null default '{}',
  year integer check (year is null or year > 0),
  venue text check (venue is null or btrim(venue) <> ''),
  url text check (url is null or url ~ '^https://'),
  kind text not null check (kind in ('libro', 'articolo', 'preprint', 'pagina-web')),
  lang text check (lang is null or lang ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  unique (result_id, position)
);

create table public.corrections (
  id bigint generated always as identity primary key,
  briefing_date date not null references public.briefings (date) on delete cascade,
  position smallint not null,
  date date not null,
  kind text not null check (kind in ('sostanziale', 'minore')),
  text text not null check (btrim(text) <> ''),
  result_id text,
  unique (briefing_date, position),
  -- Una correzione può riferirsi solo a un risultato dello stesso briefing.
  foreign key (result_id, briefing_date) references public.results (id, briefing_date) on delete cascade
);

create index corrections_result_idx on public.corrections (result_id, briefing_date);

-- Privilegi: solo lettura per anon. Nessun privilegio per authenticated (Auth è disattivato).
revoke all on public.topics, public.briefings, public.results, public.result_topics, public.sources, public.corrections
  from anon, authenticated;
grant select on public.topics, public.briefings, public.results, public.result_topics, public.sources, public.corrections
  to anon;

-- RLS su tutte le tabelle esposte. Nessuna policy di scrittura: inserimenti e modifiche anonime sono negati.
alter table public.topics enable row level security;
alter table public.briefings enable row level security;
alter table public.results enable row level security;
alter table public.result_topics enable row level security;
alter table public.sources enable row level security;
alter table public.corrections enable row level security;

-- Il vocabolario degli argomenti è pubblico; il sito mostra solo quelli con risultati pubblicati.
create policy "anon legge gli argomenti" on public.topics
  for select to anon
  using (true);

create policy "anon legge i briefing pubblicati" on public.briefings
  for select to anon
  using (status = 'pubblicato');

create policy "anon legge i risultati dei briefing pubblicati" on public.results
  for select to anon
  using (exists (
    select 1 from public.briefings b
    where b.date = results.briefing_date and b.status = 'pubblicato'
  ));

create policy "anon legge gli argomenti dei risultati pubblicati" on public.result_topics
  for select to anon
  using (exists (
    select 1 from public.results r
    join public.briefings b on b.date = r.briefing_date
    where r.id = result_topics.result_id and b.status = 'pubblicato'
  ));

create policy "anon legge le fonti dei risultati pubblicati" on public.sources
  for select to anon
  using (exists (
    select 1 from public.results r
    join public.briefings b on b.date = r.briefing_date
    where r.id = sources.result_id and b.status = 'pubblicato'
  ));

create policy "anon legge le correzioni dei briefing pubblicati" on public.corrections
  for select to anon
  using (exists (
    select 1 from public.briefings b
    where b.date = corrections.briefing_date and b.status = 'pubblicato'
  ));
