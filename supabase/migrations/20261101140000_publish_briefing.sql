-- Pubblicazione atomica di un briefing generato automaticamente (publisher GitHub Actions).
--
-- Una sola chiamata RPC inserisce briefing, risultati, argomenti e fonti nella stessa transazione:
-- un errore qualsiasi (vincolo, argomento fuori vocabolario, id duplicato) annulla tutto, senza dati parziali.
-- Stato e demo sono imposti qui (sempre 'pubblicato', mai demo), non dal chiamante.
-- Idempotenza: se la data esiste già non scrive nulla e restituisce 'exists'; il publisher confronta poi il contenuto.
--
-- Accesso: SECURITY DEFINER con search_path vuoto; EXECUTE solo a service_role (chiave secret del publisher,
-- conservata come secret di GitHub Actions). anon e authenticated non possono chiamarla: la RLS pubblica
-- resta di sola lettura.

create function public.publish_briefing(post jsonb)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  briefing_date date := (post ->> 'date')::date;
  result_row record;
begin
  if exists (select 1 from public.briefings where date = briefing_date) then
    return 'exists';
  end if;

  insert into public.briefings (date, status, demo, title, summary, coverage_from, coverage_to, intro, ai_disclosure)
  values (
    briefing_date,
    'pubblicato',
    false,
    post ->> 'title',
    post ->> 'summary',
    (post -> 'coverage' ->> 'from')::date,
    (post -> 'coverage' ->> 'to')::date,
    post ->> 'intro',
    post ->> 'aiDisclosure'
  );

  for result_row in
    select r.value as result, r.ordinality::smallint as position
    from jsonb_array_elements(post -> 'results') with ordinality as r
  loop
    insert into public.results (id, briefing_date, position, title, summary, body, publication, formalization, verification)
    values (
      result_row.result ->> 'id',
      briefing_date,
      result_row.position,
      result_row.result ->> 'title',
      result_row.result ->> 'summary',
      result_row.result ->> 'body',
      result_row.result -> 'status' ->> 'publication',
      result_row.result -> 'status' ->> 'formalization',
      result_row.result -> 'status' ->> 'verification'
    );

    insert into public.result_topics (result_id, topic_slug, position)
    select result_row.result ->> 'id', t.value, t.ordinality::smallint
    from jsonb_array_elements_text(result_row.result -> 'topics') with ordinality as t;

    insert into public.sources (result_id, position, title, authors, year, venue, url, kind, lang)
    select
      result_row.result ->> 'id',
      s.ordinality::smallint,
      s.value ->> 'title',
      array(select jsonb_array_elements_text(s.value -> 'authors')),
      (s.value ->> 'year')::integer,
      s.value ->> 'venue',
      s.value ->> 'url',
      s.value ->> 'kind',
      s.value ->> 'lang'
    from jsonb_array_elements(result_row.result -> 'sources') with ordinality as s;
  end loop;

  return 'published';
end;
$$;

revoke execute on function public.publish_briefing(jsonb) from public, anon, authenticated;
grant execute on function public.publish_briefing(jsonb) to service_role;

-- Il publisher legge vocabolario, id esistenti e briefing già pubblicati per l'idempotenza.
-- Con auto_expose_new_tables = false service_role non ha privilegi sulle tabelle: solo SELECT, nessuna scrittura
-- diretta. Ogni scrittura passa dalla funzione sopra.
grant select on public.topics, public.briefings, public.results, public.result_topics, public.sources, public.corrections
  to service_role;
