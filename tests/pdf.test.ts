import assert from 'node:assert/strict';
import { test } from 'node:test';

import { firstPdfUrl, pdfUrl } from '../src/lib/pdf.ts';

test('link al PDF ricavato da arXiv, ECCC e URL .pdf; nessun link negli altri casi', () => {
  assert.equal(pdfUrl({ url: 'https://arxiv.org/abs/2610.39753v1' }), 'https://arxiv.org/pdf/2610.39753v1');
  assert.equal(pdfUrl({ url: 'https://arxiv.org/html/2610.42012v1' }), 'https://arxiv.org/pdf/2610.42012v1');
  assert.equal(pdfUrl({ url: 'https://arxiv.org/html/2610.42012v1/' }), 'https://arxiv.org/pdf/2610.42012v1');
  assert.equal(pdfUrl({ url: 'https://arxiv.org/pdf/2610.42012v1.pdf' }), 'https://arxiv.org/pdf/2610.42012v1');
  assert.equal(
    pdfUrl({ url: 'https://eccc.weizmann.ac.il/report/2026/291/download' }),
    'https://eccc.weizmann.ac.il/report/2026/291/download/',
  );
  assert.equal(pdfUrl({ url: 'https://eccc.weizmann.ac.il/report/2026/291/' }), 'https://eccc.weizmann.ac.il/report/2026/291/download/');
  assert.equal(pdfUrl({ url: 'https://example.org/paper.PDF' }), 'https://example.org/paper.PDF');
  assert.equal(pdfUrl({ url: 'https://doi.org/10.1145/28869.28874' }), undefined);
  assert.equal(pdfUrl({ url: 'http://arxiv.org/abs/2610.39753' }), undefined);
  assert.equal(pdfUrl({}), undefined);
});

test('il PDF del risultato è quello della prima fonte che ne ha uno', () => {
  assert.equal(
    firstPdfUrl([{ url: 'https://doi.org/10.1/x' }, { url: 'https://arxiv.org/abs/2611.00001' }]),
    'https://arxiv.org/pdf/2611.00001',
  );
  assert.equal(firstPdfUrl([{ url: 'https://doi.org/10.1/x' }]), undefined);
});
