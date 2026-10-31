-- GENERATO da scripts/generate-seed.ts a partire da src/lib/content/fixtures/. Non modificare a mano.
-- Solo contenuti dimostrativi: risultati classici da manuale e una bozza di controllo.

insert into public.topics (slug, name, description, position) values
  ('complessita', 'Complessità computazionale', 'Limiti inferiori, classi di complessità e modelli di calcolo.', 0),
  ('algoritmi', 'Algoritmi', 'Progetto e analisi di algoritmi e strutture dati.', 1),
  ('grafi', 'Grafi', 'Algoritmi e proprietà strutturali dei grafi.', 2),
  ('combinatoria', 'Combinatoria', 'Enumerazione, strutture discrete e metodi combinatori.', 3),
  ('logica', 'Logica', 'Logica in informatica, semantica e verifica formale.', 4);

insert into public.briefings (date, status, demo, title, summary, coverage_from, coverage_to, updated_on, intro, ai_disclosure) values
  ('2026-10-29', 'pubblicato', true, 'Ordinamento per confronti: il limite inferiore e gli algoritmi che lo raggiungono', 'Esempio di briefing lungo con risultati classici: il limite inferiore per l’ordinamento per confronti, merge sort e il caso peggiore quadratico di insertion sort.', '2026-10-28', '2026-10-28', '2026-10-30', 'Questo briefing mostra come appare un numero lungo, con formule in linea e in blocco, fonti per ogni risultato e una correzione. I tre risultati sono teoremi da manuale, scelti perché facili da controllare; la [pagina Metodo](/metodo/) descrive come saranno trattate le novità reali.', 'Testo dimostrativo redatto con l’assistenza di un modello AI (Claude) durante lo sviluppo del prototipo. Descrive risultati classici da manuale; non è passato per il processo editoriale previsto e nessuna revisione scientifica è stata svolta.'),
  ('2026-10-30', 'pubblicato', true, 'Cammini minimi: l’algoritmo di Dijkstra con uno heap binario', 'Esempio di briefing breve con un solo risultato classico sui cammini minimi.', '2026-10-29', '2026-10-29', null, null, 'Testo dimostrativo redatto con l’assistenza di un modello AI (Claude) durante lo sviluppo del prototipo. Descrive risultati classici da manuale; non è passato per il processo editoriale previsto e nessuna revisione scientifica è stata svolta.'),
  ('2026-10-31', 'pubblicato', true, 'Moltiplicare interi più velocemente di n² e contare gli alberi binari', 'Esempio di briefing con due risultati classici: l’algoritmo di Karatsuba e il conteggio degli alberi binari tramite i numeri di Catalan.', '2026-10-30', '2026-10-30', null, null, 'Testo dimostrativo redatto con l’assistenza di un modello AI (Claude) durante lo sviluppo del prototipo. Descrive risultati classici da manuale; non è passato per il processo editoriale previsto e nessuna revisione scientifica è stata svolta.'),
  ('2026-11-01', 'bozza', true, 'MARCATORE-BOZZA-NON-PUBBLICARE titolo della bozza di controllo', 'MARCATORE-BOZZA-NON-PUBBLICARE sommario della bozza di controllo.', '2026-10-31', '2026-10-31', null, null, 'Testo dimostrativo redatto con l’assistenza di un modello AI (Claude) durante lo sviluppo del prototipo. Descrive risultati classici da manuale; non è passato per il processo editoriale previsto e nessuna revisione scientifica è stata svolta.');

