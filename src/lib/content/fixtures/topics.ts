import type { Topic } from '../types.ts';

// Vocabolario iniziale ridotto, proposto in docs/PIANO.md. Modificabile prima dello schema Supabase.
export const topics: Topic[] = [
  {
    slug: 'complessita',
    name: 'Complessità computazionale',
    description: 'Limiti inferiori, classi di complessità e modelli di calcolo.',
  },
  {
    slug: 'algoritmi',
    name: 'Algoritmi',
    description: 'Progetto e analisi di algoritmi e strutture dati.',
  },
  {
    slug: 'grafi',
    name: 'Grafi',
    description: 'Algoritmi e proprietà strutturali dei grafi.',
  },
  {
    slug: 'combinatoria',
    name: 'Combinatoria',
    description: 'Enumerazione, strutture discrete e metodi combinatori.',
  },
  {
    slug: 'logica',
    name: 'Logica',
    description: 'Logica in informatica, semantica e verifica formale.',
  },
];
