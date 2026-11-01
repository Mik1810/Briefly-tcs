import assert from 'node:assert/strict';
import { test } from 'node:test';

import { renderInlineMath, renderMarkdown } from '../src/lib/markdown.ts';

test('titoli delle fonti: formule $…$ con KaTeX, testo solo escapato, $ spaiato lasciato com’è', () => {
  const html = renderInlineMath('Maximum Cardinality Matching in $n^{2+o(1)}$ Time', 'fonte');
  assert.match(html, /^Maximum Cardinality Matching in <span class="katex">/);
  assert.match(html, /<math/);
  assert.doesNotMatch(html, /\$/);
  assert.equal(renderInlineMath('A <b>bold</b> & costs $5', 'fonte'), 'A &lt;b&gt;bold&lt;/b&gt; &amp; costs $5');
  assert.throws(() => renderInlineMath('Bad $\\frac{1}{$ title', 'fonte X'), /fonte X/);
});

test('una formula non valida interrompe la build indicando dove', () => {
  assert.throws(() => renderMarkdown('$$\n\\frac{1}{\n$$', 'briefing X › risultato y'), /briefing X › risultato y/);
  assert.throws(() => renderMarkdown('Comando $\\nonesiste{x}$', 'qui'), /Undefined control sequence/);
});

test('le formule diventano HTML con MathML accessibile, senza JavaScript', () => {
  const html = renderMarkdown('Costo $O(n \\log n)$.', 'qui');
  assert.match(html, /class="katex"/);
  assert.match(html, /<math/);
  assert.doesNotMatch(html, /<script/);
});

test('l’HTML grezzo nel Markdown non arriva alla pagina', () => {
  const html = renderMarkdown('Testo <script>alert(1)</script> <b>grassetto</b>', 'qui');
  assert.doesNotMatch(html, /<script|<b>/);
});

test('i link con protocolli pericolosi perdono l’href; quelli sicuri restano', () => {
  const html = renderMarkdown(
    '[a](javascript:alert%281%29) [b](JaVaScRiPt:alert(1)) [c](data:text/html,x) [d](/method/) [e](#result-x) [f](https://example.org)',
    'qui',
  );
  assert.doesNotMatch(html, /javascript:|data:/i);
  assert.match(html, /href="\/method\/"/);
  assert.match(html, /href="#result-x"/);
  assert.match(html, /href="https:\/\/example\.org"/);
});

test('le formule in blocco sono regioni etichettate raggiungibili da tastiera', () => {
  const html = renderMarkdown('Testo.\n\n$$\nn^2\n$$', 'qui');
  assert.match(html, /<div class="katex-display" tabindex="0" role="region" aria-label="Display formula">/);
  // Le formule in linea restano nel flusso del testo, senza tabindex.
  assert.doesNotMatch(renderMarkdown('In linea $n^2$.', 'qui'), /tabindex/);
});
