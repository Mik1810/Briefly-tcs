import { FORMALIZATION_LABELS, PUBLICATION_LABELS, VERIFICATION_LABELS } from '../lib/content/labels.ts';
import { resultAnchor } from '../lib/content/repository.ts';
import type { Result } from '../lib/content/types.ts';
import { firstPdfUrl } from '../lib/pdf.ts';
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
  const pdf = firstPdfUrl(result.sources);
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
        {/* Azioni (src/lib/result-actions.ts): PDF è un link normale; Condividi compare solo se il browser offre
            il menu di condivisione; Copia link senza JavaScript è un link all'ancora. */}
        <p className="result-actions">
          <span className="copy-status" role="status"></span>
          {pdf ? (
            <a href={pdf} aria-label="Open the paper (PDF)" title="Open the paper (PDF)">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 12v6" />
                <path d="m9 15 3 3 3-3" />
              </svg>
            </a>
          ) : null}
          <button
            type="button"
            hidden
            data-share=""
            data-title={`${result.title} · Briefly.tcs`}
            data-href={`#${anchor}`}
            aria-label="Share this result"
            title="Share this result"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.6 13.5 6.8 4" />
              <path d="m15.4 6.5-6.8 4" />
            </svg>
          </button>
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
