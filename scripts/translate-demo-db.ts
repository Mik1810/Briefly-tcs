// Aggiorna i demo del database locale dalla versione italiana a quella inglese, SENZA reset.
// Uso:
//   node scripts/translate-demo-db.ts            confronto a vuoto, non scrive nulla
//   node scripts/translate-demo-db.ts --apply    aggiorna solo le righe riconosciute
//
// Una riga è "riconosciuta" se, nel database, coincide in tutte le colonne con la baseline italiana
// (copia delle fixture di partenza in .local/it-baseline/, ignorata da Git). Solo quelle vengono aggiornate,
// in un'unica istruzione SQL (atomica) i cui WHERE ripetono l'intera riga italiana: se nel frattempo
// qualcuno la modifica, l'aggiornamento non la tocca. Righe diverse, aggiunte o mancanti vengono preservate
// e segnalate. Nessuna modifica di schema; chiavi, date, stati e relazioni non cambiano.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { briefings as englishBriefings } from '../src/lib/content/fixtures/briefings.ts';
import { topics as englishTopics } from '../src/lib/content/fixtures/topics.ts';
import type { Briefing, Topic } from '../src/lib/content/types.ts';
import { assertValidContent } from '../src/lib/content/validate.ts';
import { type Row, type SeedRows, seedRows, sqlLiteral, type Value } from './lib/seed-rows.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASELINE = join(ROOT, '.local', 'it-baseline');
const apply = process.argv.includes('--apply');

if (!existsSync(join(BASELINE, 'briefings.ts')) || !existsSync(join(BASELINE, 'topics.ts'))) {
  console.error(`Baseline italiana assente in ${BASELINE}: impossibile riconoscere i demo. Nessuna modifica.`);
  process.exit(1);
}
const italian = {
  briefings: ((await import(pathToFileURL(join(BASELINE, 'briefings.ts')).href)) as { briefings: Briefing[] }).briefings,
  topics: ((await import(pathToFileURL(join(BASELINE, 'topics.ts')).href)) as { topics: Topic[] }).topics,
};
assertValidContent(italian);
assertValidContent({ topics: englishTopics, briefings: englishBriefings });

type Table = keyof SeedRows;
const KEYS: Record<Table, string[]> = {
  topics: ['slug'],
  briefings: ['date'],
  results: ['id'],
  result_topics: ['result_id', 'topic_slug'],
  sources: ['result_id', 'position'],
  corrections: ['briefing_date', 'position'],
};
// Colonne con tipo diverso da text, per confronti e cast nei WHERE.
const CASTS: Record<string, string> = {
  date: 'date',
  coverage_from: 'date',
  coverage_to: 'date',
  updated_on: 'date',
  briefing_date: 'date',
};

const itRows = seedRows(italian.topics, italian.briefings);
const enRows = seedRows(englishTopics, englishBriefings);

