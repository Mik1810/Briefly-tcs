import type { ContentSourceKind } from './source.ts';

/**
 * Sorgente dei contenuti usata dalla build. Scelta esplicita in un solo punto.
 * Passare a 'supabase' oggi fa fallire la build: l'integrazione non esiste ancora.
 */
export const CONTENT_SOURCE: ContentSourceKind = 'fixture';
