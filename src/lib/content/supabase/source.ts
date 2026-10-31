// Sorgente Supabase: legge i contenuti dall'API REST (PostgREST) dello stack locale durante la build.
// Nessun SDK e nessuna chiave privilegiata: la chiave publishable agisce come ruolo anon, quindi le
// policy RLS restituiscono solo i briefing pubblicati e ciò che ne dipende. Le bozze non lasciano il database.
// Qualunque errore interrompe la build: non esiste alcun ripiego sulle fixture.

import { existsSync } from 'node:fs';

import type { ContentSource } from '../source.ts';
import type { Briefing, Correction, RawContent, Result, Source, Topic } from '../types.ts';

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
  result_topics: { topic_slug: string }[];
  sources: SourceRow[];
}

interface BriefingRow {
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

const BRIEFING_SELECT = [
  'date,status,demo,title,summary,coverage_from,coverage_to,updated_on,intro,ai_disclosure',
  'results(id,title,summary,body,publication,formalization,verification,' +
    'result_topics(topic_slug),sources(title,authors,year,venue,url,kind,lang))',
  'corrections(date,kind,text,result_id)',
].join(',');

const BRIEFING_ORDER = {
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
    })),
    corrections: (row.corrections ?? []).map((correction) => ({
      date: correction.date,
      kind: correction.kind,
      text: correction.text,
      resultId: optional(correction.result_id),
    })),
  };
}

interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

/** Legge URL e chiave da process.env, caricando .env se presente. Errore esplicito se mancano. */
export function readSupabaseConfig(): SupabaseConfig {
  if ((!process.env.TCS_SUPABASE_URL || !process.env.TCS_SUPABASE_PUBLISHABLE_KEY) && existsSync('.env')) {
    process.loadEnvFile('.env');
  }
  const url = process.env.TCS_SUPABASE_URL;
  const publishableKey = process.env.TCS_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      'Configurazione Supabase mancante: servono TCS_SUPABASE_URL e TCS_SUPABASE_PUBLISHABLE_KEY ' +
        '(generare .env con `npm run db:env` a stack avviato).',
    );
  }
  const { hostname } = new URL(url);
  if (hostname !== '127.0.0.1' && hostname !== 'localhost') {
    throw new Error(`TCS_SUPABASE_URL deve puntare allo stack locale, non a ${hostname}.`);
  }
  return { url: url.replace(/\/+$/, ''), publishableKey };
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
    throw new Error(
      `Database Supabase locale non raggiungibile su ${config.url} (${reason}). ` +
        'Avviare lo stack con `npm run db:start`. La build si interrompe senza usare le fixture.',
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
    description: 'database Supabase locale (lettura anonima, solo contenuti pubblicati)',
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
