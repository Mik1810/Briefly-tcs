// Controlli sull'output generato in dist/, eseguiti da `npm run build` dopo astro build.
// Verifica ciò che il lettore riceverebbe: bozze assenti, metadati presenti, link interni validi,
// nessuna risorsa remota né JavaScript nelle pagine, a parte lo script facoltativo delle azioni dei risultati
// negli articoli. Stampa anche le misure delle risorse.
// Uscita con codice 1 al primo insieme di errori. Con Supabase le bozze non arrivano alla build (RLS):
// resta il controllo del marcatore.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import { loadValidatedContent, resultAnchor } from '../src/lib/content/repository.ts';
import { RESULT_ACTIONS_SCRIPT } from '../src/lib/result-actions.ts';
import { formatDate } from '../src/lib/dates.ts';

// Cartella da controllare: argomento facoltativo (scripts/build.ts passa dist-staging), altrimenti dist/.
const DIST = resolve(fileURLToPath(new URL('..', import.meta.url)), process.argv[2] ?? 'dist');
const DRAFT_MARKER = 'MARCATORE-BOZZA-NON-PUBBLICARE';
const TEXT_EXTENSIONS = ['.html', '.css', '.js', '.xml', '.txt', '.json', '.svg'];
// Termini dell'interfaccia italiana precedente e parole funzionali italiane: non devono comparire nel testo
// visibile, nei titoli, nelle meta description né nelle etichette di accessibilità (sito solo in inglese).
const ITALIAN_TERMS = [
  'contenuto', 'dimostrativo', 'pubblicato', 'aggiornato', 'periodo', 'coperto', 'argomenti', 'fonti', 'correzioni',
  'risultato', 'risultati', 'archivio', 'metodo', 'precedente', 'successivo', 'quotidiano', 'questo', 'della', 'delle',
  'degli', 'nessun', 'nessuna', 'pagina', 'ottobre', 'novembre', 'dicembre', 'gennaio', 'formula in blocco',
];
const ITALIAN_PATTERN = new RegExp(`\\b(${ITALIAN_TERMS.join('|')})\\b`, 'i');
// Etichette con cui il periodo coperto era (o potrebbe essere) mostrato nei metadati dell'articolo.
const COVERAGE_LABEL = /periodo coperto|coverage|covered|period/i;

/** Testo che il lettore vede o che le tecnologie assistive leggono, senza markup né MathML. */
function readableText(html: string): string {
  const attributes = [...html.matchAll(/\s(?:aria-label|alt|title)="([^"]*)"/g)].map((m) => m[1]);
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const body = html
    .replace(/<span class="katex-mathml">[\s\S]*?<\/math><\/span>/g, ' ')
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return [body, description, ...attributes].join(' ').replace(/&[a-z#0-9]+;/gi, ' ');
}

const problems: string[] = [];
const fail = (message: string) => problems.push(message);

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(DIST)) {
  console.error(`${DIST} non esiste: eseguire prima la build.`);
  process.exit(1);
}

const files = walk(DIST);
const rel = (path: string) => relative(DIST, path).split(sep).join('/');
const textFiles = new Map(
  files.filter((f) => TEXT_EXTENSIONS.some((ext) => f.endsWith(ext))).map((f) => [f, readFileSync(f, 'utf8')]),
);
const htmlFiles = [...textFiles.keys()].filter((f) => f.endsWith('.html'));

/** URL pubblico ("/archive/") → file in dist. */
function fileForPath(pathname: string): string | undefined {
  const candidates = pathname.endsWith('/')
    ? [join(DIST, pathname, 'index.html')]
    : [join(DIST, pathname), join(DIST, `${pathname}.html`)];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

function idsOf(html: string): Set<string> {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!));
}

const { source, raw } = await loadValidatedContent();
const published = raw.briefings.filter((b) => b.status === 'pubblicato');
const drafts = raw.briefings.filter((b) => b.status !== 'pubblicato');

