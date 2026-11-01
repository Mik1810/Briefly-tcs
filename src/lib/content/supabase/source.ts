// Sorgente Supabase: legge i contenuti dall'API REST (PostgREST) durante la build, dallo stack locale
// o dal progetto cloud secondo la configurazione (config.ts).
// Nessun SDK e nessuna chiave privilegiata: la chiave publishable agisce come ruolo anon, quindi le
// policy RLS restituiscono solo i briefing pubblicati e ciò che ne dipende. Le bozze non lasciano il database.
// Qualunque errore interrompe la build: non esiste alcun ripiego sulle fixture.

import type { ContentSource } from '../source.ts';
import type { Briefing, Correction, RawContent, Result, Source, Topic } from '../types.ts';
import type { SupabaseConfig } from './config.ts';

const TIMEOUT_MS = 10_000;

interface TopicRow {
  slug: string;
  name: string;
  description: string;
}

interface SourceRow {
  title: string;
  authors: string[];
  year: number | null;
  venue: string | null;
  url: string | null;
  kind: Source['kind'];
  lang: string | null;
}

interface ResultRow {
  id: string;
  title: string;
  summary: string;
  body: string;
  publication: Result['status']['publication'];
  formalization: Result['status']['formalization'];
  verification: Result['status']['verification'];
  ai_use: string | null;
  result_topics: { topic_slug: string }[];
  sources: SourceRow[];
}

export interface BriefingRow {
  date: string;
  status: Briefing['status'];
  demo: boolean;
  title: string;
  summary: string;
  coverage_from: string;
  coverage_to: string;
  updated_on: string | null;
  intro: string | null;
  ai_disclosure: string;
  results: ResultRow[];
  corrections: { date: string; kind: Correction['kind']; text: string; result_id: string | null }[];
}

export const BRIEFING_SELECT = [
  'date,status,demo,title,summary,coverage_from,coverage_to,updated_on,intro,ai_disclosure',
  'results(id,title,summary,body,publication,formalization,verification,ai_use,' +
    'result_topics(topic_slug),sources(title,authors,year,venue,url,kind,lang))',
  'corrections(date,kind,text,result_id)',
].join(',');

export const BRIEFING_ORDER = {
  order: 'date.desc',
  'results.order': 'position',
  'results.result_topics.order': 'position',
  'results.sources.order': 'position',
  'corrections.order': 'position',
};

/** Restituisce `undefined` al posto di `null`, come nel modello del dominio. */
const optional = <T>(value: T | null): T | undefined => value ?? undefined;

export function mapBriefingRow(row: BriefingRow): Briefing {
  return {
    date: row.date,
    status: row.status,
    demo: row.demo,
    title: row.title,
    summary: row.summary,
    coverage: { from: row.coverage_from, to: row.coverage_to },
    updatedOn: optional(row.updated_on),
    intro: optional(row.intro),
    aiDisclosure: row.ai_disclosure,
    results: (row.results ?? []).map((result) => ({
      id: result.id,
      title: result.title,
      summary: result.summary,
      body: result.body,
      status: {
        publication: result.publication,
        formalization: result.formalization,
        verification: result.verification,
      },
      topics: (result.result_topics ?? []).map((topic) => topic.topic_slug),
      sources: (result.sources ?? []).map((source) => ({
        title: source.title,
        authors: source.authors,
        year: optional(source.year),
        venue: optional(source.venue),
        url: optional(source.url),
        kind: source.kind,
        lang: optional(source.lang),
      })),
      aiUse: optional(result.ai_use ?? null),
    })),
    corrections: (row.corrections ?? []).map((correction) => ({
      date: correction.date,
      kind: correction.kind,
      text: correction.text,
      resultId: optional(correction.result_id),
    })),
  };
}

async function getRows<T>(config: SupabaseConfig, table: string, params: Record<string, string>): Promise<T[]> {
  const url = `${config.url}/rest/v1/${table}?${new URLSearchParams(params)}`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { apikey: config.publishableKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const reason = error instanceof Error ? (error.cause instanceof Error ? error.cause.message : error.message) : String(error);
    const hint =
      config.target === 'local' ? 'Avviare lo stack con `npm run db:start`.' : 'Verificare la rete e TCS_SUPABASE_URL.';
    throw new Error(
      `Database Supabase ${config.target === 'local' ? 'locale' : 'cloud'} non raggiungibile su ${config.url} (${reason}). ` +
        `${hint} La build si interrompe senza usare le fixture.`,
    );
  }
  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    throw new Error(`Lettura di "${table}" da Supabase fallita: HTTP ${response.status} ${body}`);
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error(`Risposta inattesa per "${table}": atteso un elenco.`);
  return data as T[];
}

export function createSupabaseSource(config: SupabaseConfig): ContentSource {
  return {
    kind: 'supabase',
    description: `${config.target === 'local' ? 'local' : 'hosted'} Supabase database (anonymous read, published content only)`,
    logLabel: `Supabase ${config.target} (${new URL(config.url).host})`,
    load: async (): Promise<RawContent> => {
      const [topicRows, briefingRows] = await Promise.all([
        getRows<TopicRow>(config, 'topics', { select: 'slug,name,description', order: 'position' }),
        getRows<BriefingRow>(config, 'briefings', { select: BRIEFING_SELECT, ...BRIEFING_ORDER }),
      ]);
      const topics: Topic[] = topicRows.map(({ slug, name, description }) => ({ slug, name, description }));
      return { topics, briefings: briefingRows.map(mapBriefingRow) };
    },
  };
}
