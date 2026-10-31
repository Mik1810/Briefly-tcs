import type { ContentSourceKind } from './source.ts';

/**
 * Sorgente dei contenuti, scelta esplicitamente con TCS_CONTENT_SOURCE dagli script npm:
 * `npm run build` usa 'supabase'; `npm run build:fixture` usa 'fixture' per demo e test offline.
 * Nessun valore predefinito: senza variabile la build si interrompe, così non si passa mai
 * alle fixture per caso.
 */
export function contentSourceKind(): ContentSourceKind {
  const value = process.env.TCS_CONTENT_SOURCE;
  if (value === 'supabase' || value === 'fixture') return value;
  throw new Error(
    `TCS_CONTENT_SOURCE deve valere "supabase" o "fixture" (valore attuale: ${JSON.stringify(value)}). ` +
      'Usare gli script npm, che la impostano esplicitamente.',
  );
}
