import type { Briefing, ScientificStatus, Source } from '../types.ts';

// CONTENUTI DIMOSTRATIVI, in inglese (lingua pubblica del sito). Servono solo a giudicare impaginazione,
// formule, correzioni ed esclusione delle bozze. Descrivono risultati classici da manuale: nessuna novità
// di ricerca, nessuna rivendicazione tratta dal briefing originale. ID, slug e date restano invariati.

// String.raw conserva le barre rovesciate del LaTeX. Non scrivere mai il dollaro seguito da graffa aperta.
const md = String.raw;

const DEMO_DISCLOSURE =
  'Demo text drafted with the assistance of an AI model (Claude) while developing the prototype. ' +
  'It describes classic textbook results; it has not gone through the planned editorial process and no scientific ' +
  'review has been carried out.';

const CLASSIC: ScientificStatus = {
  publication: 'risultato-classico',
  formalization: 'non-indicata',
  verification: 'non-verificato',
};

const CLRS: Source = {
  title: 'Introduction to Algorithms',
  authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
  year: 2022,
  venue: 'MIT Press, 4th edition',
  kind: 'libro',
  lang: 'en',
};

const KNUTH_VOL3: Source = {
  title: 'The Art of Computer Programming, Volume 3: Sorting and Searching',
  authors: ['Donald E. Knuth'],
  year: 1998,
  venue: 'Addison-Wesley, 2nd edition',
  kind: 'libro',
  lang: 'en',
};

