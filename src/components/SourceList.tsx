import { SOURCE_KIND_LABELS } from '../lib/content/labels.ts';
import type { Source } from '../lib/content/types.ts';

interface Props {
  sources: Source[];
  headingId: string;
}

export default function SourceList({ sources, headingId }: Props) {
  return (
    <section className="sources" aria-labelledby={headingId}>
      <h3 id={headingId} className="small-heading">
        Fonti
      </h3>
      <ol>
        {sources.map((source, index) => (
          <li key={`${source.title}-${index}`}>
            <span className="source-kind">{SOURCE_KIND_LABELS[source.kind]}.</span>{' '}
            {source.authors.length > 0 ? <>{source.authors.join(', ')}, </> : null}
            {source.url ? (
              <a href={source.url} lang={source.lang}>
                <cite>{source.title}</cite>
              </a>
            ) : (
              <cite lang={source.lang}>{source.title}</cite>
            )}
            {source.venue ? <>, {source.venue}</> : null}
            {source.year ? <>, {source.year}</> : null}.
          </li>
        ))}
      </ol>
    </section>
  );
}