// 1. Bozze: nessuna traccia in nessun file generato.
for (const [file, text] of textFiles) {
  if (text.includes(DRAFT_MARKER)) fail(`${rel(file)}: contiene il marcatore delle bozze`);
}
for (const draft of drafts) {
  if (existsSync(join(DIST, 'briefing', draft.date))) fail(`bozza ${draft.date}: pagina generata`);
  for (const [file, text] of textFiles) {
    if (text.includes(`/briefing/${draft.date}/`)) fail(`${rel(file)}: collega la bozza ${draft.date}`);
    if (text.includes(draft.title)) fail(`${rel(file)}: contiene il titolo della bozza ${draft.date}`);
    for (const result of draft.results) {
      if (text.includes(resultAnchor(result))) fail(`${rel(file)}: contiene il risultato in bozza ${result.id}`);
    }
  }
}

// 2. Argomenti eliminati il 2026-11-03: nessuna pagina /topics/ deve essere generata.
if (existsSync(join(DIST, 'topics'))) fail('topics/: pagine degli argomenti generate nonostante la rimozione');

// 3. Briefing pubblicati: pagina, date, ancore dei risultati, etichetta dimostrativa, presenza in archivio.
const archive = readFileSync(join(DIST, 'archive', 'index.html'), 'utf8');
for (const briefing of published) {
  const file = fileForPath(`/briefing/${briefing.date}/`);
  if (!file) {
    fail(`briefing ${briefing.date}: pagina mancante`);
    continue;
  }
  const html = textFiles.get(file) ?? '';
  // Data in <time datetime> con testo inglese leggibile, per esempio "October 29, 2026".
  const timeAttr = new RegExp(`<time datetime="${briefing.date}">${formatDate(briefing.date)}</time>`, 'i');
  if (!timeAttr.test(html)) fail(`briefing ${briefing.date}: manca <time datetime="${briefing.date}">${formatDate(briefing.date)}</time>`);
  if (briefing.updatedOn && !new RegExp(`<time datetime="${briefing.updatedOn}"`, 'i').test(html)) {
    fail(`briefing ${briefing.date}: data di aggiornamento non mostrata`);
  }
  if (briefing.demo && !html.includes('Demo content')) {
    fail(`briefing ${briefing.date}: manca l’etichetta "Demo content"`);
  }
  // Il periodo coperto resta nei dati ma non deve comparire nei metadati visibili dell'articolo.
  const meta = html.match(/<dl class="article-meta">[\s\S]*?<\/dl>/)?.[0];
  if (!meta || !meta.includes('<dt>Published</dt>')) {
    fail(`briefing ${briefing.date}: metadati dell’articolo assenti o non in inglese`);
  } else {
    if (COVERAGE_LABEL.test(meta)) fail(`briefing ${briefing.date}: i metadati mostrano un’etichetta di periodo coperto`);
    const shown = new Set([briefing.date, briefing.updatedOn]);
    for (const date of new Set([briefing.coverage.from, briefing.coverage.to])) {
      if (!shown.has(date) && new RegExp(`<time datetime="${date}"`, 'i').test(meta)) {
        fail(`briefing ${briefing.date}: i metadati mostrano la data del periodo coperto ${date}`);
      }
    }
  }
  const ids = idsOf(html);
  for (const result of briefing.results) {
    if (!ids.has(resultAnchor(result))) fail(`briefing ${briefing.date}: manca l’ancora del risultato ${result.id}`);
  }
  if (!archive.includes(`href="/briefing/${briefing.date}/"`)) fail(`briefing ${briefing.date}: assente dall’archivio`);
}
const generatedBriefings = existsSync(join(DIST, 'briefing')) ? readdirSync(join(DIST, 'briefing')) : [];
for (const date of generatedBriefings) {
  if (!published.some((b) => b.date === date)) fail(`briefing/${date}: pagina senza briefing pubblicato`);
}

