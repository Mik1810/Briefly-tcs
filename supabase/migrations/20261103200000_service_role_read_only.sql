-- service_role (chiave secret del publisher) in sola lettura sulle tabelle editoriali.
--
-- Nel progetto cloud service_role aveva tutti i privilegi sulle sei tabelle (grant predefiniti di Supabase):
-- con la chiave secret si poteva scrivere via REST aggirando publish_briefing (atomicità, stato imposto, niente
-- demo). Il publisher scrive solo tramite publish_briefing, SECURITY DEFINER di proprietà di postgres, quindi
-- a service_role bastano SELECT (idempotenza, vocabolario) ed EXECUTE sulla funzione, invariato.
-- Nello stack locale service_role non aveva INSERT/UPDATE/DELETE: la revoca è innocua anche lì.
-- La dashboard Supabase usa il ruolo postgres e non è toccata.

revoke insert, update, delete, truncate on
  public.topics, public.briefings, public.results, public.result_topics, public.sources, public.corrections
  from service_role;
