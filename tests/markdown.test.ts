import assert from 'node:assert/strict';
import { test } from 'node:test';

import { renderMarkdown } from '../src/lib/markdown.ts';

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
