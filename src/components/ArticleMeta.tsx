import type { Briefing } from '../lib/content/types.ts';
import DateText from './DateText.tsx';

interface Props {
  briefing: Briefing;
}

export default function ArticleMeta({ briefing }: Props) {
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
            <DateText date={briefing.updatedOn} />
          </dd>
        </div>
      ) : null}
      <div>
        <dt>Results</dt>
        <dd>{briefing.results.length}</dd>
      </div>
    </dl>
  );
}
