import type { Briefing, ScientificStatus, Source } from '../types.ts';

// CONTENUTI DIMOSTRATIVI. Servono solo a giudicare impaginazione, formule, correzioni ed esclusione
// delle bozze. Descrivono risultati classici da manuale: nessuna novità di ricerca, nessuna
// rivendicazione tratta dal briefing originale.

// String.raw conserva le barre rovesciate del LaTeX. Non scrivere mai il dollaro seguito da graffa aperta.
const md = String.raw;

const DEMO_DISCLOSURE =
  'Testo dimostrativo redatto con l’assistenza di un modello AI (Claude) durante lo sviluppo del prototipo. ' +
  'Descrive risultati classici da manuale; non è passato per il processo editoriale previsto e nessuna revisione ' +
  'scientifica è stata svolta.';

const CLASSIC: ScientificStatus = {
  publication: 'risultato-classico',
  formalization: 'non-indicata',
  verification: 'non-verificato',
};

const CLRS: Source = {
  title: 'Introduction to Algorithms',
  authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
  year: 2022,
  venue: 'MIT Press, 4ª edizione',
  kind: 'libro',
  lang: 'en',
};

const KNUTH_VOL3: Source = {
  title: 'The Art of Computer Programming, Volume 3: Sorting and Searching',
  authors: ['Donald E. Knuth'],
  year: 1998,
  venue: 'Addison-Wesley, 2ª edizione',
  kind: 'libro',
  lang: 'en',
};

