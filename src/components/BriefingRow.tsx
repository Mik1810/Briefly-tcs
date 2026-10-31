import { briefingPath } from '../lib/content/repository.ts';
import type { Briefing, Topic } from '../lib/content/types.ts';
import DateText from './DateText.tsx';
import TopicLinks from './TopicLinks.tsx';

interface Props {
  briefing: Briefing;
  topics: Topic[];
  /** Livello del titolo, per mantenere una gerarchia corretta nelle diverse pagine. */
  headingLevel: 2 | 3;
}

/** Riga editoriale di home e archivio: data, argomenti, titolo e sommario. */
export default function BriefingRow({ briefing, topics, headingLevel }: Props) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="row">
      <p className="meta">
        <DateText date={briefing.date} />
        <span aria-hidden="true"> — </span>
        <TopicLinks topics={topics} />
        {briefing.demo ? (
          <>
            <span aria-hidden="true"> — </span>
            <span className="meta-demo">Contenuto dimostrativo</span>
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