// 4. Struttura di ogni pagina HTML, risorse locali e link interni.
const idCache = new Map<string, Set<string>>();
for (const file of htmlFiles) {
  const html = textFiles.get(file)!;
  const name = rel(file);
  if (!html.includes('<html lang="en">')) fail(`${name}: manca lang="en"`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${name}: manca la meta description`);
  const italian = readableText(html).match(ITALIAN_PATTERN);
  if (italian) fail(`${name}: testo visibile non inglese ("${italian[0]}")`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${name}: manca <title>`);
  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1 !== 1) fail(`${name}: ${h1} elementi h1 invece di 1`);
  // Unico script ammesso: le azioni dei risultati nelle pagine articolo (src/lib/result-actions.ts), inline e identico.
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const allowed = name.startsWith('briefing/') && script[1]!.trim() === '' && script[2] === RESULT_ACTIONS_SCRIPT;
    if (!allowed) fail(`${name}: contiene uno <script> non ammesso`);
  }
  if (/<(link|script|img|iframe|source)\b[^>]*\s(href|src)="(https?:)?\/\//i.test(html)) {
    fail(`${name}: carica una risorsa remota`);
  }

  for (const match of html.matchAll(/\shref="([^"]*)"/g)) {
    const href = match[1]!;
    if (/^(https:|mailto:|data:)/.test(href)) continue;
    if (/^http:/.test(href)) {
      fail(`${name}: link non https ${href}`);
      continue;
    }
    const [pathPart, hash] = href.split('#') as [string, string | undefined];
    const target = pathPart === '' ? file : fileForPath(pathPart);
    if (!target) {
      fail(`${name}: link interno rotto ${href}`);
      continue;
    }
    if (hash && target.endsWith('.html')) {
      let ids = idCache.get(target);
      if (!ids) {
        ids = idsOf(textFiles.get(target) ?? '');
        idCache.set(target, ids);
      }
      if (!ids.has(decodeURIComponent(hash))) fail(`${name}: ancora mancante ${href}`);
    }
  }
}
for (const [file, text] of textFiles) {
  if (file.endsWith('.css') && /@import|url\(\s*["']?(https?:)?\/\//i.test(text)) {
    fail(`${rel(file)}: il CSS importa risorse remote`);
  }
}

// 5. Misure. Non sono soglie: servono al report e al confronto con il budget del piano.
const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`;
const sizeOf = (paths: string[]) => paths.reduce((sum, p) => sum + statSync(p).size, 0);
const gzipOf = (paths: string[]) => paths.reduce((sum, p) => sum + gzipSync(readFileSync(p)).length, 0);
function pageWeight(pathname: string) {
  const file = fileForPath(pathname)!;
  const html = textFiles.get(file)!;
  const css = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => join(DIST, m[1]!));
  return `${pathname}: HTML ${kb(sizeOf([file]))} (gzip ${kb(gzipOf([file]))}), CSS ${kb(sizeOf(css))} (gzip ${kb(gzipOf(css))}) in ${css.length} file`;
}
const fonts = files.filter((f) => /\.(woff2?|ttf)$/.test(f));
const woff2 = fonts.filter((f) => f.endsWith('.woff2'));
const js = files.filter((f) => f.endsWith('.js'));

console.log(`\ncheck-dist — sorgente dei contenuti: ${source.logLabel} (${source.description})`);
console.log(`  ${htmlFiles.length} pagine HTML, ${published.length} briefing pubblicati, ${drafts.length} bozze escluse`);
for (const pathname of ['/', '/archive/', ...published.map((b) => `/briefing/${b.date}/`)]) {
  console.log(`  ${pageWeight(pathname)}`);
}
console.log(`  Font KaTeX: ${woff2.length} woff2 per ${kb(sizeOf(woff2))}; totale con woff/ttf di ripiego ${kb(sizeOf(fonts))}`);
console.log(`  File JS in dist (non collegati da alcuna pagina): ${js.length ? js.map((f) => `${rel(f)} ${kb(sizeOf([f]))}`).join(', ') : 'nessuno'}`);
console.log(`  Totale dist: ${kb(sizeOf(files))} in ${files.length} file`);

if (problems.length > 0) {
  console.error(`\ncheck-dist: ${problems.length} problemi\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('check-dist: nessun problema trovato.\n');