export const briefings: Briefing[] = [
  {
    date: '2026-10-29',
    status: 'pubblicato',
    demo: true,
    title: 'Ordinamento per confronti: il limite inferiore e gli algoritmi che lo raggiungono',
    summary:
      'Esempio di briefing lungo con risultati classici: il limite inferiore per l’ordinamento per confronti, ' +
      'merge sort e il caso peggiore quadratico di insertion sort.',
    coverage: { from: '2026-10-28', to: '2026-10-28' },
    updatedOn: '2026-10-30',
    intro: md`Questo briefing mostra come appare un numero lungo, con formule in linea e in blocco, fonti per ogni risultato e una correzione. I tre risultati sono teoremi da manuale, scelti perché facili da controllare; la [pagina Metodo](/metodo/) descrive come saranno trattate le novità reali.`,
    results: [
      {
        id: 'limite-inferiore-ordinamento-confronti',
        title: 'Ogni ordinamento per confronti richiede Ω(n log n) confronti nel caso peggiore',
        summary:
          'L’argomento dell’albero di decisione: n! permutazioni da distinguere impongono un albero di altezza almeno log₂ n!.',
        topics: ['complessita', 'algoritmi'],
        status: CLASSIC,
        body: md`Un algoritmo che accede agli elementi solo tramite confronti $a_i \le a_j$ può essere descritto da un **albero di decisione**: ogni nodo interno è un confronto, ogni foglia una permutazione dell'input. Per ordinare correttamente ogni input di $n$ elementi distinti l'albero deve avere almeno $n!$ foglie raggiungibili.

Un albero binario di altezza $h$ ha al più $2^h$ foglie, quindi $2^h \ge n!$, cioè $h \ge \log_2 n!$. Basta stimare dal basso il fattoriale:

$$
\log_2 n! \;=\; \sum_{k=1}^{n} \log_2 k \;\ge\; \sum_{k=\lceil n/2 \rceil}^{n} \log_2 k \;\ge\; \frac{n}{2}\,\log_2 \frac{n}{2} \;=\; \Omega(n \log n).
$$

La formula di Stirling fornisce anche i termini successivi. È un buon esempio di formula lunga: su schermi stretti scorre dentro il proprio blocco, senza spostare la pagina.

$$
\log_2 n! \;=\; n \log_2 n \;-\; n \log_2 e \;+\; \frac{1}{2}\log_2(2\pi n) \;+\; \frac{\log_2 e}{12\,n} \;-\; \frac{\log_2 e}{360\,n^{3}} \;+\; O\!\left(\frac{1}{n^{5}}\right)
$$

Il limite vale **solo nel modello a confronti**. Algoritmi che leggono le chiavi, come il counting sort su interi in $\{0, \dots, k\}$, impiegano tempo $O(n + k)$ e non sono soggetti a questo vincolo.`,
        sources: [
          KNUTH_VOL3,
          CLRS,
          {
            title: 'Comparison sort',
            authors: ['Contributori di Wikipedia'],
            kind: 'pagina-web',
            url: 'https://en.wikipedia.org/wiki/Comparison_sort',
            lang: 'en',
          },
        ],
      },
      {
        id: 'merge-sort-ottimo',
        title: 'Merge sort ordina con O(n log n) confronti ed è quindi ottimo tra gli ordinamenti per confronti',
        summary: 'La ricorrenza T(n) = 2T(n/2) + Θ(n) dà Θ(n log n), che coincide con il limite inferiore.',
        topics: ['algoritmi'],
        status: CLASSIC,
        body: md`Merge sort divide l'input in due metà, le ordina ricorsivamente e le fonde in tempo lineare. Il suo costo soddisfa

$$
T(n) = 2\,T\!\left(\frac{n}{2}\right) + \Theta(n), \qquad T(1) = \Theta(1),
$$

che per il teorema principale (caso con $a = b = 2$, $f(n) = \Theta(n)$) dà $T(n) = \Theta(n \log n)$.

Per $n$ potenza di due il numero di confronti nel caso peggiore è esattamente $n \log_2 n - n + 1$. Confrontandolo con il [limite inferiore del risultato precedente](#risultato-limite-inferiore-ordinamento-confronti) si ottiene l'ottimalità asintotica: nessun ordinamento per confronti fa meglio di un fattore costante.`,
        sources: [
          CLRS,
          {
            title: 'Merge sort',
            authors: ['Contributori di Wikipedia'],
            kind: 'pagina-web',
            url: 'https://en.wikipedia.org/wiki/Merge_sort',
            lang: 'en',
          },
        ],
      },
      {
        id: 'insertion-sort-quadratico',
        title: 'Insertion sort impiega Θ(n²) confronti nel caso peggiore',
        summary: 'Su un input in ordine inverso ogni elemento attraversa tutti i precedenti: n(n−1)/2 confronti.',
        topics: ['algoritmi'],
        status: CLASSIC,
        body: md`Insertion sort inserisce l'elemento $i$-esimo nella parte già ordinata, scorrendola da destra. Su un input in ordine decrescente l'elemento $i$-esimo viene confrontato con tutti gli $i - 1$ precedenti, per un totale di

$$
\sum_{i=2}^{n} (i - 1) \;=\; \frac{n(n-1)}{2} \;=\; \Theta(n^2).
$$

Più in generale il tempo è $\Theta(n + I)$, dove $I$ è il numero di inversioni dell'input. Per questo insertion sort resta competitivo su input quasi ordinati, mentre il suo caso peggiore è quadratico.`,
        sources: [KNUTH_VOL3, CLRS],
      },
    ],
    corrections: [
      {
        date: '2026-10-30',
        kind: 'sostanziale',
        resultId: 'limite-inferiore-ordinamento-confronti',
        text:
          'Correzione dimostrativa. La prima versione affermava che il limite inferiore vale anche per il counting sort. ' +
          'È falso: il counting sort non è un ordinamento per confronti. Il paragrafo finale è stato riscritto.',
      },
      {
        date: '2026-10-30',
        kind: 'minore',
        resultId: 'merge-sort-ottimo',
        text: 'Correzione dimostrativa. Precisato che il conteggio esatto dei confronti vale per n potenza di due.',
      },
    ],
    aiDisclosure: DEMO_DISCLOSURE,
  },
  {
    date: '2026-10-30',
    status: 'pubblicato',
    demo: true,
    title: 'Cammini minimi: l’algoritmo di Dijkstra con uno heap binario',
    summary: 'Esempio di briefing breve con un solo risultato classico sui cammini minimi.',
    coverage: { from: '2026-10-29', to: '2026-10-29' },
    results: [
      {
        id: 'dijkstra-heap-binario',
        title: 'Con uno heap binario Dijkstra calcola i cammini minimi in O((n + m) log n)',
        summary: 'Su un grafo con pesi non negativi ogni operazione sulla coda di priorità costa O(log n).',
        topics: ['grafi', 'algoritmi'],
        status: CLASSIC,
        body: md`Su un grafo orientato con $n$ vertici, $m$ archi e pesi non negativi, l'algoritmo di Dijkstra estrae ogni vertice una volta dalla coda di priorità ed esegue al più un decremento di chiave per arco. Con uno heap binario entrambe le operazioni costano $O(\log n)$, per un totale di $O((n + m)\log n)$.

L'ipotesi sui pesi è essenziale: con archi negativi la scelta greedy del vertice più vicino non è più corretta e servono algoritmi diversi, come Bellman–Ford.`,
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
    title: 'Moltiplicare interi più velocemente di n² e contare gli alberi binari',
    summary:
      'Esempio di briefing con due risultati classici: l’algoritmo di Karatsuba e il conteggio degli alberi binari ' +
      'tramite i numeri di Catalan.',
    coverage: { from: '2026-10-30', to: '2026-10-30' },
    results: [
      {
        id: 'karatsuba',
        title: 'L’algoritmo di Karatsuba moltiplica due interi di n cifre con tre prodotti ricorsivi invece di quattro',
        summary: 'Il risparmio di un prodotto per livello porta l’esponente del costo da 2 a log₂ 3, circa 1,585.',
        topics: ['algoritmi'],
        status: CLASSIC,
        body: md`Il metodo scolastico moltiplica due interi di $n$ cifre con $\Theta(n^2)$ operazioni elementari. Karatsuba scrive $x = x_1 B^{m} + x_0$ e $y = y_1 B^{m} + y_0$ e osserva che

$$
x y = z_2 B^{2m} + z_1 B^{m} + z_0, \qquad z_1 = (x_1 + x_0)(y_1 + y_0) - z_2 - z_0,
$$

con $z_2 = x_1 y_1$ e $z_0 = x_0 y_0$. Bastano quindi tre moltiplicazioni ricorsive di metà dimensione, da cui $T(n) = 3\,T(n/2) + O(n)$ e $T(n) = O(n^{\log_2 3}) \approx O(n^{1{,}585})$.`,
        sources: [
          CLRS,
          {
            title: 'Karatsuba algorithm',
            authors: ['Contributori di Wikipedia'],
            kind: 'pagina-web',
            url: 'https://en.wikipedia.org/wiki/Karatsuba_algorithm',
            lang: 'en',
          },
        ],
      },
      {
        id: 'alberi-binari-catalan',
        title: 'Gli alberi binari con n nodi sono contati dall’n-esimo numero di Catalan',
        summary: 'Una ricorrenza sulla radice porta alla formula chiusa e alla crescita asintotica 4ⁿ.',
        topics: ['combinatoria'],
        status: CLASSIC,
        body: md`Scegliendo quanti nodi stanno nel sottoalbero sinistro della radice si ottiene la ricorrenza $C_0 = 1$, $C_{n+1} = \sum_{i=0}^{n} C_i\, C_{n-i}$, la cui soluzione è

$$
C_n = \frac{1}{n+1}\binom{2n}{n} \sim \frac{4^n}{n^{3/2}\sqrt{\pi}}.
$$

I primi valori sono $1, 1, 2, 5, 14, 42$. Gli stessi numeri contano molte altre strutture, per esempio le parentesizzazioni corrette.`,
        sources: [
          {
            title: 'Catalan number',
            authors: ['Contributori di Wikipedia'],
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
    // scripts/check-dist.mjs cerca il marcatore, la data, l'id del risultato e la pagina dell'argomento.
    date: '2026-11-01',
    status: 'bozza',
    demo: true,
    title: 'MARCATORE-BOZZA-NON-PUBBLICARE titolo della bozza di controllo',
    summary: 'MARCATORE-BOZZA-NON-PUBBLICARE sommario della bozza di controllo.',
    coverage: { from: '2026-10-31', to: '2026-10-31' },
    results: [
      {
        id: 'bozza-di-controllo',
        title: 'MARCATORE-BOZZA-NON-PUBBLICARE risultato della bozza',
        summary: 'Unico risultato con argomento Logica: la sua pagina non deve essere generata.',
        topics: ['logica'],
        status: CLASSIC,
        body: md`MARCATORE-BOZZA-NON-PUBBLICARE corpo della bozza, con una formula $n^2$.`,
        sources: [CLRS],
      },
    ],
    corrections: [],
    aiDisclosure: DEMO_DISCLOSURE,
  },
];
