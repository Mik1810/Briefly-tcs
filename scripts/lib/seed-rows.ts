// Righe del database per tabella, derivate da topics e briefing del dominio.
// Usato da generate-seed.ts (seed per nuovi avvii) e da translate-demo-db.ts (confronto e aggiornamento mirato).

import type { Briefing, Topic } from '../../src/lib/content/types.ts';

export type Value = string | number | boolean | null | undefined | string[];
export type Row = Record<string, Value>;

export interface SeedRows {
  topics: Row[];
  briefings: Row[];
  results: Row[];
  result_topics: Row[];
  sources: Row[];
  corrections: Row[];
}

export function seedRows(topics: Topic[], briefings: Briefing[]): SeedRows {
  const results = briefings.flatMap((b) => b.results.map((r, position) => ({ b, r, position })));
  return {
    topics: topics.map((t, position) => ({ slug: t.slug, name: t.name, description: t.description, position })),
    briefings: briefings.map((b) => ({
      date: b.date,
      status: b.status,
      demo: b.demo,
      title: b.title,
      summary: b.summary,
      coverage_from: b.coverage.from,
      coverage_to: b.coverage.to,
      updated_on: b.updatedOn,
      intro: b.intro,
      ai_disclosure: b.aiDisclosure,
    })),
    results: results.map(({ b, r, position }) => ({
      id: r.id,
      briefing_date: b.date,
      position,
      title: r.title,
      summary: r.summary,
      body: r.body,
      publication: r.status.publication,
      formalization: r.status.formalization,
      verification: r.status.verification,
    })),
    result_topics: results.flatMap(({ r }) =>
      r.topics.map((slug, position) => ({ result_id: r.id, topic_slug: slug, position })),
    ),
    sources: results.flatMap(({ r }) =>
      r.sources.map((s, position) => ({
        result_id: r.id,
        position,
        title: s.title,
        authors: s.authors,
        year: s.year,
        venue: s.venue,
        url: s.url,
        kind: s.kind,
        lang: s.lang,
      })),
    ),
    corrections: briefings.flatMap((b) =>
      b.corrections.map((c, position) => ({
        briefing_date: b.date,
        position,
        date: c.date,
        kind: c.kind,
        text: c.text,
        result_id: c.resultId,
      })),
    ),
  };
}

export function sqlLiteral(value: Value): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) return value.length ? `array[${value.map(sqlLiteral).join(', ')}]` : `'{}'::text[]`;
  return `'${value.replaceAll("'", "''")}'`;
}
