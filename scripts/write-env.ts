// Scrive .env (ignorato da Git) con i soli valori che la build usa per leggere il database locale.
// L'uscita di `supabase status` contiene anche chiavi privilegiate: viene letta qui in memoria,
// senza stamparla, e se ne conservano solo l'URL dell'API e la chiave publishable (ruolo anon).
// Uso: npm run db:env (con lo stack locale avviato).

import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const status = spawnSync('npx', ['--no-install', 'supabase', 'status', '--output-format', 'json'], {
  cwd: ROOT,
  encoding: 'utf8',
  env: { ...process.env, SUPABASE_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
if (status.status !== 0) {
  console.error('supabase status non riuscito: lo stack locale è avviato? (npm run db:start)');
  process.exit(1);
}

let env: Record<string, string> | undefined;
try {
  env = (JSON.parse(status.stdout) as { env?: Record<string, string> }).env;
} catch {
  env = undefined;
}
const apiUrl = env?.API_URL;
const publishableKey = env?.PUBLISHABLE_KEY;
if (!apiUrl || !publishableKey) {
  console.error('supabase status non contiene API_URL e PUBLISHABLE_KEY.');
  process.exit(1);
}
const url = new URL(apiUrl);
if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
  console.error(`API_URL non locale (${url.hostname}): .env non scritto.`);
  process.exit(1);
}

writeFileSync(
  `${ROOT}.env`,
  [
    '# Generato da scripts/write-env.ts. Non versionare.',
    '# Chiave publishable: ruolo anon, soggetta a RLS. Nessuna chiave privilegiata qui.',
    `TCS_SUPABASE_URL=${url.origin}`,
    `TCS_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`,
    '',
  ].join('\n'),
  { mode: 0o600 },
);
console.log(`.env scritto con TCS_SUPABASE_URL=${url.origin} e la chiave publishable (non mostrata).`);
