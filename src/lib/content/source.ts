import type { RawContent } from './types.ts';

/**
 * Confine tra il sito e l'origine dei contenuti. Le pagine non sanno da dove arrivano i dati.
 *
 * `supabase`: database letto via REST durante la build (src/lib/content/supabase/source.ts), stack locale
 *   o progetto cloud secondo TCS_SUPABASE_TARGET (src/lib/content/supabase/config.ts).
 * `fixture`: dati dimostrativi in memoria, solo se richiesti esplicitamente (demo e test offline).
 * Non deve mai esistere un ripiego automatico da database a fixture.
 */
export type ContentSourceKind = 'fixture' | 'supabase';

export interface ContentSource {
  readonly kind: ContentSourceKind;
  /** Descrizione pubblica (inglese) mostrata nel piè di pagina, in Metodo e nel log della build. */
  readonly description: string;
  /** Etichetta per i soli log (target e host, mai chiavi); non compare nelle pagine. */
  readonly logLabel: string;
  load(): Promise<RawContent>;
}
