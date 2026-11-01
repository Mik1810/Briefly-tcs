// Target Supabase (local/cloud): selezione, URL ammessi, precedenza tra ambiente e file, chiavi privilegiate,
// database cloud vuoto o irraggiungibile. Solo valori fittizi in cartelle temporanee: nessun .env reale letto.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { readSupabaseConfig, supabaseTarget, validatePublishableKey } from '../src/lib/content/supabase/config.ts';
import { createSupabaseSource } from '../src/lib/content/supabase/source.ts';
import { assertValidContent } from '../src/lib/content/validate.ts';

const REF = 'abcdefghijklmnopqrst';
const CLOUD_URL = `https://${REF}.supabase.co`;
const KEY = 'sb_publishable_fittizia';

const dirs: string[] = [];
after(() => dirs.forEach((dir) => rmSync(dir, { recursive: true, force: true })));

/** Cartella temporanea con i file indicati (nome → contenuto). */
function folder(files: Record<string, string> = {}): string {
  const dir = mkdtempSync(join(tmpdir(), 'tcs-config-'));
  dirs.push(dir);
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
  return dir;
}

const envFile = (url: string, key: string) => `TCS_SUPABASE_URL=${url}\nTCS_SUPABASE_PUBLISHABLE_KEY=${key}\n`;
const jwt = (payload: object) =>
  [{ alg: 'HS256', typ: 'JWT' }, payload].map((part) => Buffer.from(JSON.stringify(part)).toString('base64url')).join('.') +
  '.firma';

test('selezione del target: local predefinito, cloud esplicito, altri valori rifiutati', () => {
  assert.equal(supabaseTarget({}), 'local');
  assert.equal(supabaseTarget({ TCS_SUPABASE_TARGET: '' }), 'local');
  assert.equal(supabaseTarget({ TCS_SUPABASE_TARGET: 'local' }), 'local');
  assert.equal(supabaseTarget({ TCS_SUPABASE_TARGET: 'cloud' }), 'cloud');
  for (const value of ['Cloud', 'remote', 'production']) {
    assert.throws(() => supabaseTarget({ TCS_SUPABASE_TARGET: value }), /TCS_SUPABASE_TARGET/);
  }
});

test('cloud: accetta solo https://<ref>.supabase.co e restituisce l’origine', () => {
  for (const url of [CLOUD_URL, `${CLOUD_URL}/`, `https://${REF}.supabase.co:443`]) {
    const env = { TCS_SUPABASE_TARGET: 'cloud', TCS_SUPABASE_URL: url, TCS_SUPABASE_PUBLISHABLE_KEY: KEY };
    assert.deepEqual(readSupabaseConfig({ env, cwd: folder() }), { target: 'cloud', url: CLOUD_URL, publishableKey: KEY });
  }
  const rejected = [
    `http://${REF}.supabase.co`,
    `https://${REF}.supabase.co:8443`,
    `https://${REF}.supabase.co/rest/v1`,
    `https://${REF}.supabase.co/?a=1`,
    `https://${REF}.supabase.co/?`,
    `https://${REF}.supabase.co/#x`,
    `https://utente:password-segreta@${REF}.supabase.co`,
    'https://supabase.co',
    `https://a.${REF}.supabase.co`,
    `https://${REF}.supabase.co.example.com`,
    'https://example.com',
    'http://127.0.0.1:55321',
    'non-un-url',
  ];
  for (const url of rejected) {
    const env = { TCS_SUPABASE_TARGET: 'cloud', TCS_SUPABASE_URL: url, TCS_SUPABASE_PUBLISHABLE_KEY: KEY };
    assert.throws(
      () => readSupabaseConfig({ env, cwd: folder() }),
      (error: Error) => /TCS_SUPABASE_URL/.test(error.message) && !error.message.includes('password-segreta'),
      url,
    );
  }
});

test('local: solo loopback, senza credenziali né percorso', () => {
  for (const url of ['http://127.0.0.1:55321', 'http://localhost:55321/', 'http://[::1]:55321']) {
    const env = { TCS_SUPABASE_URL: url, TCS_SUPABASE_PUBLISHABLE_KEY: KEY };
    assert.equal(readSupabaseConfig({ env, cwd: folder() }).target, 'local');
  }
  for (const url of [CLOUD_URL, 'http://10.0.0.1:55321', 'http://u:p@127.0.0.1:55321', 'http://127.0.0.1:55321/rest/v1']) {
    const env = { TCS_SUPABASE_TARGET: 'local', TCS_SUPABASE_URL: url, TCS_SUPABASE_PUBLISHABLE_KEY: KEY };
    assert.throws(() => readSupabaseConfig({ env, cwd: folder() }), /TCS_SUPABASE_URL/, url);
  }
});

