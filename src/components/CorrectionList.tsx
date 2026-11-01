import { CORRECTION_KIND_LABELS } from '../lib/content/labels.ts';
import type { Correction, Result } from '../lib/content/types.ts';
import { resultAnchor } from '../lib/content/repository.ts';
import DateText from './DateText.tsx';

interface Props {
  corrections: Correction[];
  results: Result[];
  /** Variante in testa all'articolo: solo un avviso con rinvio all'elenco completo. */
  variant: 'notice' | 'full';
}

export default function CorrectionList({ corrections, results, variant }: Props) {
  if (variant === 'notice') {
    const substantial = corrections.filter((correction) => correction.kind === 'sostanziale');
    if (substantial.length === 0) return null;
    return (
      <aside className="correction-notice" aria-label="Correction notice">
        <p>
          <strong>This briefing has been substantively corrected</strong> since publication.{' '}
          <a href="#corrections">Read the corrections</a>.
        </p>
      </aside>
    );
  }

  const titles = new Map(results.map((result) => [result.id, result.title]));
  return (
    <section className="corrections" id="corrections" aria-labelledby="corrections-heading">
      <h2 id="corrections-heading" className="section-heading">
        Corrections and updates
      </h2>
      {corrections.length === 0 ? (
        <p>No corrections since publication.</p>
      ) : (
        <ol>
          {corrections.map((correction, index) => {
            const resultTitle = correction.resultId ? titles.get(correction.resultId) : undefined;
            return (
              <li key={`${correction.date}-${index}`}>
                <p className="meta">
                  <DateText date={correction.date} /> · {CORRECTION_KIND_LABELS[correction.kind]}
                  {correction.resultId && resultTitle ? (
                    <>
                      {' '}
                      · <a href={`#${resultAnchor({ id: correction.resultId })}`}>{resultTitle}</a>
                    </>
                  ) : null}
                </p>
                <p>{correction.text}</p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
