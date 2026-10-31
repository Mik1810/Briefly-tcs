// Markdown + formule → HTML, eseguito solo durante la build. Il browser riceve HTML e il CSS di KaTeX.
// Delimitatori: $…$ in linea, $$…$$ in blocco.
//
// Ordine della pipeline:
// 1. remark-rehype senza HTML grezzo: i tag scritti nel Markdown non vengono trasmessi;
// 2. rehype-sanitize prima di KaTeX: elimina attributi e protocolli pericolosi (es. href javascript:),
//    lasciando solo le classi che servono a riconoscere le formule;
// 3. rehype-katex sul testo già ripulito; il suo output è generato dalla libreria, non dall'autore;
// 4. le formule in blocco diventano regioni etichettate e raggiungibili da tastiera, così si scorrono
//    con le frecce quando sono più larghe dello schermo.

import type { Element, Root, RootContent } from 'hast';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [['className', /^language-./, 'math-inline', 'math-display']],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
  },
};

function isElement(node: RootContent | Root): node is Element {
  return node.type === 'element';
}

function rehypeFocusableMathBlocks() {
  const visit = (node: Root | RootContent) => {
    if (isElement(node)) {
      const classes = node.properties.className;
      if (Array.isArray(classes) && classes.includes('katex-display')) {
        node.tagName = 'div';
        node.properties.tabIndex = 0;
        node.properties.role = 'region';
        node.properties.ariaLabel = 'Formula in blocco';
        return;
      }
    }
    if ('children' in node) node.children.forEach(visit);
  };
  return (tree: Root) => visit(tree);
}

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeKatex, { strict: 'error', output: 'htmlAndMathml' })
  .use(rehypeFocusableMathBlocks)
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
