// Link al PDF di una fonte, ricavato dall'URL citato, per l'icona "Open PDF" di ogni risultato.
// Solo casi certi: arXiv (abs/html → pdf), ECCC (pagina del report → download), URL che finiscono in .pdf.
// Negli altri casi nessun link: meglio nessuna icona che un link sbagliato.

import type { Source } from './content/types.ts';

const ARXIV = /^https:\/\/arxiv\.org\/(?:abs|html|pdf)\/([^?#]+?)(?:\.pdf)?\/?$/;
const ECCC = /^https:\/\/eccc\.weizmann\.ac\.il\/report\/(\d{4})\/(\d+)(?:\/download)?\/?$/;

export function pdfUrl(source: Pick<Source, 'url'>): string | undefined {
  const url = source.url;
  if (!url) return undefined;
  const arxiv = ARXIV.exec(url);
  if (arxiv) return `https://arxiv.org/pdf/${arxiv[1]}`;
  const eccc = ECCC.exec(url);
  if (eccc) return `https://eccc.weizmann.ac.il/report/${eccc[1]}/${eccc[2]}/download/`;
  if (/^https:\/\/[^?#]+\.pdf$/i.test(url)) return url;
  return undefined;
}

/** PDF della prima fonte che ne ha uno. */
export function firstPdfUrl(sources: Pick<Source, 'url'>[]): string | undefined {
  for (const source of sources) {
    const url = pdfUrl(source);
    if (url) return url;
  }
  return undefined;
}