insert into public.results (id, briefing_date, position, title, summary, body, publication, formalization, verification) values
  ('limite-inferiore-ordinamento-confronti', '2026-10-29', 0, 'Ogni ordinamento per confronti richiede Ω(n log n) confronti nel caso peggiore', 'L’argomento dell’albero di decisione: n! permutazioni da distinguere impongono un albero di altezza almeno log₂ n!.', 'Un algoritmo che accede agli elementi solo tramite confronti $a_i \le a_j$ può essere descritto da un **albero di decisione**: ogni nodo interno è un confronto, ogni foglia una permutazione dell''input. Per ordinare correttamente ogni input di $n$ elementi distinti l''albero deve avere almeno $n!$ foglie raggiungibili.

Un albero binario di altezza $h$ ha al più $2^h$ foglie, quindi $2^h \ge n!$, cioè $h \ge \log_2 n!$. Basta stimare dal basso il fattoriale:

$$
\log_2 n! \;=\; \sum_{k=1}^{n} \log_2 k \;\ge\; \sum_{k=\lceil n/2 \rceil}^{n} \log_2 k \;\ge\; \frac{n}{2}\,\log_2 \frac{n}{2} \;=\; \Omega(n \log n).
$$

La formula di Stirling fornisce anche i termini successivi. È un buon esempio di formula lunga: su schermi stretti scorre dentro il proprio blocco, senza spostare la pagina.

$$
\log_2 n! \;=\; n \log_2 n \;-\; n \log_2 e \;+\; \frac{1}{2}\log_2(2\pi n) \;+\; \frac{\log_2 e}{12\,n} \;-\; \frac{\log_2 e}{360\,n^{3}} \;+\; O\!\left(\frac{1}{n^{5}}\right)
$$

Il limite vale **solo nel modello a confronti**. Algoritmi che leggono le chiavi, come il counting sort su interi in $\{0, \dots, k\}$, impiegano tempo $O(n + k)$ e non sono soggetti a questo vincolo.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('merge-sort-ottimo', '2026-10-29', 1, 'Merge sort ordina con O(n log n) confronti ed è quindi ottimo tra gli ordinamenti per confronti', 'La ricorrenza T(n) = 2T(n/2) + Θ(n) dà Θ(n log n), che coincide con il limite inferiore.', 'Merge sort divide l''input in due metà, le ordina ricorsivamente e le fonde in tempo lineare. Il suo costo soddisfa

$$
T(n) = 2\,T\!\left(\frac{n}{2}\right) + \Theta(n), \qquad T(1) = \Theta(1),
$$

che per il teorema principale (caso con $a = b = 2$, $f(n) = \Theta(n)$) dà $T(n) = \Theta(n \log n)$.

Per $n$ potenza di due il numero di confronti nel caso peggiore è esattamente $n \log_2 n - n + 1$. Confrontandolo con il [limite inferiore del risultato precedente](#risultato-limite-inferiore-ordinamento-confronti) si ottiene l''ottimalità asintotica: nessun ordinamento per confronti fa meglio di un fattore costante.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('insertion-sort-quadratico', '2026-10-29', 2, 'Insertion sort impiega Θ(n²) confronti nel caso peggiore', 'Su un input in ordine inverso ogni elemento attraversa tutti i precedenti: n(n−1)/2 confronti.', 'Insertion sort inserisce l''elemento $i$-esimo nella parte già ordinata, scorrendola da destra. Su un input in ordine decrescente l''elemento $i$-esimo viene confrontato con tutti gli $i - 1$ precedenti, per un totale di

$$
\sum_{i=2}^{n} (i - 1) \;=\; \frac{n(n-1)}{2} \;=\; \Theta(n^2).
$$

Più in generale il tempo è $\Theta(n + I)$, dove $I$ è il numero di inversioni dell''input. Per questo insertion sort resta competitivo su input quasi ordinati, mentre il suo caso peggiore è quadratico.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('dijkstra-heap-binario', '2026-10-30', 0, 'Con uno heap binario Dijkstra calcola i cammini minimi in O((n + m) log n)', 'Su un grafo con pesi non negativi ogni operazione sulla coda di priorità costa O(log n).', 'Su un grafo orientato con $n$ vertici, $m$ archi e pesi non negativi, l''algoritmo di Dijkstra estrae ogni vertice una volta dalla coda di priorità ed esegue al più un decremento di chiave per arco. Con uno heap binario entrambe le operazioni costano $O(\log n)$, per un totale di $O((n + m)\log n)$.

L''ipotesi sui pesi è essenziale: con archi negativi la scelta greedy del vertice più vicino non è più corretta e servono algoritmi diversi, come Bellman–Ford.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('karatsuba', '2026-10-31', 0, 'L’algoritmo di Karatsuba moltiplica due interi di n cifre con tre prodotti ricorsivi invece di quattro', 'Il risparmio di un prodotto per livello porta l’esponente del costo da 2 a log₂ 3, circa 1,585.', 'Il metodo scolastico moltiplica due interi di $n$ cifre con $\Theta(n^2)$ operazioni elementari. Karatsuba scrive $x = x_1 B^{m} + x_0$ e $y = y_1 B^{m} + y_0$ e osserva che

$$
x y = z_2 B^{2m} + z_1 B^{m} + z_0, \qquad z_1 = (x_1 + x_0)(y_1 + y_0) - z_2 - z_0,
$$

con $z_2 = x_1 y_1$ e $z_0 = x_0 y_0$. Bastano quindi tre moltiplicazioni ricorsive di metà dimensione, da cui $T(n) = 3\,T(n/2) + O(n)$ e $T(n) = O(n^{\log_2 3}) \approx O(n^{1{,}585})$.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('alberi-binari-catalan', '2026-10-31', 1, 'Gli alberi binari con n nodi sono contati dall’n-esimo numero di Catalan', 'Una ricorrenza sulla radice porta alla formula chiusa e alla crescita asintotica 4ⁿ.', 'Scegliendo quanti nodi stanno nel sottoalbero sinistro della radice si ottiene la ricorrenza $C_0 = 1$, $C_{n+1} = \sum_{i=0}^{n} C_i\, C_{n-i}$, la cui soluzione è

$$
C_n = \frac{1}{n+1}\binom{2n}{n} \sim \frac{4^n}{n^{3/2}\sqrt{\pi}}.
$$

I primi valori sono $1, 1, 2, 5, 14, 42$. Gli stessi numeri contano molte altre strutture, per esempio le parentesizzazioni corrette.', 'risultato-classico', 'non-indicata', 'non-verificato'),
  ('bozza-di-controllo', '2026-11-01', 0, 'MARCATORE-BOZZA-NON-PUBBLICARE risultato della bozza', 'Unico risultato con argomento Logica: la sua pagina non deve essere generata.', 'MARCATORE-BOZZA-NON-PUBBLICARE corpo della bozza, con una formula $n^2$.', 'risultato-classico', 'non-indicata', 'non-verificato');

insert into public.result_topics (result_id, topic_slug, position) values
  ('limite-inferiore-ordinamento-confronti', 'complessita', 0),
  ('limite-inferiore-ordinamento-confronti', 'algoritmi', 1),
  ('merge-sort-ottimo', 'algoritmi', 0),
  ('insertion-sort-quadratico', 'algoritmi', 0),
  ('dijkstra-heap-binario', 'grafi', 0),
  ('dijkstra-heap-binario', 'algoritmi', 1),
  ('karatsuba', 'algoritmi', 0),
  ('alberi-binari-catalan', 'combinatoria', 0),
  ('bozza-di-controllo', 'logica', 0);

insert into public.sources (result_id, position, title, authors, year, venue, url, kind, lang) values
  ('limite-inferiore-ordinamento-confronti', 0, 'The Art of Computer Programming, Volume 3: Sorting and Searching', array['Donald E. Knuth'], 1998, 'Addison-Wesley, 2ª edizione', null, 'libro', 'en'),
  ('limite-inferiore-ordinamento-confronti', 1, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4ª edizione', null, 'libro', 'en'),
  ('limite-inferiore-ordinamento-confronti', 2, 'Comparison sort', array['Contributori di Wikipedia'], null, null, 'https://en.wikipedia.org/wiki/Comparison_sort', 'pagina-web', 'en'),
  ('merge-sort-ottimo', 0, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4ª edizione', null, 'libro', 'en'),
  ('merge-sort-ottimo', 1, 'Merge sort', array['Contributori di Wikipedia'], null, null, 'https://en.wikipedia.org/wiki/Merge_sort', 'pagina-web', 'en'),
  ('insertion-sort-quadratico', 0, 'The Art of Computer Programming, Volume 3: Sorting and Searching', array['Donald E. Knuth'], 1998, 'Addison-Wesley, 2ª edizione', null, 'libro', 'en'),
  ('insertion-sort-quadratico', 1, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4ª edizione', null, 'libro', 'en'),
  ('dijkstra-heap-binario', 0, 'A note on two problems in connexion with graphs', array['Edsger W. Dijkstra'], 1959, 'Numerische Mathematik 1', null, 'articolo', 'en'),
  ('dijkstra-heap-binario', 1, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4ª edizione', null, 'libro', 'en'),
  ('karatsuba', 0, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4ª edizione', null, 'libro', 'en'),
  ('karatsuba', 1, 'Karatsuba algorithm', array['Contributori di Wikipedia'], null, null, 'https://en.wikipedia.org/wiki/Karatsuba_algorithm', 'pagina-web', 'en'),
  ('alberi-binari-catalan', 0, 'Catalan number', array['Contributori di Wikipedia'], null, null, 'https://en.wikipedia.org/wiki/Catalan_number', 'pagina-web', 'en'),
  ('bozza-di-controllo', 0, 'Introduction to Algorithms', array['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'], 2022, 'MIT Press, 4ª edizione', null, 'libro', 'en');

insert into public.corrections (briefing_date, position, date, kind, text, result_id) values
  ('2026-10-29', 0, '2026-10-30', 'sostanziale', 'Correzione dimostrativa. La prima versione affermava che il limite inferiore vale anche per il counting sort. È falso: il counting sort non è un ordinamento per confronti. Il paragrafo finale è stato riscritto.', 'limite-inferiore-ordinamento-confronti'),
  ('2026-10-29', 1, '2026-10-30', 'minore', 'Correzione dimostrativa. Precisato che il conteggio esatto dei confronti vale per n potenza di due.', 'merge-sort-ottimo');
