import { FORMALIZATION_LABELS, PUBLICATION_LABELS, VERIFICATION_LABELS } from '../lib/content/labels.ts';
import { resultAnchor } from '../lib/content/repository.ts';
import type { Result } from '../lib/content/types.ts';
import HtmlBody from './HtmlBody.tsx';
import SourceList from './SourceList.tsx';

interface Props {
  result: Result;
  /** Corpo già renderizzato in build. */
  bodyHtml: string;
  position: number;
}

export default function ResultSection({ result, bodyHtml, position }: Props) {
  const anchor = resultAnchor(result);
  const { status } = result;
  return (
    <section className="result" id={anchor} aria-labelledby={`${anchor}-heading`}>
      <p className="result-number">Result {position}</p>
      <h2 id={`${anchor}-heading`} className="result-title">
        {result.title}
      </h2>
      <dl className="result-meta">
        <div>
          <dt>Status</dt>
          <dd>
            {PUBLICATION_LABELS[status.publication]} · {FORMALIZATION_LABELS[status.formalization]} ·{' '}
            {VERIFICATION_LABELS[status.verification]}
          </dd>
        </div>
        {result.aiUse ? (
          <div>
            <dt>AI use</dt>
            <dd>{result.aiUse}</dd>
          </div>
        ) : null}
      </dl>
      <HtmlBody html={bodyHtml} />
      {/* Fonti a sinistra, azioni a destra sulla stessa fascia, senza separatore. */}
      <div className="result-foot">
        <SourceList sources={result.sources} headingId={`${anchor}-sources`} />
        {/* Senza JavaScript l'icona è un link all'ancora; con JavaScript copia l'indirizzo (src/lib/copy-link.ts). */}
        <p className="result-actions">
          <span className="copy-status" role="status"></span>
          <a
            href={`#${anchor}`}
            className="copy-link"
            data-copy-link=""
            aria-label="Copy link to this result"
            title="Copy link to this result"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
            </svg>
          </a>
        </p>
      </div>
    </section>
  );
}
