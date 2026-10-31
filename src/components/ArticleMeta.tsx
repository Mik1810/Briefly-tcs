import type { Briefing, Topic } from '../lib/content/types.ts';
import DateText from './DateText.tsx';
import TopicLinks from './TopicLinks.tsx';

interface Props {
  briefing: Briefing;
  topics: Topic[];
}

export default function ArticleMeta({ briefing, topics }: Props) {
  const { coverage } = briefing;
  return (
    <dl className="article-meta">
      <div>
        <dt>Pubblicato</dt>
        <dd>
          <DateText date={briefing.date} />
        </dd>
      </div>
      {briefing.updatedOn ? (
        <div>
          <dt>Aggiornato</dt>
          <dd>
            <DateText date={briefing.updatedOn} /> · <a href="#correzioni">vedi correzioni</a>
          </dd>
        </div>
      ) : null}
      <div>
        <dt>Periodo coperto</dt>
        <dd>
          {coverage.from === coverage.to ? (
            <DateText date={coverage.from} />
          ) : (
            <>
              dal <DateText date={coverage.from} /> al <DateText date={coverage.to} />
            </>
          )}
        </dd>
      </div>
      <div>
        <dt>Argomenti</dt>
        <dd>
          <TopicLinks topics={topics} />
        </dd>
      </div>
      <div>
        <dt>Risultati</dt>
        <dd>{briefing.results.length}</dd>
      </div>
    </dl>
  );
}
