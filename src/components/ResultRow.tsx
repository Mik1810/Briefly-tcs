import { briefingPath, resultPath } from '../lib/content/repository.ts';
import type { Briefing, Result } from '../lib/content/types.ts';
import DateText from './DateText.tsx';

interface Props {
  briefing: Briefing;
  result: Result;
}

/** Riga delle pagine per argomento: porta direttamente alla sezione del risultato nel briefing. */
export default function ResultRow({ briefing, result }: Props) {
  return (
    <article className="row">
      <p className="meta">
        <DateText date={briefing.date} />
        <span aria-hidden="true"> — </span>
        <a href={briefingPath(briefing)}>from the daily briefing</a>
        {briefing.demo ? (
          <>
            <span aria-hidden="true"> — </span>
            <span className="meta-demo">Demo content</span>
          </>
        ) : null}
      </p>
      <h2 className="row-title">
        <a href={resultPath(briefing, result)}>{result.title}</a>
      </h2>
      <p className="row-summary">{result.summary}</p>
    </article>
  );
}
