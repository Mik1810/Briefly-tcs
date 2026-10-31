// Genera supabase/seed.sql dalle fixture dimostrative, così database locale e modalità fixture
// contengono gli stessi tre briefing dimostrativi e la stessa bozza di controllo.
// Uso: npm run db:seed:generate (poi npm run db:reset per applicarlo all'istanza locale).

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { briefings } from '../src/lib/content/fixtures/briefings.ts';
import { topics } from '../src/lib/content/fixtures/topics.ts';
import { assertValidContent } from '../src/lib/content/validate.ts';

assertValidContent({ topics, briefings });

type Value = string | number | boolean | null | undefined | string[];

function literal(value: Value): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) return value.length ? `array[${value.map(literal).join(', ')}]` : `'{}'::text[]`;
  return `'${value.replaceAll("'", "''")}'`;
}

function insert(table: string, rows: Record<string, Value>[]): string {
  if (rows.length === 0) return '';
  const columns = Object.keys(rows[0]!);
  const values = rows.map((row) => `  (${columns.map((column) => literal(row[column])).join(', ')})`);
  return `insert into public.${table} (${columns.join(', ')}) values\n${values.join(',\n')};\n`;
}

const results = briefings.flatMap((b) => b.results.map((r, position) => ({ b, r, position })));

const sql = [
  '-- GENERATO da scripts/generate-seed.ts a partire da src/lib/content/fixtures/. Non modificare a mano.',
  '-- Solo contenuti dimostrativi: risultati classici da manuale e una bozza di controllo.',
  '',
  insert(
    'topics',
    topics.map((t, position) => ({ slug: t.slug, name: t.name, description: t.description, position })),
  ),
  insert(
    'briefings',
    briefings.map((b) => ({
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
  ),
  insert(
    'results',
    results.map(({ b, r, position }) => ({
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
  ),
  insert(
    'result_topics',
    results.flatMap(({ r }) => r.topics.map((slug, position) => ({ result_id: r.id, topic_slug: slug, position }))),
  ),
  insert(
    'sources',
    results.flatMap(({ r }) =>
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
  ),
  insert(
    'corrections',
    briefings.flatMap((b) =>
      b.corrections.map((c, position) => ({
        briefing_date: b.date,
        position,
        date: c.date,
        kind: c.kind,
        text: c.text,
        result_id: c.resultId,
      })),
    ),
  ),
].join('\n');

const target = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url));
writeFileSync(target, sql);
console.log(`Scritto ${target}: ${briefings.length} briefing, ${results.length} risultati.`);
