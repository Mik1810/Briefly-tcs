// Publisher deterministico: post JSON da GitHub → validazione → RPC publish_briefing su Supabase.
// Nessun modello AI. Scrive solo con la chiave secret (ruolo service_role) passata dall'ambiente del workflow;
// la chiave non compare mai in messaggi, log o file. La build del sito continua a usare solo la publishable.

import { postToBriefing } from '../../src/lib/content/post.ts';
import { validateUrl, type SupabaseTarget } from '../../src/lib/content/supabase/config.ts';
import {
  BRIEFING_ORDER,
  BRIEFING_SELECT,
  mapBriefingRow,
  type BriefingRow,
} from '../../src/lib/content/supabase/source.ts';
import type { Briefing, Topic } from '../../src/lib/content/types.ts';
import { collectContentProblems } from '../../src/lib/content/validate.ts';

const TIMEOUT_MS = 15_000;
// Un post con data futura oltre domani (UTC) è quasi certamente un errore di data del generatore.
const MAX_DAYS_AHEAD = 1;

export interface PublisherConfig {
  target: SupabaseTarget;
  url: string;
  secretKey: string;
}

type Env = Record<string, string | undefined>;

/** Tipo riconosciuto di un valore sbagliato, senza riportarne alcun carattere. */
function describeKey(value: string): string {
  if (value.startsWith('sb_publishable_')) return 'una chiave publishable';
  if (/^https?:\/\//.test(value)) return 'un URL';
  if (/^["'].*["']$/.test(value)) return 'un valore tra virgolette';
  if (/^eyJ[\w-]*\.[\w-]+\.[\w-]+$/.test(value)) return 'un JWT legacy (anon o service_role): usare una chiave sb_secret_';
  return `un valore di formato non riconosciuto (${value.length} caratteri)`;
}

export function readPublisherConfig(env: Env = process.env): PublisherConfig {
  const target: SupabaseTarget = env.TCS_SUPABASE_TARGET === 'local' ? 'local' : 'cloud';
  // Spazi e a capo ai bordi arrivano facilmente incollando i secret nel terminale o nella pagina GitHub.
  const url = env.TCS_SUPABASE_URL?.trim();
  const secretKey = env.TCS_SUPABASE_SECRET_KEY?.trim();
  if (!url || !secretKey) {
    throw new Error('Configurazione publisher mancante: servono TCS_SUPABASE_URL e TCS_SUPABASE_SECRET_KEY.');
  }
  if (!secretKey.startsWith('sb_secret_')) {
    throw new Error(
      `TCS_SUPABASE_SECRET_KEY deve essere una chiave secret Supabase (sb_secret_…); ricevuto ${describeKey(secretKey)}.`,
    );
  }
  return { target, url: validateUrl(target, url), secretKey };
}

/** Accesso al database necessario al publisher; sostituibile nei test. */
export interface PublisherDb {
  topics(): Promise<Topic[]>;
  resultIds(): Promise<Map<string, string>>;
  briefing(date: string): Promise<Briefing | undefined>;
  publish(briefing: Briefing): Promise<'published' | 'exists'>;
}

export function createRestDb(config: PublisherConfig): PublisherDb {
  const request = async (method: string, path: string, body?: unknown): Promise<unknown> => {
    let response: Response;
    try {
      response = await fetch(`${config.url}/rest/v1/${path}`, {
        method,
        headers: { apikey: config.secretKey, Accept: 'application/json', 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Supabase non raggiungibile su ${config.url} (${reason}).`);
    }
    if (!response.ok) {
      const text = (await response.text()).slice(0, 500);
      throw new Error(`Richiesta ${method} ${path.split('?')[0]} fallita: HTTP ${response.status} ${text}`);
    }
    return response.json();
  };

  return {
    topics: async () =>
      (await request('GET', 'topics?select=slug,name,description&order=position')) as Topic[],
    resultIds: async () => {
      const rows = (await request('GET', 'results?select=id,briefing_date')) as { id: string; briefing_date: string }[];
      return new Map(rows.map((row) => [row.id, row.briefing_date]));
    },
    briefing: async (date) => {
      const params = new URLSearchParams({ select: BRIEFING_SELECT, date: `eq.${date}`, ...BRIEFING_ORDER });
      const rows = (await request('GET', `briefings?${params}`)) as BriefingRow[];
      return rows[0] ? mapBriefingRow(rows[0]) : undefined;
    },
    publish: async (briefing) => {
      const outcome = await request('POST', 'rpc/publish_briefing', { post: briefing });
      if (outcome !== 'published' && outcome !== 'exists') {
        throw new Error(`publish_briefing ha restituito un valore inatteso: ${JSON.stringify(outcome)}`);
      }
      return outcome;
    },
  };
}

/** JSON con chiavi ordinate e campi undefined omessi: confronto indipendente dall'ordine delle proprietà. */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, inner: unknown) =>
    inner && typeof inner === 'object' && !Array.isArray(inner)
      ? Object.fromEntries(Object.entries(inner).sort(([a], [b]) => a.localeCompare(b)))
      : inner,
  );
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export interface PostFile {
  path: string;
  text: string;
}

export interface PublishReport {
  published: string[];
  unchanged: string[];
  problems: string[];
}

interface PublishOptions {
  dryRun?: boolean;
  /** Data odierna UTC `YYYY-MM-DD`; iniettabile nei test. */
  today?: string;
}

/**
 * Pubblica i post non ancora presenti, in ordine di data. Ogni post è indipendente: uno non valido viene
 * riportato e non blocca gli altri. Un post già pubblicato con contenuto identico è ignorato (riprova sicura);
 * con contenuto diverso è un errore visibile, perché correzioni e modifiche non sono ancora automatizzate.
 */
export async function publishPosts(
  files: PostFile[],
  db: PublisherDb,
  { dryRun = false, today = new Date().toISOString().slice(0, 10) }: PublishOptions = {},
): Promise<PublishReport> {
  const report: PublishReport = { published: [], unchanged: [], problems: [] };
  const fail = (path: string, message: string) => report.problems.push(`${path}: ${message}`);

  const [topics, resultIds] = await Promise.all([db.topics(), db.resultIds()]);

  const parsed: { path: string; raw: unknown; date: string }[] = [];
  for (const file of files) {
    try {
      const raw: unknown = JSON.parse(file.text);
      const date = typeof (raw as { date?: unknown } | null)?.date === 'string' ? (raw as { date: string }).date : '';
      parsed.push({ path: file.path, raw, date });
    } catch (error) {
      fail(file.path, `JSON non leggibile (${error instanceof Error ? error.message : String(error)})`);
    }
  }
  parsed.sort((a, b) => a.date.localeCompare(b.date));

  for (const { path, raw, date } of parsed) {
    try {
      const existing = date ? await db.briefing(date) : undefined;
      // Id già usati da altri giorni: quelli del briefing stesso non contano per il confronto.
      const taken = new Set([...resultIds].filter(([, day]) => day !== date).map(([id]) => id));
      const briefing = postToBriefing(path, raw, taken);

      if (existing) {
        if (canonical(existing) === canonical(briefing)) report.unchanged.push(date);
        else fail(path, `il ${date} è già pubblicato con contenuto diverso; modifiche e correzioni non sono automatiche`);
        continue;
      }
      if (date > addDays(today, MAX_DAYS_AHEAD)) {
        fail(path, `data ${date} troppo nel futuro rispetto a oggi (${today} UTC)`);
        continue;
      }
      const problems = collectContentProblems({ topics, briefings: [briefing] });
      if (problems.length > 0) {
        for (const problem of problems) fail(path, problem);
        continue;
      }
      if (dryRun) {
        report.published.push(date);
        continue;
      }
      if ((await db.publish(briefing)) === 'exists') {
        fail(path, `il ${date} è stato pubblicato da un'altra esecuzione durante questa; rieseguire per confrontarlo`);
        continue;
      }
      for (const result of briefing.results) resultIds.set(result.id, date);
      report.published.push(date);
    } catch (error) {
      fail(path, error instanceof Error ? error.message : String(error));
    }
  }
  return report;
}
