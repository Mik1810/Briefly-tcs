// Scelta della sorgente ed errori del database: nessun valore predefinito, nessun ripiego sulle fixture.
// Non richiede lo stack Supabase: l'integrazione reale si verifica con `npm run db:verify`.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { contentSourceKind } from '../src/lib/content/config.ts';
import { readSupabaseConfig } from '../src/lib/content/supabase/config.ts';
import { createSupabaseSource } from '../src/lib/content/supabase/source.ts';

function withEnv(values: Record<string, string | undefined>, fn: () => void) {
  const saved = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('senza TCS_CONTENT_SOURCE esplicita la sorgente non viene scelta', () => {
  withEnv({ TCS_CONTENT_SOURCE: undefined }, () => assert.throws(contentSourceKind, /TCS_CONTENT_SOURCE/));
  withEnv({ TCS_CONTENT_SOURCE: 'auto' }, () => assert.throws(contentSourceKind, /TCS_CONTENT_SOURCE/));
  withEnv({ TCS_CONTENT_SOURCE: 'supabase' }, () => assert.equal(contentSourceKind(), 'supabase'));
});

test('un database irraggiungibile produce un errore leggibile, senza ripiego', async () => {
  // Porta 9 (discard): nessun servizio in ascolto su loopback.
  const source = createSupabaseSource({ target: 'local', url: 'http://127.0.0.1:9', publishableKey: 'chiave-di-prova' });
  await assert.rejects(source.load(), /non raggiungibile su http:\/\/127\.0\.0\.1:9.*senza usare le fixture/s);
});

test('il target predefinito resta locale e rifiuta host non locali', () => {
  const env = { TCS_SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co', TCS_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x' };
  assert.throws(() => readSupabaseConfig({ env, cwd: '/nonexistent' }), /stack locale/);
});
