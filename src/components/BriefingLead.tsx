import { briefingPath, resultPath } from '../lib/content/repository.ts';
import type { Briefing } from '../lib/content/types.ts';
import DateText from './DateText.tsx';
import DemoLabel from './DemoLabel.tsx';

interface Props {
  briefing: Briefing;
}

/** Articolo in evidenza della home: l'ultimo briefing, con l'elenco dei suoi risultati. */
export default function BriefingLead({ briefing }: Props) {
  return (
    <article className="lead" aria-labelledby="lead-title">
      <DemoLabel demo={briefing.demo} />
      <h2 id="lead-title" className="lead-title">
        <a href={briefingPath(briefing)}>{briefing.title}</a>
      </h2>
      <p className="lead-summary">{briefing.summary}</p>
      <p className="meta">
        <DateText date={briefing.date} />
      </p>
      <h3 className="lead-results-heading">In this briefing</h3>
      <ol className="lead-results">
        {briefing.results.map((result) => (
          <li key={result.id}>
            <a href={resultPath(briefing, result)}>{result.title}</a>
          </li>
        ))}
      </ol>
    </article>
  );
}
