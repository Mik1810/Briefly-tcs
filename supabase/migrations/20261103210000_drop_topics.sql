-- Argomenti eliminati (decisione del proprietario, 2026-11-03): né il generatore né il sito li usano più.
-- Prima si aggiorna publish_briefing, che altrimenti fallirebbe all'esecuzione cercando result_topics; poi si
-- eliminano le tabelle (con policy, grant e indice result_topics_topic_slug_idx).
-- Firma, proprietario, SECURITY DEFINER, search_path e grant della funzione restano invariati.

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

drop table public.result_topics;
drop table public.topics;
