import type { RawContent } from './types.ts';

/**
 * Confine tra il sito e l'origine dei contenuti. Le pagine non sanno da dove arrivano i dati.
 *
 * Oggi esiste soltanto la sorgente `fixture` (dati dimostrativi in memoria).
 * `supabase` è la sorgente prevista ma NON implementata: selezionarla interrompe la build.
 * Non deve mai esistere un ripiego automatico da database a fixture.
 */
export type ContentSourceKind = 'fixture' | 'supabase';

export interface ContentSource {
  readonly kind: ContentSourceKind;
  /** Descrizione mostrata nel piè di pagina e nel log della build. */
  readonly description: string;
  load(): Promise<RawContent>;
}
