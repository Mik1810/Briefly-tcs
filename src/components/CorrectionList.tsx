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
      <aside className="correction-notice" aria-label="Avviso di correzione">
        <p>
          <strong>Questo briefing è stato corretto</strong> in modo sostanziale dopo la pubblicazione.{' '}
          <a href="#correzioni">Leggi le correzioni</a>.
        </p>
      </aside>
    );
  }

  const titles = new Map(results.map((result) => [result.id, result.title]));
  return (
    <section className="corrections" id="correzioni" aria-labelledby="correzioni-titolo">
      <h2 id="correzioni-titolo" className="section-heading">
        Correzioni e aggiornamenti
      </h2>
      {corrections.length === 0 ? (
        <p>Nessuna correzione dalla pubblicazione.</p>
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
