import { FORMALIZATION_LABELS, PUBLICATION_LABELS, VERIFICATION_LABELS } from '../lib/content/labels.ts';
import { resultAnchor } from '../lib/content/repository.ts';
import type { Result, Topic } from '../lib/content/types.ts';
import HtmlBody from './HtmlBody.tsx';
import SourceList from './SourceList.tsx';
import TopicLinks from './TopicLinks.tsx';

interface Props {
  result: Result;
  topics: Topic[];
  /** Corpo già renderizzato in build. */
  bodyHtml: string;
  position: number;
}

export default function ResultSection({ result, topics, bodyHtml, position }: Props) {
  const anchor = resultAnchor(result);
  const { status } = result;
  return (
    <section className="result" id={anchor} aria-labelledby={`${anchor}-titolo`}>
      <p className="result-number">Risultato {position}</p>
      <h2 id={`${anchor}-titolo`} className="result-title">
        {result.title}
      </h2>
      <dl className="result-meta">
        <div>
          <dt>Stato</dt>
          <dd>
            {PUBLICATION_LABELS[status.publication]} · {FORMALIZATION_LABELS[status.formalization]} ·{' '}
            {VERIFICATION_LABELS[status.verification]}
          </dd>
        </div>
        <div>
          <dt>Argomenti</dt>
          <dd>
            <TopicLinks topics={topics} />
          </dd>
        </div>
      </dl>
      <HtmlBody html={bodyHtml} />
      <SourceList sources={result.sources} headingId={`${anchor}-fonti`} />
      <p className="permalink">
        <a href={`#${anchor}`}>Link a questo risultato</a>
      </p>
    </section>
  );
}
