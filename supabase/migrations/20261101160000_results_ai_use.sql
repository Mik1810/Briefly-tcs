-- Uso dell'AI dichiarato dagli autori di ciascun risultato (formato post briefly-post/2).
-- Facoltativo nel database: i risultati già pubblicati e i demo non lo hanno. Il publisher lo rende obbligatorio
-- per i post nuovi. Nessun nuovo privilegio: la colonna eredita i grant e la RLS della tabella results.

alter table public.results
  add column ai_use text check (ai_use is null or (btrim(ai_use) <> '' and strpos(ai_use, '$') = 0));

-- Stessa funzione della migrazione 20261101140000, con ai_use. Firma invariata: i grant esistenti restano validi.
create or replace function public.publish_briefing(post jsonb)
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
    insert into public.results (
      id, briefing_date, position, title, summary, body, publication, formalization, verification, ai_use
    )
    values (
      result_row.result ->> 'id',
      briefing_date,
      result_row.position,
      result_row.result ->> 'title',
      result_row.result ->> 'summary',
      result_row.result ->> 'body',
      result_row.result -> 'status' ->> 'publication',
      result_row.result -> 'status' ->> 'formalization',
      result_row.result -> 'status' ->> 'verification',
      result_row.result ->> 'aiUse'
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
