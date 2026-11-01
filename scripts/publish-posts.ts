// Pubblica su Supabase i post JSON della cartella posts/ non ancora presenti. Uso:
//   node scripts/publish-posts.ts [--dry-run] [cartella]
// Ambiente: TCS_SUPABASE_URL, TCS_SUPABASE_SECRET_KEY (secret di GitHub Actions; mai la chiave nei log).
// --dry-run legge dal database e valida, senza scrivere. Uscita 1 se un post non è valido o non pubblicabile.
// In GitHub Actions scrive `published=<numero>` in GITHUB_OUTPUT per decidere se avviare la build Vercel.

import { appendFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createRestDb, publishPosts, readPublisherConfig } from './lib/publisher.ts';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dir = args.find((arg) => !arg.startsWith('--')) ?? 'posts';

const files = readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .map((name) => ({ path: join(dir, name), text: readFileSync(join(dir, name), 'utf8') }));

let report: Awaited<ReturnType<typeof publishPosts>>;
try {
  report = await publishPosts(files, createRestDb(readPublisherConfig()), { dryRun });
} catch (error) {
  // Configurazione o database non utilizzabili: nessun post toccato.
  console.error(`ERRORE ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const verb = dryRun ? 'pubblicabili' : 'pubblicati';
console.log(`Post letti: ${files.length}. ${verb}: ${report.published.join(', ') || 'nessuno'}. ` +
  `Già presenti e identici: ${report.unchanged.length}.`);
for (const problem of report.problems) console.error(`ERRORE ${problem}`);

if (process.env.GITHUB_OUTPUT && !dryRun) {
  appendFileSync(process.env.GITHUB_OUTPUT, `published=${report.published.length}\n`);
}
process.exitCode = report.problems.length > 0 ? 1 : 0;
