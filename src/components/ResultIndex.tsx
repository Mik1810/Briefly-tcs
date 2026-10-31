import { resultAnchor } from '../lib/content/repository.ts';
import type { Result } from '../lib/content/types.ts';

interface Props {
  results: Result[];
}

/** Indice del briefing: un collegamento alla sezione di ciascun risultato. */
export default function ResultIndex({ results }: Props) {
  return (
    <nav className="result-index" aria-labelledby="indice-titolo">
      <h2 id="indice-titolo" className="small-heading">
        In this briefing
      </h2>
      <ol>
        {results.map((result) => (
          <li key={result.id}>
            <a href={`#${resultAnchor(result)}`}>{result.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