test('precedenza: ambiente > file del target; il cloud non legge mai .env', () => {
  const localFile = envFile('http://127.0.0.1:55321', 'sb_publishable_locale');
  const cloudFile = envFile(CLOUD_URL, 'sb_publishable_file_cloud');
  const both = folder({ '.env': localFile, '.env.cloud': cloudFile });

  assert.deepEqual(readSupabaseConfig({ env: { TCS_SUPABASE_TARGET: 'cloud' }, cwd: both }), {
    target: 'cloud',
    url: CLOUD_URL,
    publishableKey: 'sb_publishable_file_cloud',
  });
  assert.equal(readSupabaseConfig({ env: {}, cwd: both }).publishableKey, 'sb_publishable_locale');

  // Variabili già impostate (es. Vercel) prevalgono sul file, variabile per variabile.
  const env = { TCS_SUPABASE_TARGET: 'cloud', TCS_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_ambiente' };
  assert.equal(readSupabaseConfig({ env, cwd: both }).publishableKey, 'sb_publishable_ambiente');
  assert.equal(readSupabaseConfig({ env, cwd: both }).url, CLOUD_URL);

  // Solo .env presente: il target cloud si ferma invece di usare i valori locali.
  const onlyLocal = folder({ '.env': localFile });
  assert.throws(() => readSupabaseConfig({ env: { TCS_SUPABASE_TARGET: 'cloud' }, cwd: onlyLocal }), /cloud mancante.*\.env\.cloud/s);
  assert.throws(() => readSupabaseConfig({ env: { TCS_SUPABASE_TARGET: 'cloud' }, cwd: folder() }), /cloud mancante/);

  // Un URL locale rimasto nell'ambiente non diventa valido in modalità cloud.
  const stale = { TCS_SUPABASE_TARGET: 'cloud', TCS_SUPABASE_URL: 'http://127.0.0.1:55321' };
  assert.throws(() => readSupabaseConfig({ env: stale, cwd: both }), /target cloud/);

  // Il target forzato (db:verify) ignora TCS_SUPABASE_TARGET.
  assert.equal(readSupabaseConfig({ env: { TCS_SUPABASE_TARGET: 'cloud' }, cwd: both, target: 'local' }).target, 'local');
});

test('chiavi privilegiate o non riconosciute rifiutate senza riportarne il contenuto', () => {
  validatePublishableKey('sb_publishable_abc');
  validatePublishableKey(jwt({ iss: 'supabase', role: 'anon' }));
  const rejected: [string, RegExp][] = [
    ['sb_secret_contenuto-riservato', /chiave secret/],
    [jwt({ iss: 'supabase', role: 'service_role', marker: 'contenuto-riservato' }), /service_role/],
    [jwt({ iss: 'supabase', role: 'authenticated', marker: 'contenuto-riservato' }), /senza ruolo anon/],
    [jwt({ iss: 'supabase', marker: 'contenuto-riservato' }), /senza ruolo anon/],
    ['eyJcontenuto-riservato.non-json.firma', /senza ruolo anon/],
    ['contenuto-riservato', /formato non riconosciuto/],
  ];
  for (const [key, message] of rejected) {
    assert.throws(
      () => validatePublishableKey(key),
      (error: Error) => message.test(error.message) && !error.message.includes(key) && !error.message.includes('riservato'),
    );
    const env = { TCS_SUPABASE_TARGET: 'cloud', TCS_SUPABASE_URL: CLOUD_URL, TCS_SUPABASE_PUBLISHABLE_KEY: key };
    assert.throws(() => readSupabaseConfig({ env, cwd: folder() }), message);
  }
});

async function withFetch<T>(fake: typeof fetch, fn: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = fake;
  try {
    return await fn();
  } finally {
    globalThis.fetch = original;
  }
}

test('cloud vuoto: contenuto valido senza briefing né argomenti; la sorgente è descritta come hosted', async () => {
  const requested: string[] = [];
  const source = createSupabaseSource({ target: 'cloud', url: CLOUD_URL, publishableKey: KEY });
  const content = await withFetch(
    async (input, init) => {
      requested.push(String(input));
      assert.equal(new Headers(init?.headers).get('apikey'), KEY);
      return Response.json([]);
    },
    () => source.load(),
  );
  assert.deepEqual(content, { topics: [], briefings: [] });
  assertValidContent(content);
  assert.ok(requested.every((url) => url.startsWith(`${CLOUD_URL}/rest/v1/`)));
  assert.match(source.description, /^hosted Supabase database/);
  assert.equal(source.logLabel, `Supabase cloud (${REF}.supabase.co)`);
  assert.ok(!source.logLabel.includes(KEY) && !source.description.includes(KEY));
});

test('cloud irraggiungibile: errore leggibile, senza chiave né ripiego', async () => {
  const source = createSupabaseSource({ target: 'cloud', url: CLOUD_URL, publishableKey: KEY });
  await withFetch(
    async () => {
      throw new TypeError('fetch failed', { cause: new Error('getaddrinfo ENOTFOUND') });
    },
    () =>
      assert.rejects(
        source.load(),
        (error: Error) =>
          /cloud non raggiungibile.*ENOTFOUND.*senza usare le fixture/s.test(error.message) && !error.message.includes(KEY),
      ),
  );
});

test('una build con database irraggiungibile lascia intatto dist/', () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const dist = join(root, 'dist');
  const before = existsSync(dist) ? statSync(dist).mtimeMs : undefined;
  const result = spawnSync(process.execPath, [join(root, 'scripts', 'build.ts')], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      TCS_CONTENT_SOURCE: 'supabase',
      TCS_SUPABASE_TARGET: 'local',
      // Porta 9 (discard) su loopback: nessun servizio, nessuna rete esterna. Valori completi: .env non viene letto.
      TCS_SUPABASE_URL: 'http://127.0.0.1:9',
      TCS_SUPABASE_PUBLISHABLE_KEY: KEY,
    },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Build interrotta: Database Supabase locale non raggiungibile/);
  assert.ok(!result.stderr.includes(KEY) && !result.stdout.includes(KEY));
  assert.equal(existsSync(dist) ? statSync(dist).mtimeMs : undefined, before);
  assert.ok(!existsSync(join(root, 'dist-staging')));
});

