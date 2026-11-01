import { SOURCE_KIND_LABELS } from '../lib/content/labels.ts';
import type { Source } from '../lib/content/types.ts';
import { renderInlineMath } from '../lib/markdown.ts';

interface Props {
  sources: Source[];
  headingId: string;
}

export default function SourceList({ sources, headingId }: Props) {
  return (
    <section className="sources" aria-labelledby={headingId}>
      <h3 id={headingId} className="small-heading">
        Sources
      </h3>
      <ol>
        {sources.map((source, index) => {
          // HTML generato solo da testo escapato e da KaTeX (renderInlineMath), mai dall'autore.
          const title = <cite dangerouslySetInnerHTML={{ __html: renderInlineMath(source.title, `fonte "${source.title}"`) }} />;
          return (
          <li key={`${source.title}-${index}`}>
            <span className="source-kind">{SOURCE_KIND_LABELS[source.kind]}.</span>{' '}
            {source.authors.length > 0 ? <>{source.authors.join(', ')}, </> : null}
            {source.url ? (
              <a href={source.url} lang={source.lang}>
                {title}
              </a>
            ) : (
              <span lang={source.lang}>{title}</span>
            )}
            {source.venue ? <>, {source.venue}</> : null}
            {source.year ? <>, {source.year}</> : null}.
          </li>
          );
        })}
      </ol>
    </section>
  );
}
