// Formato dei post e publisher, con un database simulato in memoria: nessuna rete, nessuna chiave.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { topics } from '../src/lib/content/fixtures/topics.ts';
import { AUTOMATED_DISCLOSURE, PostFormatError, postToBriefing, slugify } from '../src/lib/content/post.ts';
import type { Briefing } from '../src/lib/content/types.ts';
import { publishPosts, readPublisherConfig, type PublisherDb } from '../scripts/lib/publisher.ts';

function post(date = '2026-11-02', overrides: Record<string, unknown> = {}) {
  return {
    format: 'briefly-post/1',
    date,
    title: 'A test briefing',
    summary: 'One result, used to test the publisher.',
    results: [
      {
        title: 'Faster matrix multiplication bound',
        summary: 'A new upper bound on omega.',
        publication: 'preprint',
        body: 'We show $\\omega < 2.37$.',
        sources: [{ title: 'A paper', authors: ['A. Author'], year: 2026, url: 'https://arxiv.org/abs/2611.00001', kind: 'preprint' }],
      },
    ],
    ...overrides,
  };
}

function file(raw: unknown, date = '2026-11-02') {
  return { path: `posts/${date}.json`, text: JSON.stringify(raw) };
}

function memoryDb(): PublisherDb & { rows: Map<string, Briefing> } {
  const rows = new Map<string, Briefing>();
  return {
    rows,
    topics: async () => topics,
    resultIds: async () => new Map([...rows.values()].flatMap((b) => b.results.map((r) => [r.id, b.date] as [string, string]))),
    briefing: async (date) => rows.get(date),
    publish: async (briefing) => {
      if (rows.has(briefing.date)) return 'exists';
      rows.set(briefing.date, structuredClone(briefing));
      return 'published';
    },
  };
}

const TODAY = '2026-11-02';

test('un post valido diventa un briefing pubblicato, non demo, con verifica solo automatica', () => {
  const briefing = postToBriefing('posts/2026-11-02.json', post());
  assert.equal(briefing.status, 'pubblicato');
  assert.equal(briefing.demo, false);
  assert.equal(briefing.aiDisclosure, AUTOMATED_DISCLOSURE);
  assert.deepEqual(briefing.corrections, []);
  assert.deepEqual(briefing.coverage, { from: '2026-11-01', to: '2026-11-01' }, 'periodo coperto predefinito: ieri');
  const [result] = briefing.results;
  assert.deepEqual(result?.topics, []);
  assert.equal(result?.id, 'faster-matrix-multiplication-bound');
  assert.deepEqual(result?.status, { publication: 'preprint', formalization: 'non-indicata', verification: 'controllo-automatico' });
  assert.equal(result?.sources[0]?.kind, 'preprint');
});

test('campi sconosciuti, valori fuori vocabolario e nome file errato sono rifiutati', () => {
  const bad = post('2026-11-02', { status: 'pubblicato', demo: true });
  (bad.results[0] as Record<string, unknown>).verification = 'revisione-indipendente';
  (bad.results[0] as Record<string, unknown>).topics = ['algoritmi'];
  (bad.results[0] as Record<string, unknown>).publication = 'peer-reviewed';
  assert.throws(
    () => postToBriefing('posts/2026-11-03.json', bad),
    (error: unknown) =>
      error instanceof PostFormatError &&
      ['post.status', 'post.demo', 'verification', 'topics', 'peer-reviewed', '2026-11-02.json'].every((part) =>
        error.problems.some((problem) => problem.includes(part)),
      ),
  );
});

test('slugify produce slug ASCII brevi', () => {
  assert.equal(slugify('  Gödel’s Theorem — revisited!  '), 'godel-s-theorem-revisited');
  assert.ok(slugify('x'.repeat(100)).length <= 60);
});

test('pubblica i post nuovi e ignora quelli già presenti e identici', async () => {
  const db = memoryDb();
  const first = await publishPosts([file(post())], db, { today: TODAY });
  assert.deepEqual(first, { published: ['2026-11-02'], unchanged: [], problems: [] });
  const again = await publishPosts([file(post())], db, { today: TODAY });
  assert.deepEqual(again, { published: [], unchanged: ['2026-11-02'], problems: [] });
});