export const briefings: Briefing[] = [
  {
    date: '2026-10-29',
    status: 'pubblicato',
    demo: true,
    title: 'Comparison sorting: the lower bound and the algorithms that meet it',
    summary:
      'A long example briefing with classic results: the lower bound for comparison sorting, ' +
      'merge sort, and the quadratic worst case of insertion sort.',
    coverage: { from: '2026-10-28', to: '2026-10-28' },
    updatedOn: '2026-10-30',
    intro: md`This briefing shows what a long issue looks like, with inline and display formulas, sources for every result, and a correction. The three results are textbook theorems, chosen because they are easy to check; the [Method page](/metodo/) describes how real news will be handled.`,
    results: [
      {
        id: 'limite-inferiore-ordinamento-confronti',
        title: 'Every comparison sort needs Ω(n log n) comparisons in the worst case',
        summary:
          'The decision-tree argument: n! permutations to tell apart force a tree of height at least log₂ n!.',
        topics: ['complessita', 'algoritmi'],
        status: CLASSIC,
        body: md`An algorithm that accesses the elements only through comparisons $a_i \le a_j$ can be described by a **decision tree**: every internal node is a comparison, every leaf a permutation of the input. To sort every input of $n$ distinct elements correctly, the tree must have at least $n!$ reachable leaves.

A binary tree of height $h$ has at most $2^h$ leaves, so $2^h \ge n!$, that is $h \ge \log_2 n!$. It is enough to bound the factorial from below:

$$
\log_2 n! \;=\; \sum_{k=1}^{n} \log_2 k \;\ge\; \sum_{k=\lceil n/2 \rceil}^{n} \log_2 k \;\ge\; \frac{n}{2}\,\log_2 \frac{n}{2} \;=\; \Omega(n \log n).
$$

Stirling's formula also gives the next terms. It is a good example of a long formula: on narrow screens it scrolls inside its own block without moving the page.

$$
\log_2 n! \;=\; n \log_2 n \;-\; n \log_2 e \;+\; \frac{1}{2}\log_2(2\pi n) \;+\; \frac{\log_2 e}{12\,n} \;-\; \frac{\log_2 e}{360\,n^{3}} \;+\; O\!\left(\frac{1}{n^{5}}\right)
$$

The bound holds **only in the comparison model**. Algorithms that read the keys, such as counting sort on integers in $\{0, \dots, k\}$, run in time $O(n + k)$ and are not subject to this constraint.`,
        sources: [
          KNUTH_VOL3,
          CLRS,
          {
            title: 'Comparison sort',
            authors: ['Wikipedia contributors'],
            kind: 'pagina-web',
            url: 'https://en.wikipedia.org/wiki/Comparison_sort',
            lang: 'en',
          },
        ],
      },
      {
        id: 'merge-sort-ottimo',
        title: 'Merge sort uses O(n log n) comparisons and is therefore optimal among comparison sorts',
        summary: 'The recurrence T(n) = 2T(n/2) + Θ(n) gives Θ(n log n), which matches the lower bound.',
        topics: ['algoritmi'],
        status: CLASSIC,
        body: md`Merge sort splits the input into two halves, sorts them recursively, and merges them in linear time. Its cost satisfies

$$
T(n) = 2\,T\!\left(\frac{n}{2}\right) + \Theta(n), \qquad T(1) = \Theta(1),
$$

which by the master theorem (case $a = b = 2$, $f(n) = \Theta(n)$) gives $T(n) = \Theta(n \log n)$.

For $n$ a power of two, the worst-case number of comparisons is exactly $n \log_2 n - n + 1$. Comparing it with the [lower bound of the previous result](#risultato-limite-inferiore-ordinamento-confronti) gives asymptotic optimality: no comparison sort does better by more than a constant factor.`,
        sources: [
          CLRS,
          {
            title: 'Merge sort',
            authors: ['Wikipedia contributors'],
            kind: 'pagina-web',
            url: 'https://en.wikipedia.org/wiki/Merge_sort',
            lang: 'en',
          },
        ],
      },
      {
        id: 'insertion-sort-quadratico',
        title: 'Insertion sort takes Θ(n²) comparisons in the worst case',
        summary: 'On reverse-sorted input every element moves past all the previous ones: n(n−1)/2 comparisons.',
        topics: ['algoritmi'],
        status: CLASSIC,
        body: md`Insertion sort inserts the $i$-th element into the already sorted prefix, scanning it from the right. On decreasing input the $i$-th element is compared with all $i - 1$ previous ones, for a total of

$$
\sum_{i=2}^{n} (i - 1) \;=\; \frac{n(n-1)}{2} \;=\; \Theta(n^2).
$$

More generally the running time is $\Theta(n + I)$, where $I$ is the number of inversions in the input. This is why insertion sort stays competitive on nearly sorted input, while its worst case is quadratic.`,
        sources: [KNUTH_VOL3, CLRS],
      },
    ],
    corrections: [
      {
        date: '2026-10-30',
        kind: 'sostanziale',
        resultId: 'limite-inferiore-ordinamento-confronti',
        text:
          'Demo correction. The first version stated that the lower bound also applies to counting sort. ' +
          'That is false: counting sort is not a comparison sort. The final paragraph has been rewritten.',
      },
      {
        date: '2026-10-30',
        kind: 'minore',
        resultId: 'merge-sort-ottimo',
        text: 'Demo correction. Clarified that the exact comparison count holds for n a power of two.',
      },
    ],
    aiDisclosure: DEMO_DISCLOSURE,
  },
  {
    date: '2026-10-30',
    status: 'pubblicato',
    demo: true,
    title: 'Shortest paths: Dijkstra’s algorithm with a binary heap',
    summary: 'A short example briefing with a single classic result on shortest paths.',
    coverage: { from: '2026-10-29', to: '2026-10-29' },
    results: [
      {
        id: 'dijkstra-heap-binario',
        title: 'With a binary heap, Dijkstra computes shortest paths in O((n + m) log n)',
        summary: 'On a graph with non-negative weights, every priority-queue operation costs O(log n).',
        topics: ['grafi', 'algoritmi'],
        status: CLASSIC,
        body: md`On a directed graph with $n$ vertices, $m$ edges, and non-negative weights, Dijkstra's algorithm extracts each vertex once from the priority queue and performs at most one decrease-key per edge. With a binary heap both operations cost $O(\log n)$, for a total of $O((n + m)\log n)$.

The assumption on the weights is essential: with negative edges, the greedy choice of the closest vertex is no longer correct and different algorithms are needed, such as Bellman–Ford.`,
        sources: [
          {
            title: 'A note on two problems in connexion with graphs',
            authors: ['Edsger W. Dijkstra'],
            year: 1959,
            venue: 'Numerische Mathematik 1',
            kind: 'articolo',
            lang: 'en',
          },
          CLRS,
        ],
      },
    ],
    corrections: [],
    aiDisclosure: DEMO_DISCLOSURE,
  },
  {
    date: '2026-10-31',
    status: 'pubblicato',
    demo: true,
    title: 'Multiplying integers faster than n² and counting binary trees',
    summary:
      'An example briefing with two classic results: Karatsuba’s algorithm and the count of binary trees ' +
      'via the Catalan numbers.',
    coverage: { from: '2026-10-30', to: '2026-10-30' },
    results: [
      {
        id: 'karatsuba',
        title: 'Karatsuba’s algorithm multiplies two n-digit integers with three recursive products instead of four',
        summary: 'Saving one product per level lowers the exponent of the cost from 2 to log₂ 3, about 1.585.',
        topics: ['algoritmi'],
        status: CLASSIC,
        body: md`The schoolbook method multiplies two $n$-digit integers with $\Theta(n^2)$ elementary operations. Karatsuba writes $x = x_1 B^{m} + x_0$ and $y = y_1 B^{m} + y_0$ and observes that

$$
x y = z_2 B^{2m} + z_1 B^{m} + z_0, \qquad z_1 = (x_1 + x_0)(y_1 + y_0) - z_2 - z_0,
$$

with $z_2 = x_1 y_1$ and $z_0 = x_0 y_0$. Three recursive multiplications of half the size are therefore enough, giving $T(n) = 3\,T(n/2) + O(n)$ and $T(n) = O(n^{\log_2 3}) \approx O(n^{1.585})$.`,
        sources: [
          CLRS,
          {
            title: 'Karatsuba algorithm',
            authors: ['Wikipedia contributors'],
            kind: 'pagina-web',
            url: 'https://en.wikipedia.org/wiki/Karatsuba_algorithm',
            lang: 'en',
          },
        ],
      },
      {
        id: 'alberi-binari-catalan',
        title: 'Binary trees with n nodes are counted by the n-th Catalan number',
        summary: 'A recurrence on the root leads to the closed form and to 4ⁿ asymptotic growth.',
        topics: ['combinatoria'],
        status: CLASSIC,
        body: md`Choosing how many nodes lie in the left subtree of the root gives the recurrence $C_0 = 1$, $C_{n+1} = \sum_{i=0}^{n} C_i\, C_{n-i}$, whose solution is

$$
C_n = \frac{1}{n+1}\binom{2n}{n} \sim \frac{4^n}{n^{3/2}\sqrt{\pi}}.
$$

The first values are $1, 1, 2, 5, 14, 42$. The same numbers count many other structures, for example well-formed parenthesizations.`,
        sources: [
          {
            title: 'Catalan number',
            authors: ['Wikipedia contributors'],
            kind: 'pagina-web',
            url: 'https://en.wikipedia.org/wiki/Catalan_number',
            lang: 'en',
          },
        ],
      },
    ],
    corrections: [],
    aiDisclosure: DEMO_DISCLOSURE,
  },
  {
    // Bozza di controllo: non deve comparire in home, archivio, argomenti né in dist/.
    // scripts/check-dist.ts cerca il marcatore (invariato, è un dato di controllo), la data, l'id e la pagina dell'argomento.
    date: '2026-11-01',
    status: 'bozza',
    demo: true,
    title: 'MARCATORE-BOZZA-NON-PUBBLICARE title of the control draft',
    summary: 'MARCATORE-BOZZA-NON-PUBBLICARE summary of the control draft.',
    coverage: { from: '2026-10-31', to: '2026-10-31' },
    results: [
      {
        id: 'bozza-di-controllo',
        title: 'MARCATORE-BOZZA-NON-PUBBLICARE draft result',
        summary: 'The only result with the Logic topic: its page must not be generated.',
        topics: ['logica'],
        status: CLASSIC,
        body: md`MARCATORE-BOZZA-NON-PUBBLICARE body of the draft, with a formula $n^2$.`,
        sources: [CLRS],
      },
    ],
    corrections: [],
    aiDisclosure: DEMO_DISCLOSURE,
  },
];
