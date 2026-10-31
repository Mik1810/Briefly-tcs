// Genera supabase/seed.sql dalle fixture dimostrative, così database locale e modalità fixture
// contengono gli stessi tre briefing dimostrativi e la stessa bozza di controllo.
// Uso: npm run db:seed:generate. Il seed si applica solo a un'istanza nuova (o con db:reset, che cancella i dati);
// per aggiornare i demo di un database esistente senza reset vedere scripts/translate-demo-db.ts.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { briefings } from '../src/lib/content/fixtures/briefings.ts';
import { topics } from '../src/lib/content/fixtures/topics.ts';
import { assertValidContent } from '../src/lib/content/validate.ts';
import { type Row, seedRows, sqlLiteral } from './lib/seed-rows.ts';

assertValidContent({ topics, briefings });

function insert(table: string, rows: Row[]): string {
  if (rows.length === 0) return '';
  const columns = Object.keys(rows[0]!);
  const values = rows.map((row) => `  (${columns.map((column) => sqlLiteral(row[column])).join(', ')})`);
  return `insert into public.${table} (${columns.join(', ')}) values\n${values.join(',\n')};\n`;
}

const rows = seedRows(topics, briefings);
const sql = [
  '-- GENERATO da scripts/generate-seed.ts a partire da src/lib/content/fixtures/. Non modificare a mano.',
  '-- Solo contenuti dimostrativi: risultati classici da manuale e una bozza di controllo.',
  '',
  insert('topics', rows.topics),
  insert('briefings', rows.briefings),
  insert('results', rows.results),
  insert('result_topics', rows.result_topics),
  insert('sources', rows.sources),
  insert('corrections', rows.corrections),
].join('\n');

const target = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url));
writeFileSync(target, sql);
console.log(`Scritto ${target}: ${rows.briefings.length} briefing, ${rows.results.length} risultati.`);