function cli(args: string[]): string {
  const result = spawnSync('npx', ['--no-install', 'supabase', ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, SUPABASE_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) throw new Error(`supabase ${args.slice(0, 2).join(' ')} non riuscito (uscita ${result.status}).`);
  return result.stdout;
}

/** Esegue SQL privilegiato sul database locale e restituisce le righe (JSON esplicito, due forme possibili). */
function query(sql: string): Record<string, unknown>[] {
  const dir = mkdtempSync(join(tmpdir(), 'tcs-sql-'));
  try {
    const file = join(dir, 'query.sql');
    writeFileSync(file, sql);
    const parsed: unknown = JSON.parse(cli(['db', 'query', '--local', '--output-format', 'json', '--file', file]));
    const rows = Array.isArray(parsed) ? parsed : (parsed as { rows?: unknown } | null)?.rows;
    if (!Array.isArray(rows)) throw new Error('supabase db query: risposta JSON con forma inattesa.');
    return rows as Record<string, unknown>[];
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function readTable(table: Table): Row[] {
  const columns = Object.keys(itRows[table][0]!);
  const select = columns.map((c) => (CASTS[c] ? `${c}::text as ${c}` : c)).join(', ');
  const [row] = query(`select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) as rows from (select ${select} from public.${table}) t`);
  const value = typeof row?.rows === 'string' ? JSON.parse(row.rows) : row?.rows;
  if (!Array.isArray(value)) throw new Error(`lettura di ${table} non riuscita.`);
  return value as Row[];
}

const norm = (value: Value | unknown) => JSON.stringify(value ?? null);
const keyOf = (table: Table, row: Row) => KEYS[table].map((k) => String(row[k])).join('|');
const sameRow = (a: Row, b: Row, columns: string[]) => columns.every((c) => norm(a[c]) === norm(b[c]));
const eq = (column: string, value: Value) =>
  value === null || value === undefined
    ? `${column} is null`
    : `${column} = ${sqlLiteral(value)}${CASTS[column] ? `::${CASTS[column]}` : ''}`;

const report: string[] = [];
const updates: { label: string; sql: string; table: Table; key: string }[] = [];

for (const table of Object.keys(KEYS) as Table[]) {
  const columns = Object.keys(itRows[table][0]!);
  const dbRows = readTable(table);
  const it = new Map(itRows[table].map((r) => [keyOf(table, r), r]));
  const en = new Map(enRows[table].map((r) => [keyOf(table, r), r]));
  const counts = { daTradurre: 0, giaInglese: 0, invariate: 0, diverse: [] as string[], extra: [] as string[] };

  for (const row of dbRows) {
    const key = keyOf(table, row);
    const itRow = it.get(key);
    const enRow = en.get(key);
    if (!itRow || !enRow) {
      counts.extra.push(key);
      continue;
    }
    const changed = columns.filter((c) => norm(itRow[c]) !== norm(enRow[c]));
    if (sameRow(row, itRow, columns)) {
      if (changed.length === 0) {
        counts.invariate += 1;
        continue;
      }
      counts.daTradurre += 1;
      const set = changed.map((c) => `${c} = ${sqlLiteral(enRow[c])}`).join(', ');
      const where = columns.map((c) => eq(c, itRow[c])).join(' and ');
      const label = `${table}:${key}`;
      updates.push({ table, key, label, sql: `update public.${table} set ${set} where ${where} returning ${sqlLiteral(label)} as aggiornata` });
    } else if (sameRow(row, enRow, columns)) {
      counts.giaInglese += 1;
    } else {
      counts.diverse.push(key);
    }
  }
  const missing = [...it.keys()].filter((key) => !dbRows.some((row) => keyOf(table, row) === key));
  report.push(
    `${table}: ${dbRows.length} righe nel DB — da tradurre ${counts.daTradurre}, già in inglese ${counts.giaInglese}, ` +
      `senza testo da tradurre ${counts.invariate}` +
      (counts.diverse.length ? `; MODIFICATE (preservate) ${counts.diverse.join(', ')}` : '') +
      (counts.extra.length ? `; ESTRANEE ai demo (preservate) ${counts.extra.join(', ')}` : '') +
      (missing.length ? `; MANCANTI ${missing.join(', ')}` : ''),
  );
}

console.log(`Confronto con la baseline italiana (${BASELINE}):\n  ${report.join('\n  ')}`);

if (!apply) {
  console.log(`\nConfronto a vuoto: ${updates.length} righe sarebbero aggiornate. Eseguire con --apply per scriverle.`);
  process.exit(0);
}
if (updates.length === 0) {
  console.log('\nNessuna riga da aggiornare.');
  process.exit(0);
}

// Un'unica istruzione con CTE di modifica: o vengono applicati tutti gli UPDATE, o nessuno.
const statement =
  'with ' +
  updates.map((u, i) => `u${i} as (${u.sql})`).join(',\n') +
  '\nselect aggiornata from (' +
  updates.map((_, i) => `select aggiornata from u${i}`).join(' union all ') +
  ') tutte order by aggiornata';
const applied = new Set(query(statement).map((r) => String(r.aggiornata)));
const skipped = updates.filter((u) => !applied.has(u.label)).map((u) => u.label);
console.log(`\nAggiornate ${applied.size} righe su ${updates.length} previste.`);
if (skipped.length) console.log(`Non aggiornate perché cambiate nel frattempo (preservate): ${skipped.join(', ')}`);

// Verifica: le righe aggiornate coincidono ora con le fixture inglesi.
for (const table of Object.keys(KEYS) as Table[]) {
  const columns = Object.keys(enRows[table][0]!);
  const en = new Map(enRows[table].map((r) => [keyOf(table, r), r]));
  for (const row of readTable(table)) {
    const key = keyOf(table, row);
    if (applied.has(`${table}:${key}`) && !sameRow(row, en.get(key)!, columns)) {
      console.error(`Verifica fallita: ${table}:${key} non coincide con la versione inglese.`);
      process.exit(1);
    }
  }
}
console.log('Verifica: tutte le righe aggiornate coincidono con le fixture inglesi.');
