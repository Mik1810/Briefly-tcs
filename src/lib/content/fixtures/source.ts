import type { ContentSource } from '../source.ts';
import { briefings } from './briefings.ts';

/** Dati dimostrativi in memoria. Non è un'integrazione con un database. */
export const fixtureSource: ContentSource = {
  kind: 'fixture',
  description: 'local demo fixtures (explicit offline mode, no database)',
  logLabel: 'fixture',
  load: async () => ({ briefings }),
};