// Errore riferito da Codex: in `astro build` Astro copiava .env (locale) in process.env dei worker, e il target cloud
// riceveva 127.0.0.1. Gli script cloud caricano .env.cloud prima di Astro e Astro non legge .env in modalità cloud.
// La prova completa (build e dev su copie temporanee con .env fittizi) è descritta nel report 07.
test('script cloud: .env.cloud caricato da Node prima di Astro, .env escluso da Astro', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const { scripts } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { scripts: Record<string, string> };
  assert.match(scripts['build:cloud']!, /TCS_SUPABASE_TARGET=cloud node --env-file-if-exists=\.env\.cloud scripts\/build\.ts$/);
  assert.match(scripts['dev:cloud']!, /TCS_SUPABASE_TARGET=cloud .*node --env-file-if-exists=\.env\.cloud node_modules\/astro\/bin\/astro\.mjs dev$/);
  assert.ok(existsSync(join(root, 'node_modules', 'astro', 'bin', 'astro.mjs')));

  // La query rende distinte le due importazioni, così la configurazione viene rivalutata con il target impostato.
  const configUrl = new URL('../astro.config.mjs', import.meta.url).href;
  const loadConfig = async (target: string): Promise<{ vite: { envDir?: string | false } }> =>
    (await import(`${configUrl}?${target}`)).default;
  const saved = process.env.TCS_SUPABASE_TARGET;
  try {
    process.env.TCS_SUPABASE_TARGET = 'cloud';
    assert.equal((await loadConfig('cloud')).vite.envDir, false);
    process.env.TCS_SUPABASE_TARGET = 'local';
    assert.equal((await loadConfig('local')).vite.envDir, undefined);
  } finally {
    if (saved === undefined) delete process.env.TCS_SUPABASE_TARGET;
    else process.env.TCS_SUPABASE_TARGET = saved;
  }
});

test('--env-file-if-exists: le variabili esterne prevalgono sul file; file assente ammesso', () => {
  const dir = folder({ '.env.cloud': envFile(CLOUD_URL, 'sb_publishable_file') });
  const print = ['-e', 'console.log(process.env.TCS_SUPABASE_URL + " " + process.env.TCS_SUPABASE_PUBLISHABLE_KEY)'];
  const run = (cwd: string, extra: Record<string, string>) => {
    const env = { ...process.env, ...extra };
    delete env.TCS_SUPABASE_URL;
    delete env.TCS_SUPABASE_PUBLISHABLE_KEY;
    Object.assign(env, extra);
    const result = spawnSync(process.execPath, ['--env-file-if-exists=.env.cloud', ...print], { cwd, env, encoding: 'utf8' });
    assert.equal(result.status, 0);
    return result.stdout.trim();
  };
  assert.equal(run(dir, {}), `${CLOUD_URL} sb_publishable_file`);
  assert.equal(run(dir, { TCS_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_esterna' }), `${CLOUD_URL} sb_publishable_esterna`);
  assert.equal(run(folder(), { TCS_SUPABASE_URL: CLOUD_URL, TCS_SUPABASE_PUBLISHABLE_KEY: KEY }), `${CLOUD_URL} ${KEY}`);
});
