import { briefingPath } from '../lib/content/repository.ts';
import type { Briefing } from '../lib/content/types.ts';
import DateText from './DateText.tsx';

interface Props {
  briefing: Briefing;
  /** Livello del titolo, per mantenere una gerarchia corretta nelle diverse pagine. */
  headingLevel: 2 | 3;
}

/** Riga editoriale di home e archivio: data, titolo e sommario. */
export default function BriefingRow({ briefing, headingLevel }: Props) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="row">
      <p className="meta">
        <DateText date={briefing.date} />
        {briefing.demo ? (
          <>
            <span aria-hidden="true"> — </span>
            <span className="meta-demo">Demo content</span>
          </>
        ) : null}
      </p>
      <Heading className="row-title">
        <a href={briefingPath(briefing)}>{briefing.title}</a>
      </Heading>
      <p className="row-summary">{briefing.summary}</p>
    </article>
  );
}
