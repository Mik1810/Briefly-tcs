import type { Topic } from '../types.ts';

// Vocabolario iniziale ridotto, proposto in docs/PIANO.md. Slug invariati; nomi e descrizioni in inglese.
export const topics: Topic[] = [
  {
    slug: 'complessita',
    name: 'Computational complexity',
    description: 'Lower bounds, complexity classes, and models of computation.',
  },
  {
    slug: 'algoritmi',
    name: 'Algorithms',
    description: 'Design and analysis of algorithms and data structures.',
  },
  {
    slug: 'grafi',
    name: 'Graphs',
    description: 'Graph algorithms and structural properties of graphs.',
  },
  {
    slug: 'combinatoria',
    name: 'Combinatorics',
    description: 'Enumeration, discrete structures, and combinatorial methods.',
  },
  {
    slug: 'logica',
    name: 'Logic',
    description: 'Logic in computer science, semantics, and formal verification.',
  },
];