test('un post già pubblicato con contenuto diverso è un errore e non viene sovrascritto', async () => {
  const db = memoryDb();
  await publishPosts([file(post())], db, { today: TODAY });
  const report = await publishPosts([file(post('2026-11-02', { title: 'Changed' }))], db, { today: TODAY });
  assert.equal(report.published.length, 0);
  assert.match(report.problems.join('\n'), /già pubblicato con contenuto diverso/);
  assert.equal(db.rows.get('2026-11-02')?.title, 'A test briefing');
});

test('id derivato già usato in un altro giorno riceve la data; un post invalido non blocca gli altri', async () => {
  const db = memoryDb();
  await publishPosts([file(post())], db, { today: TODAY });
  const bad = post('2026-11-03');
  bad.results[0]!.sources[0]!.url = 'http://insecure.example';
  const report = await publishPosts(
    [file(post('2026-11-03'), '2026-11-03'), file({ ...bad, date: '2026-11-01' }, '2026-11-01')],
    db,
    { today: '2026-11-03' },
  );
  assert.deepEqual(report.published, ['2026-11-03']);
  assert.match(report.problems.join('\n'), /url: URL assente o non https/);
  assert.equal(db.rows.get('2026-11-03')?.results[0]?.id, 'faster-matrix-multiplication-bound-2026-11-03');
  assert.equal(db.rows.has('2026-11-01'), false);
});

test('date troppo future, JSON illeggibile e dry run', async () => {
  const db = memoryDb();
  const report = await publishPosts(
    [file(post('2026-11-05'), '2026-11-05'), { path: 'posts/broken.json', text: '{' }],
    db,
    { today: TODAY },
  );
  assert.match(report.problems.join('\n'), /troppo nel futuro/);
  assert.match(report.problems.join('\n'), /JSON non leggibile/);
  const dry = await publishPosts([file(post())], db, { today: TODAY, dryRun: true });
  assert.deepEqual(dry.published, ['2026-11-02']);
  assert.equal(db.rows.size, 0);
});

test('vocabolario argomenti vuoto (come nel cloud): il post si pubblica comunque', async () => {
  const db = { ...memoryDb(), topics: async () => [] };
  const report = await publishPosts([file(post())], db, { today: TODAY });
  assert.deepEqual(report.published, ['2026-11-02']);
});

test('il publisher accetta solo una chiave secret e un URL cloud valido', () => {
  const url = 'https://abcdefghijklmnopqrst.supabase.co';
  assert.throws(() => readPublisherConfig({ TCS_SUPABASE_URL: url }), /TCS_SUPABASE_SECRET_KEY/);
  assert.throws(
    () => readPublisherConfig({ TCS_SUPABASE_URL: url, TCS_SUPABASE_SECRET_KEY: 'sb_publishable_x' }),
    /chiave secret/,
  );
  assert.throws(
    () => readPublisherConfig({ TCS_SUPABASE_URL: 'https://example.com', TCS_SUPABASE_SECRET_KEY: 'sb_secret_x' }),
    /supabase\.co/,
  );
  assert.equal(readPublisherConfig({ TCS_SUPABASE_URL: url, TCS_SUPABASE_SECRET_KEY: 'sb_secret_x' }).url, url);
  // Spazi incollati per errore ai bordi sono tollerati; i valori sbagliati sono descritti senza mostrarli.
  assert.equal(readPublisherConfig({ TCS_SUPABASE_URL: ` ${url}\n`, TCS_SUPABASE_SECRET_KEY: ' sb_secret_x\n' }).secretKey, 'sb_secret_x');
  assert.throws(
    () => readPublisherConfig({ TCS_SUPABASE_URL: url, TCS_SUPABASE_SECRET_KEY: 'eyJhbGc.eyJyb2xl.c2lnbmF0dXJl' }),
    (error: unknown) => error instanceof Error && /JWT legacy/.test(error.message) && !error.message.includes('eyJ'),
  );
  assert.throws(
    () => readPublisherConfig({ TCS_SUPABASE_URL: url, TCS_SUPABASE_SECRET_KEY: 'segreto-sconosciuto' }),
    (error: unknown) => error instanceof Error && /19 caratteri/.test(error.message) && !error.message.includes('segreto'),
  );
  assert.throws(
    () => readPublisherConfig({ TCS_SUPABASE_URL: url, TCS_SUPABASE_SECRET_KEY: '\u001b[200~sb_secret_abc\u001b[201~' }),
    /caratteri di controllo, "sb_secret_" compare in posizione 6/,
  );
});
