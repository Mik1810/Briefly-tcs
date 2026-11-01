// Build con sostituzione finale di dist/. Una build fallita non tocca l'ultima build valida.
//
// 1. Carica e valida i contenuti dalla sorgente scelta (TCS_CONTENT_SOURCE, TCS_SUPABASE_TARGET): errore leggibile e uscita
//    immediata se il database non risponde, prima di generare qualunque file.
// 2. astro build in dist-staging/, poi scripts/check-dist.ts su dist-staging/.
// 3. Solo se tutto è riuscito: dist/ → dist-previous/, dist-staging/ → dist/, poi rimozione di dist-previous/.
//    Due rinomine nella stessa cartella: non è uno scambio atomico in senso stretto, ma dist/ resta
//    sempre una build completa e controllata, oppure viene ripristinata se la seconda rinomina fallisce.

import { spawnSync } from 'node:child_process';
import { existsSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadValidatedContent } from '../src/lib/content/repository.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const STAGING = join(ROOT, 'dist-staging');
const PREVIOUS = join(ROOT, 'dist-previous');

function abort(message: string): never {
  rmSync(STAGING, { recursive: true, force: true });
  console.error(`\nBuild interrotta: ${message}`);
  console.error(existsSync(DIST) ? 'dist/ precedente lasciato intatto.' : 'Nessun dist/ precedente.');
  process.exit(1);
}

function run(command: string, args: string[]): boolean {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  return result.status === 0;
}

try {
  const { source, raw } = await loadValidatedContent();
  console.log(`Contenuti: ${source.logLabel}; ${raw.briefings.length} briefing ricevuti e validati.`);
} catch (error) {
  abort(error instanceof Error ? error.message : String(error));
}

rmSync(STAGING, { recursive: true, force: true });
if (!run('npx', ['--no-install', 'astro', 'build', '--outDir', STAGING])) abort('astro build non riuscito.');
if (!run(process.execPath, [join(ROOT, 'scripts', 'check-dist.ts'), 'dist-staging'])) {
  abort('controlli su dist-staging/ non superati.');
}

rmSync(PREVIOUS, { recursive: true, force: true });
const hadDist = existsSync(DIST);
if (hadDist) renameSync(DIST, PREVIOUS);
try {
  renameSync(STAGING, DIST);
} catch (error) {
  if (hadDist) renameSync(PREVIOUS, DIST);
  abort(`sostituzione di dist/ non riuscita: ${error instanceof Error ? error.message : String(error)}`);
}
rmSync(PREVIOUS, { recursive: true, force: true });
console.log('dist/ aggiornato con la nuova build.');
