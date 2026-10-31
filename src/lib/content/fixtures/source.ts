import type { ContentSource } from '../source.ts';
import { briefings } from './briefings.ts';
import { topics } from './topics.ts';

/** Dati dimostrativi in memoria. Non è un'integrazione con un database. */
export const fixtureSource: ContentSource = {
  kind: 'fixture',
  description: 'local demo fixtures (explicit offline mode, no database)',
  load: async () => ({ topics, briefings }),
};
