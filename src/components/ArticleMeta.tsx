import type { Briefing, Topic } from '../lib/content/types.ts';
import DateText from './DateText.tsx';
import TopicLinks from './TopicLinks.tsx';

interface Props {
  briefing: Briefing;
  topics: Topic[];
}

export default function ArticleMeta({ briefing, topics }: Props) {
  return (
    <dl className="article-meta">
      <div>
        <dt>Published</dt>
        <dd>
          <DateText date={briefing.date} />
        </dd>
      </div>
      {briefing.updatedOn ? (
        <div>
          <dt>Updated</dt>
          <dd>
            <DateText date={briefing.updatedOn} /> · <a href="#correzioni">see corrections</a>
          </dd>
        </div>
      ) : null}
      <div>
        <dt>Topics</dt>
        <dd>
          <TopicLinks topics={topics} />
        </dd>
      </div>
      <div>
        <dt>Results</dt>
        <dd>{briefing.results.length}</dd>
      </div>
    </dl>
  );
}
