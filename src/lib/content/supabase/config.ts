// Configurazione della sorgente Supabase: target, URL e chiave publishable.
//
// Target scelto con TCS_SUPABASE_TARGET: 'local' (predefinito, per compatibilità) o 'cloud'.
// - local: solo stack su loopback; valori mancanti presi da .env (scritto da `npm run db:env`).
// - cloud: solo https://<ref>.supabase.co; valori mancanti presi da .env.cloud. Mai da .env né dalle fixture.
// Precedenza, variabile per variabile: ambiente del processo (es. Vercel) > file del target.
// La chiave deve essere publishable (o JWT legacy con ruolo anon): secret e service_role sono rifiutate.
// Nessun messaggio di errore riporta la chiave o l'URL rifiutato per intero.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseEnv } from 'node:util';

export type SupabaseTarget = 'local' | 'cloud';

export interface SupabaseConfig {
  target: SupabaseTarget;
  url: string;
  publishableKey: string;
}

export const TARGET_ENV_FILE: Record<SupabaseTarget, string> = { local: '.env', cloud: '.env.cloud' };

const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);
// Dominio di progetto Supabase: riferimento di 20 caratteri minuscoli, un solo livello sotto supabase.co.
const CLOUD_HOST = /^[a-z0-9]{20}\.supabase\.co$/;
const JWT = /^[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+$/;

type Env = Record<string, string | undefined>;

export function supabaseTarget(env: Env = process.env): SupabaseTarget {
  const value = env.TCS_SUPABASE_TARGET;
  if (value === undefined || value === '' || value === 'local') return 'local';
  if (value === 'cloud') return 'cloud';
  throw new Error(`TCS_SUPABASE_TARGET deve valere "local" o "cloud" (valore attuale: ${JSON.stringify(value)}).`);
}

export function validateUrl(target: SupabaseTarget, value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('TCS_SUPABASE_URL non è un URL valido.');
  }
  if (url.username || url.password) throw new Error('TCS_SUPABASE_URL non deve contenere nome utente o password.');
  if (url.href !== `${url.origin}/`) {
    throw new Error('TCS_SUPABASE_URL deve contenere solo protocollo e host (senza percorso, query o frammento).');
  }
  if (target === 'local') {
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !LOCAL_HOSTS.has(url.hostname)) {
      throw new Error(`TCS_SUPABASE_URL deve puntare allo stack locale, non a ${url.hostname}.`);
    }
  } else if (url.protocol !== 'https:' || url.port !== '' || !CLOUD_HOST.test(url.hostname)) {
    throw new Error(
      `TCS_SUPABASE_URL per il target cloud deve essere https://<ref>.supabase.co senza porta (ricevuto host ${url.hostname}).`,
    );
  }
  return url.origin;
}

/** Ruolo dichiarato da una chiave JWT legacy, senza verificarne la firma. `undefined` se illeggibile. */
function jwtRole(payload: string): unknown {
  try {
    return (JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { role?: unknown } | null)?.role;
  } catch {
    return undefined;
  }
}

export function validatePublishableKey(key: string): void {
  const usage = 'Usare solo la chiave publishable (ruolo anon, soggetta a RLS).';
  if (key.startsWith('sb_secret_')) throw new Error(`TCS_SUPABASE_PUBLISHABLE_KEY è una chiave secret. ${usage}`);
  if (key.startsWith('sb_publishable_')) return;
  const jwt = key.match(JWT);
  if (!jwt) throw new Error(`TCS_SUPABASE_PUBLISHABLE_KEY ha un formato non riconosciuto. ${usage}`);
  const role = jwtRole(jwt[1]!);
  if (role === 'anon') return;
  throw new Error(
    role === 'service_role'
      ? `TCS_SUPABASE_PUBLISHABLE_KEY è una chiave legacy service_role. ${usage}`
      : `TCS_SUPABASE_PUBLISHABLE_KEY è un JWT senza ruolo anon. ${usage}`,
  );
}

interface ReadOptions {
  env?: Env;
  /** Cartella in cui cercare il file del target; predefinita la cartella corrente. */
  cwd?: string;
  /** Forza il target, ignorando TCS_SUPABASE_TARGET (es. db:verify, sempre locale). */
  target?: SupabaseTarget;
}

/** Legge e valida la configurazione del target scelto. Errore esplicito se manca qualcosa. */
export function readSupabaseConfig({ env = process.env, cwd = process.cwd(), target }: ReadOptions = {}): SupabaseConfig {
  const selected = target ?? supabaseTarget(env);
  const fileName = TARGET_ENV_FILE[selected];
  let url = env.TCS_SUPABASE_URL || undefined;
  let publishableKey = env.TCS_SUPABASE_PUBLISHABLE_KEY || undefined;
  if (!url || !publishableKey) {
    const file = join(cwd, fileName);
    const values = existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {};
    url ||= values.TCS_SUPABASE_URL || undefined;
    publishableKey ||= values.TCS_SUPABASE_PUBLISHABLE_KEY || undefined;
  }
  if (!url || !publishableKey) {
    const hint =
      selected === 'local'
        ? 'generare .env con `npm run db:env` a stack avviato'
        : 'impostarle nell’ambiente o in .env.cloud (vedi .env.example); il target cloud non legge .env';
    throw new Error(
      `Configurazione Supabase ${selected} mancante: servono TCS_SUPABASE_URL e TCS_SUPABASE_PUBLISHABLE_KEY (${hint}).`,
    );
  }
  const origin = validateUrl(selected, url);
  validatePublishableKey(publishableKey);
  return { target: selected, url: origin, publishableKey };
}
