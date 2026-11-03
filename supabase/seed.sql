-- GENERATO da scripts/generate-seed.ts a partire da src/lib/content/fixtures/. Non modificare a mano.
-- Solo contenuti dimostrativi: risultati classici da manuale e una bozza di controllo.

insert into public.briefings (date, status, demo, title, summary, coverage_from, coverage_to, updated_on, intro, ai_disclosure) values
  ('2026-10-29', 'pubblicato', true, 'Comparison sorting: the lower bound and the algorithms that meet it', 'A long example briefing with classic results: the lower bound for comparison sorting, merge sort, and the quadratic worst case of insertion sort.', '2026-10-28', '2026-10-28', '2026-10-30', 'This briefing shows what a long issue looks like, with inline and display formulas, sources for every result, and a correction. The three results are textbook theorems, chosen because they are easy to check; the [Method page](/method/) describes how real news will be handled.', 'Demo text drafted with the assistance of an AI model (Claude) while developing the prototype. It describes classic textbook results; it has not gone through the planned editorial process and no scientific review has been carried out.'),
  ('2026-10-30', 'pubblicato', true, 'Shortest paths: Dijkstra’s algorithm with a binary heap', 'A short example briefing with a single classic result on shortest paths.', '2026-10-29', '2026-10-29', null, null, 'Demo text drafted with the assistance of an AI model (Claude) while developing the prototype. It describes classic textbook results; it has not gone through the planned editorial process and no scientific review has been carried out.'),
  ('2026-10-31', 'pubblicato', true, 'Multiplying integers faster than n² and counting binary trees', 'An example briefing with two classic results: Karatsuba’s algorithm and the count of binary trees via the Catalan numbers.', '2026-10-30', '2026-10-30', null, null, 'Demo text drafted with the assistance of an AI model (Claude) while developing the prototype. It describes classic textbook results; it has not gone through the planned editorial process and no scientific review has been carried out.'),
  ('2026-11-01', 'bozza', true, 'MARCATORE-BOZZA-NON-PUBBLICARE title of the control draft', 'MARCATORE-BOZZA-NON-PUBBLICARE summary of the control draft.', '2026-10-31', '2026-10-31', null, null, 'Demo text drafted with the assistance of an AI model (Claude) while developing the prototype. It describes classic textbook results; it has not gone through the planned editorial process and no scientific review has been carried out.');

