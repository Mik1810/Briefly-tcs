-- Ripubblicazione di un briefing già pubblicato (decisione dell'utente, 2026-11-26): sostituisce in una sola
-- transazione il briefing di una data con la nuova versione del post, così modifiche come l'aggiunta di
-- risultati si fanno dal workflow GitHub (input republish_date) senza accedere a Supabase.
-- Cancellazione a cascata di risultati e fonti, poi la stessa scrittura di publish_briefing.
-- Eseguibile solo da service_role, come publish_briefing; nessun accesso diretto in scrittura alle tabelle.

create function public.republish_briefing(post jsonb)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  briefing_date date := (post ->> 'date')::date;
begin
  delete from public.briefings where date = briefing_date;
  return public.publish_briefing(post);
end;
$$;

alter function public.republish_briefing(jsonb) owner to postgres;
revoke all on function public.republish_briefing(jsonb) from public, anon, authenticated;
grant execute on function public.republish_briefing(jsonb) to service_role;
