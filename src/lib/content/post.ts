// Formato dei post scritti dal task ChatGPT su GitHub (posts/YYYY-MM-DD.json) e loro conversione nel
// modello editoriale. Il file contiene solo ciò che l'autore decide; il publisher impone il resto:
// stato pubblicato, nessun demo, verifica "solo controllo automatico", dichiarazione AI fissa, nessuna correzione.
// Valori pubblici in inglese nel file, convertiti nei valori interni (italiani) dello schema.
//
// Campi concordati con l'utente il 2026-11-01 (sessione 2026-11-01_13-54-23): un briefing al giorno, stati
// scientifici mantenuti. Il periodo coperto resta nel DB ma non va scritto né mostrato: se assente vale "ieri".
// Gli argomenti sono accantonati: il post non li contiene e il lettore non li vede.

import { isIsoDate } from '../dates.ts';
import type {
  Briefing,
  FormalizationStatus,
  PublicationStatus,
  Result,
  Source,
  SourceKind,
} from './types.ts';

export const POST_FORMAT = 'briefly-post/1';

export const AUTOMATED_DISCLOSURE =
  'Written by an AI model (ChatGPT) from the cited sources and published automatically after structural checks. ' +
  'No human editor or independent expert has verified the mathematics; rely on the primary sources.';

const PUBLICATION: Record<string, PublicationStatus> = {
  'classic-result': 'risultato-classico',
  preprint: 'preprint',
  accepted: 'accettato',
  published: 'pubblicato',
};

const FORMALIZATION: Record<string, FormalizationStatus> = {
  'not-stated': 'non-indicata',
  formalized: 'formalizzato',
};

const SOURCE_KIND: Record<string, SourceKind> = {
  book: 'libro',
  article: 'articolo',
  preprint: 'preprint',
  'web-page': 'pagina-web',
};

const POST_KEYS = ['format', 'date', 'title', 'summary', 'intro', 'coverage', 'results'];
const RESULT_KEYS = ['id', 'title', 'summary', 'publication', 'formalization', 'body', 'sources'];
const SOURCE_KEYS = ['title', 'authors', 'year', 'venue', 'url', 'kind', 'lang'];

export class PostFormatError extends Error {
  readonly problems: string[];

  constructor(file: string, problems: string[]) {
    super(`Post non valido ${file} (${problems.length}):\n- ${problems.join('\n- ')}`);
    this.name = 'PostFormatError';
    this.problems = problems;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function previousDay(isoDate: string): string {
  const day = new Date(`${isoDate}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() - 1);
  return day.toISOString().slice(0, 10);
}

/** Slug ASCII da un titolo, al massimo 60 caratteri e senza trattini ai bordi. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '');
}

/**
 * Converte il JSON di un post in un briefing. Controlla solo forma e vocabolari del formato:
 * la validazione editoriale completa (argomenti, fonti, testo semplice) resta in validate.ts.
 * `takenIds` sono gli id di risultato già pubblicati: un id derivato dal titolo che collide riceve la data.
 */
export function postToBriefing(file: string, raw: unknown, takenIds: ReadonlySet<string> = new Set()): Briefing {
  const problems: string[] = [];
  const unknownKeys = (path: string, value: Record<string, unknown>, allowed: string[]) => {
    for (const key of Object.keys(value)) if (!allowed.includes(key)) problems.push(`${path}.${key}: campo non previsto`);
  };
  const mapped = <T>(path: string, table: Record<string, T>, value: unknown): T => {
    if (typeof value === 'string' && Object.hasOwn(table, value)) return table[value]!;
    problems.push(`${path}: valore ${JSON.stringify(value)} non ammesso (ammessi: ${Object.keys(table).join(', ')})`);
    return undefined as T;
  };

  if (!isRecord(raw)) throw new PostFormatError(file, ['il file deve contenere un oggetto JSON']);
  unknownKeys('post', raw, POST_KEYS);
  if (raw.format !== POST_FORMAT) problems.push(`post.format: atteso "${POST_FORMAT}"`);
  if (!isIsoDate(raw.date)) problems.push('post.date: atteso YYYY-MM-DD esistente');
  const expectedName = `${String(raw.date)}.json`;
  if (!file.endsWith(`/${expectedName}`) && file !== expectedName) {
    problems.push(`post.date: il file deve chiamarsi ${expectedName}`);
  }
  const date = raw.date as string;
  const yesterday = isIsoDate(date) ? previousDay(date) : undefined;
  const coverage = isRecord(raw.coverage) ? raw.coverage : { from: yesterday, to: yesterday };
  if (isRecord(raw.coverage)) unknownKeys('post.coverage', raw.coverage, ['from', 'to']);

  const ids = new Set<string>();
  const results: Result[] = (Array.isArray(raw.results) ? raw.results : []).map((result: unknown, i) => {
    const path = `post.results[${i}]`;
    if (!isRecord(result)) {
      problems.push(`${path}: risultato non valido`);
      return undefined as unknown as Result;
    }
    unknownKeys(path, result, RESULT_KEYS);
    let id = typeof result.id === 'string' ? result.id : slugify(String(result.title ?? ''));
    if (result.id === undefined && takenIds.has(id)) id = `${id}-${date}`;
    if (ids.has(id)) problems.push(`${path}.id: id "${id}" ripetuto nel post`);
    if (takenIds.has(id)) problems.push(`${path}.id: id "${id}" già pubblicato`);
    ids.add(id);

    const sources: Source[] = (Array.isArray(result.sources) ? result.sources : []).map((source: unknown, k) => {
      const sPath = `${path}.sources[${k}]`;
      if (!isRecord(source)) {
        problems.push(`${sPath}: fonte non valida`);
        return undefined as unknown as Source;
      }
      unknownKeys(sPath, source, SOURCE_KEYS);
      return {
        title: source.title as string,
        authors: source.authors as string[],
        year: source.year as number | undefined,
        venue: source.venue as string | undefined,
        url: source.url as string | undefined,
        kind: mapped(`${sPath}.kind`, SOURCE_KIND, source.kind),
        lang: source.lang as string | undefined,
      };
    });

    return {
      id,
      title: result.title as string,
      summary: result.summary as string,
      topics: [],
      status: {
        publication: mapped(`${path}.publication`, PUBLICATION, result.publication),
        formalization: mapped(`${path}.formalization`, FORMALIZATION, result.formalization ?? 'not-stated'),
        verification: 'controllo-automatico',
      },
      body: result.body as string,
      sources,
    };
  });

  if (problems.length > 0) throw new PostFormatError(file, problems);
  return {
    date,
    status: 'pubblicato',
    demo: false,
    title: raw.title as string,
    summary: raw.summary as string,
    coverage: { from: coverage.from as string, to: coverage.to as string },
    intro: raw.intro as string | undefined,
    results,
    corrections: [],
    aiDisclosure: AUTOMATED_DISCLOSURE,
  };
}