insert into public.results (id, briefing_date, position, title, summary, body, publication, formalization, verification) values
  ('limite-inferiore-ordinamento-confronti', '2026-10-29', 0, 'Every comparison sort needs Ω(n log n) comparisons in the worst case', 'The decision-tree argument: n! permutations to tell apart force a tree of height at least log₂ n!.', 'An algorithm that accesses the elements only through comparisons $a_i \le a_j$ can be described by a **decision tree**: every internal node is a comparison, every leaf a permutation of the input. To sort every input of $n$ distinct elements correctly, the tree must have at least $n!$ reachable leaves.

A binary tree of height $h$ has at most $2^h$ leaves, so $2^h \ge n!$, that is $h \ge \log_2 n!$. It is enough to bound the factorial from below:

$$
\log_2 n! \;=\; \sum_{k=1}^{n} \log_2 k \;\ge\; \sum_{k=\lceil n/2 \rceil}^{n} \log_2 k \;\ge\; \frac{n}{2}\,\log_2 \frac{n}{2} \;=\; \Omega(n \log n).
$$

Stirling''s formula also gives the next terms. It is a good example of a long formula: on narrow screens it scrolls inside its own block without moving the page.

$$
\log_2 n! \;=\; n \log_2 n \;-\; n \log_2 e \;+\; \frac{1}{2}\log_2(2\pi n) \;+\; \frac{\log_2 e}{12\,n} \;-\; \frac{\log_2 e}{360\,n^{3}} \;+\; O\!\left(\frac{1}{n^{5}}\right)
$$

The bound holds **only in the comparison model**. Algorithms that read the keys, such as counting sort on integers in $\{0, \dots, k\}$, run in time $O(n + k)$ and are not subject to this constraint.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('merge-sort-ottimo', '2026-10-29', 1, 'Merge sort uses O(n log n) comparisons and is therefore optimal among comparison sorts', 'The recurrence T(n) = 2T(n/2) + Θ(n) gives Θ(n log n), which matches the lower bound.', 'Merge sort splits the input into two halves, sorts them recursively, and merges them in linear time. Its cost satisfies

$$
T(n) = 2\,T\!\left(\frac{n}{2}\right) + \Theta(n), \qquad T(1) = \Theta(1),
$$

which by the master theorem (case $a = b = 2$, $f(n) = \Theta(n)$) gives $T(n) = \Theta(n \log n)$.

For $n$ a power of two, the worst-case number of comparisons is exactly $n \log_2 n - n + 1$. Comparing it with the [lower bound of the previous result](#result-limite-inferiore-ordinamento-confronti) gives asymptotic optimality: no comparison sort does better by more than a constant factor.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('insertion-sort-quadratico', '2026-10-29', 2, 'Insertion sort takes Θ(n²) comparisons in the worst case', 'On reverse-sorted input every element moves past all the previous ones: n(n−1)/2 comparisons.', 'Insertion sort inserts the $i$-th element into the already sorted prefix, scanning it from the right. On decreasing input the $i$-th element is compared with all $i - 1$ previous ones, for a total of

$$
\sum_{i=2}^{n} (i - 1) \;=\; \frac{n(n-1)}{2} \;=\; \Theta(n^2).
$$

More generally the running time is $\Theta(n + I)$, where $I$ is the number of inversions in the input. This is why insertion sort stays competitive on nearly sorted input, while its worst case is quadratic.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('dijkstra-heap-binario', '2026-10-30', 0, 'With a binary heap, Dijkstra computes shortest paths in O((n + m) log n)', 'On a graph with non-negative weights, every priority-queue operation costs O(log n).', 'On a directed graph with $n$ vertices, $m$ edges, and non-negative weights, Dijkstra''s algorithm extracts each vertex once from the priority queue and performs at most one decrease-key per edge. With a binary heap both operations cost $O(\log n)$, for a total of $O((n + m)\log n)$.

The assumption on the weights is essential: with negative edges, the greedy choice of the closest vertex is no longer correct and different algorithms are needed, such as Bellman–Ford.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('karatsuba', '2026-10-31', 0, 'Karatsuba’s algorithm multiplies two n-digit integers with three recursive products instead of four', 'Saving one product per level lowers the exponent of the cost from 2 to log₂ 3, about 1.585.', 'The schoolbook method multiplies two $n$-digit integers with $\Theta(n^2)$ elementary operations. Karatsuba writes $x = x_1 B^{m} + x_0$ and $y = y_1 B^{m} + y_0$ and observes that

$$
x y = z_2 B^{2m} + z_1 B^{m} + z_0, \qquad z_1 = (x_1 + x_0)(y_1 + y_0) - z_2 - z_0,
$$

with $z_2 = x_1 y_1$ and $z_0 = x_0 y_0$. Three recursive multiplications of half the size are therefore enough, giving $T(n) = 3\,T(n/2) + O(n)$ and $T(n) = O(n^{\log_2 3}) \approx O(n^{1.585})$.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('alberi-binari-catalan', '2026-10-31', 1, 'Binary trees with n nodes are counted by the n-th Catalan number', 'A recurrence on the root leads to the closed form and to 4ⁿ asymptotic growth.', 'Choosing how many nodes lie in the left subtree of the root gives the recurrence $C_0 = 1$, $C_{n+1} = \sum_{i=0}^{n} C_i\, C_{n-i}$, whose solution is

$$
C_n = \frac{1}{n+1}\binom{2n}{n} \sim \frac{4^n}{n^{3/2}\sqrt{\pi}}.
$$

The first values are $1, 1, 2, 5, 14, 42$. The same numbers count many other structures, for example well-formed parenthesizations.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('bozza-di-controllo', '2026-11-01', 0, 'MARCATORE-BOZZA-NON-PUBBLICARE draft result', 'The only result with the Logic topic: its page must not be generated.', 'MARCATORE-BOZZA-NON-PUBBLICARE body of the draft, with a formula $n^2$.', 'risultato-classico', 'non-indicata', 'non-verificato');

insert into public.sources (result_id, position, title, authors, year, venue, url, kind, lang) values
  ('limite-inferiore-ordinamento-confronti', 0, 'The Art of Computer Programming, Volume 3: Sorting and Searching', array['Donald E. Knuth'], 1998, 'Addison-Wesley, 2nd edition', null, 'libro', 'en'),
  ('limite-inferiore-ordinamento-confronti', 1, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4th edition', null, 'libro', 'en'),
  ('limite-inferiore-ordinamento-confronti', 2, 'Comparison sort', array['Wikipedia contributors'], null, null, 'https://en.wikipedia.org/wiki/Comparison_sort', 'pagina-web', 'en'),
  ('merge-sort-ottimo', 0, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4th edition', null, 'libro', 'en'),
  ('merge-sort-ottimo', 1, 'Merge sort', array['Wikipedia contributors'], null, null, 'https://en.wikipedia.org/wiki/Merge_sort', 'pagina-web', 'en'),
  ('insertion-sort-quadratico', 0, 'The Art of Computer Programming, Volume 3: Sorting and Searching', array['Donald E. Knuth'], 1998, 'Addison-Wesley, 2nd edition', null, 'libro', 'en'),
  ('insertion-sort-quadratico', 1, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4th edition', null, 'libro', 'en'),
  ('dijkstra-heap-binario', 0, 'A note on two problems in connexion with graphs', array['Edsger W. Dijkstra'], 1959, 'Numerische Mathematik 1', null, 'articolo', 'en'),
  ('dijkstra-heap-binario', 1, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4th edition', null, 'libro', 'en'),
  ('karatsuba', 0, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4th edition', null, 'libro', 'en'),
  ('karatsuba', 1, 'Karatsuba algorithm', array['Wikipedia contributors'], null, null, 'https://en.wikipedia.org/wiki/Karatsuba_algorithm', 'pagina-web', 'en'),
  ('alberi-binari-catalan', 0, 'Catalan number', array['Wikipedia contributors'], null, null, 'https://en.wikipedia.org/wiki/Catalan_number', 'pagina-web', 'en'),
  ('bozza-di-controllo', 0, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4th edition', null, 'libro', 'en');

insert into public.corrections (briefing_date, position, date, kind, text, result_id) values
  ('2026-10-29', 0, '2026-10-30', 'sostanziale', 'Demo correction. The first version stated that the lower bound also applies to counting sort. That is false: counting sort is not a comparison sort. The final paragraph has been rewritten.', 'limite-inferiore-ordinamento-confronti'),
  ('2026-10-29', 1, '2026-10-30', 'minore', 'Demo correction. Clarified that the exact comparison count holds for n a power of two.', 'merge-sort-ottimo');
