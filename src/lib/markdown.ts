// Markdown + formule → HTML, eseguito solo durante la build. Il browser riceve HTML e il CSS di KaTeX.
// Delimitatori: $…$ in linea, $$…$$ in blocco. L'HTML grezzo nel Markdown non viene trasmesso.

import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex, { strict: 'error', output: 'htmlAndMathml' })
  .use(rehypeStringify);

/**
 * Restituisce l'HTML del testo. Un errore di formula interrompe la build:
 * rehype-katex segnala gli errori come messaggi invece di eccezioni, quindi li controlliamo.
 */
export function renderMarkdown(source: string, where: string): string {
  const file = processor.processSync(source);
  if (file.messages.length > 0) {
    const details = file.messages.map((message) => {
      const place = message.line != null ? `riga ${message.line}, colonna ${message.column}: ` : '';
      const cause = message.cause instanceof Error ? ` — ${message.cause.message}` : '';
      return `  ${place}${message.reason}${cause}`;
    });
    throw new Error(`Formula o Markdown non validi in ${where}:\n${details.join('\n')}`);
  }
  return String(file);
}
