// Verifica dell'integrazione con lo stack Supabase locale e delle policy RLS. Uso: npm run db:verify
//
// Confronta due punti di vista:
// - privilegiato: `supabase db query --local` (utente postgres dello stack locale), per sapere cosa c'è davvero;
// - anonimo: API REST con la chiave publishable, cioè ciò che vede la build.
// Esito: lettura pubblica corretta e identica alle fixture, bozza esistente ma invisibile, scritture negate.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

import { briefings as fixtureBriefings } from '../src/lib/content/fixtures/briefings.ts';
import { topics as fixtureTopics } from '../src/lib/content/fixtures/topics.ts';
import { createSupabaseSource, readSupabaseConfig } from '../src/lib/content/supabase/source.ts';

const config = readSupabaseConfig();
const outcomes: string[] = [];
const ok = (message: string) => outcomes.push(`ok   ${message}`);

// `--output-format json` è obbligatorio: senza, la CLI sceglie il formato in base all'ambiente
// (tabella Unicode in un terminale normale, JSON se rileva un agente). Anche con JSON la forma varia:
// un elenco di righe nel terminale normale, `{ rows: [...] }` in modalità agente. Accettiamo solo queste due.
function privileged<T>(sql: string): T[] {
  const result = spawnSync('npx', ['--no-install', 'supabase', 'db', 'query', '--local', '--output-format', 'json', sql], {
    encoding: 'utf8',
    env: { ...process.env, SUPABASE_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) throw new Error(`supabase db query non riuscito (uscita ${result.status}).`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    // Non si riporta l'uscita: potrebbe contenere dati del database.
    throw new Error('supabase db query non ha restituito JSON nonostante --output-format json.');
  }
  const rows = Array.isArray(parsed) ? parsed : (parsed as { rows?: unknown } | null)?.rows;
  if (!Array.isArray(rows) || !rows.every((row) => typeof row === 'object' && row !== null && !Array.isArray(row))) {
    throw new Error('supabase db query: risposta JSON con forma inattesa (attese righe come oggetti).');
  }
  return rows as T[];
}

async function anon(method: string, path: string, body?: unknown, withKey = true) {
  const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };
  if (withKey) headers.apikey = config.publishableKey;
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    method,
    headers: { ...headers, Prefer: 'return=representation' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  const text = await response.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: response.status, json };
}

const plain = (value: unknown) => JSON.parse(JSON.stringify(value));

// 1. Stato reale nel database.
const rows = privileged<{ date: string; status: string }>(
  "select to_char(date, 'YYYY-MM-DD') as date, status from public.briefings order by date",
);
const publishedDates = rows.filter((r) => r.status === 'pubblicato').map((r) => r.date);
const draftDates = rows.filter((r) => r.status === 'bozza').map((r) => r.date);
assert.ok(draftDates.length > 0, 'il database deve contenere almeno una bozza per provare RLS');
const draftResults = privileged<{ id: string }>(
  "select r.id from public.results r join public.briefings b on b.date = r.briefing_date where b.status = 'bozza'",
).map((r) => r.id);
ok(`database: ${publishedDates.length} briefing pubblicati, ${draftDates.length} bozza/e (${draftDates.join(', ')})`);

// 2. Lettura pubblica: solo i pubblicati, e contenuto identico alle fixture pubblicate.
const list = await anon('GET', 'briefings?select=date&order=date');
assert.equal(list.status, 200);
assert.deepEqual((list.json as { date: string }[]).map((r) => r.date), publishedDates);
ok(`lettura anonima di briefings: HTTP 200, solo le date pubblicate (${publishedDates.join(', ')})`);

const content = await createSupabaseSource(config).load();
const expected = fixtureBriefings.filter((b) => b.status === 'pubblicato').toSorted((a, b) => (a.date < b.date ? 1 : -1));
assert.deepEqual(plain(content.briefings), plain(expected));
assert.deepEqual(plain(content.topics), plain(fixtureTopics));
ok('contenuto letto dalla sorgente Supabase identico alle fixture pubblicate (risultati, fonti, correzioni, argomenti)');

// 3. Tentativi di lettura della bozza: risposte vuote, non errori, perché RLS filtra le righe.
for (const date of draftDates) {
  for (const path of [`briefings?date=eq.${date}`, `corrections?briefing_date=eq.${date}`, `results?briefing_date=eq.${date}`]) {
    const response = await anon('GET', `${path}&select=*`);
    assert.equal(response.status, 200);
    assert.deepEqual(response.json, [], `${path} non deve restituire righe`);
  }
}
for (const id of draftResults) {
  for (const path of [`results?id=eq.${id}`, `sources?result_id=eq.${id}`, `result_topics?result_id=eq.${id}`]) {
    const response = await anon('GET', `${path}&select=*`);
    assert.equal(response.status, 200);
    assert.deepEqual(response.json, [], `${path} non deve restituire righe`);
  }
}
ok(`lettura anonima della bozza (briefing, risultati, fonti, argomenti, correzioni): HTTP 200 con zero righe`);

// 4. Scritture anonime: negate dai privilegi (nessun GRANT) prima ancora delle policy.
const before = privileged<{ n: number; title: string }>(
  `select (select count(*)::int from public.briefings) as n,
          (select title from public.briefings where date = '${publishedDates[0]}') as title`,
)[0]!;
const attempts = [
  ['POST', 'topics', { slug: 'scrittura-anonima', name: 'X', description: 'X', position: 99 }],
  ['POST', 'briefings', { ...{ date: '2026-12-01', status: 'pubblicato', demo: true }, title: 'X', summary: 'X' }],
  ['PATCH', `briefings?date=eq.${publishedDates[0]}`, { title: 'Titolo modificato da anon' }],
  ['PATCH', `briefings?date=eq.${draftDates[0]}`, { status: 'pubblicato' }],
  ['DELETE', `briefings?date=eq.${publishedDates[0]}`, undefined],
] as const;
for (const [method, path, body] of attempts) {
  const response = await anon(method, path, body);
  const code = (response.json as { code?: string })?.code;
  assert.ok(response.status === 401 || response.status === 403, `${method} ${path}: atteso 401/403, ottenuto ${response.status}`);
  assert.equal(code, '42501', `${method} ${path}: atteso permission denied (42501), ottenuto ${code}`);
  ok(`${method} ${path.split('?')[0]} anonimo: HTTP ${response.status}, ${code} permission denied`);
}
const after = privileged<{ n: number; title: string; topic: number; draft: string }>(
  `select (select count(*)::int from public.briefings) as n,
          (select title from public.briefings where date = '${publishedDates[0]}') as title,
          (select count(*)::int from public.topics where slug = 'scrittura-anonima') as topic,
          (select status from public.briefings where date = '${draftDates[0]}') as draft`,
)[0]!;
assert.equal(after.n, before.n);
assert.equal(after.title, before.title);
assert.equal(after.topic, 0);
assert.equal(after.draft, 'bozza');
ok('dopo i tentativi: righe, titolo e stato della bozza invariati nel database');

// 5. Senza chiave: il gateway locale rifiuta o tratta come anon; si registra il comportamento reale.
const noKey = await anon('GET', 'briefings?select=date', undefined, false);
const noKeyRows = Array.isArray(noKey.json) ? (noKey.json as unknown[]).length : null;
assert.ok(noKey.status >= 400 || noKeyRows === publishedDates.length, 'senza chiave non devono apparire bozze');
ok(`richiesta senza chiave: HTTP ${noKey.status}${noKeyRows === null ? '' : `, ${noKeyRows} righe`}`);

console.log(`\nverify-db su ${config.url}\n${outcomes.join('\n')}\nverify-db: tutte le verifiche superate.`);
