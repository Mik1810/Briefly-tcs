// Validazione dei contenuti prima della build. Ogni errore indica dove si trova e perché:
// la build si interrompe invece di pubblicare dati incoerenti.
// Il controllo è a runtime perché i dati futuri arriveranno dal database, non da codice tipizzato.

import { isIsoDate } from '../dates.ts';
import {
  CORRECTION_KINDS,
  EDITORIAL_STATUSES,
  FORMALIZATION_STATUSES,
  PUBLICATION_STATUSES,
  SOURCE_KINDS,
  VERIFICATION_STATUSES,
  type RawContent,
} from './types.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANG = /^[a-z]{2}(?:-[A-Z]{2})?$/;

export class ContentValidationError extends Error {
  readonly problems: string[];

  constructor(problems: string[]) {
    super(`Contenuti non validi (${problems.length}):\n- ${problems.join('\n- ')}`);
    this.name = 'ContentValidationError';
    this.problems = problems;
  }
}

type Report = (path: string, message: string) => void;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function oneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (values as readonly string[]).includes(value);
}

function requireText(report: Report, path: string, value: unknown) {
  if (!isNonEmptyString(value)) report(path, 'testo obbligatorio mancante o vuoto');
}

/** Titoli e sommari finiscono in <title>, meta e liste: devono restare testo semplice, senza formule. */
function requirePlainText(report: Report, path: string, value: unknown) {
  requireText(report, path, value);
  if (typeof value === 'string' && value.includes('$')) {
    report(path, 'deve essere testo semplice, senza formule ($)');
  }
}

function requireDate(report: Report, path: string, value: unknown): value is string {
  if (!isIsoDate(value)) {
    report(path, `data non valida ${JSON.stringify(value)}: atteso YYYY-MM-DD esistente`);
    return false;
  }
  return true;
}

function requireOneOf(report: Report, path: string, values: readonly string[], value: unknown) {
  if (!oneOf(values, value)) {
    report(path, `valore ${JSON.stringify(value)} non ammesso (ammessi: ${values.join(', ')})`);
  }
}

function validateSource(report: Report, path: string, source: unknown) {
  if (!isRecord(source)) return report(path, 'fonte non valida');
  requireText(report, `${path}.title`, source.title);
  requireOneOf(report, `${path}.kind`, SOURCE_KINDS, source.kind);
  if (!Array.isArray(source.authors) || !source.authors.every(isNonEmptyString)) {
    report(`${path}.authors`, 'elenco di autori non valido');
  }
  if (source.year !== undefined && !(Number.isInteger(source.year) && (source.year as number) > 0)) {
    report(`${path}.year`, 'anno non valido');
  }
  if (source.venue !== undefined) requireText(report, `${path}.venue`, source.venue);
  if (source.lang !== undefined && !(typeof source.lang === 'string' && LANG.test(source.lang))) {
    report(`${path}.lang`, 'codice lingua non valido');
  }
  if (source.url !== undefined) {
    let valid = false;
    if (typeof source.url === 'string') {
      try {
        valid = new URL(source.url).protocol === 'https:';
      } catch {
        valid = false;
      }
    }
    if (!valid) report(`${path}.url`, 'URL assente o non https');
  }
}

export function collectContentProblems(content: RawContent): string[] {
  const problems: string[] = [];
  const report: Report = (path, message) => problems.push(`${path}: ${message}`);

  const topicSlugs = new Set<string>();
  if (!Array.isArray(content.topics)) report('topics', 'elenco argomenti mancante');
  for (const [i, topic] of (content.topics ?? []).entries()) {
    const path = `argomento[${i}]`;
    if (!isRecord(topic)) {
      report(path, 'argomento non valido');
      continue;
    }
    if (typeof topic.slug !== 'string' || !SLUG.test(topic.slug)) {
      report(`${path}.slug`, `slug non valido ${JSON.stringify(topic.slug)}`);
    } else if (topicSlugs.has(topic.slug)) {
      report(`${path}.slug`, `slug duplicato "${topic.slug}"`);
    } else {
      topicSlugs.add(topic.slug);
    }
    requirePlainText(report, `${path}.name`, topic.name);
    requirePlainText(report, `${path}.description`, topic.description);
  }

  const dates = new Set<string>();
  const resultIds = new Set<string>();
  if (!Array.isArray(content.briefings)) report('briefings', 'elenco briefing mancante');

  for (const [i, briefing] of (content.briefings ?? []).entries()) {
    if (!isRecord(briefing)) {
      report(`briefing[${i}]`, 'briefing non valido');
      continue;
    }
    const path = `briefing ${typeof briefing.date === 'string' ? briefing.date : `[${i}]`}`;
    const hasDate = requireDate(report, `${path}.date`, briefing.date);
    if (hasDate) {
      if (dates.has(briefing.date as string)) report(`${path}.date`, 'esiste già un briefing con questa data');
      dates.add(briefing.date as string);
    }

    requireOneOf(report, `${path}.status`, EDITORIAL_STATUSES, briefing.status);
    if (typeof briefing.demo !== 'boolean') report(`${path}.demo`, 'atteso true o false');
    requirePlainText(report, `${path}.title`, briefing.title);
    requirePlainText(report, `${path}.summary`, briefing.summary);
    requireText(report, `${path}.aiDisclosure`, briefing.aiDisclosure);
    if (briefing.intro !== undefined) requireText(report, `${path}.intro`, briefing.intro);

    const coverage: Record<string, unknown> = isRecord(briefing.coverage) ? briefing.coverage : {};
    const hasFrom = requireDate(report, `${path}.coverage.from`, coverage.from);
    const hasTo = requireDate(report, `${path}.coverage.to`, coverage.to);
    if (hasFrom && hasTo && (coverage.from as string) > (coverage.to as string)) {
      report(`${path}.coverage`, 'il periodo coperto inizia dopo la sua fine');
    }
    if (hasTo && hasDate && (coverage.to as string) > (briefing.date as string)) {
      report(`${path}.coverage.to`, 'il periodo coperto termina dopo la data di pubblicazione');
    }

    let updatedOn: string | undefined;
    if (briefing.updatedOn !== undefined && requireDate(report, `${path}.updatedOn`, briefing.updatedOn)) {
      updatedOn = briefing.updatedOn as string;
      if (hasDate && updatedOn < (briefing.date as string)) {
        report(`${path}.updatedOn`, 'l’aggiornamento non può precedere la pubblicazione');
      }
    }

    const ownResultIds = new Set<string>();
    if (!Array.isArray(briefing.results) || briefing.results.length === 0) {
      report(`${path}.results`, 'serve almeno un risultato');
    }
    for (const [j, result] of (Array.isArray(briefing.results) ? briefing.results : []).entries()) {
      if (!isRecord(result)) {
        report(`${path}.results[${j}]`, 'risultato non valido');
        continue;
      }
      const rPath = `${path} › risultato ${typeof result.id === 'string' ? result.id : `[${j}]`}`;
      if (typeof result.id !== 'string' || !SLUG.test(result.id)) {
        report(`${rPath}.id`, `id non valido ${JSON.stringify(result.id)}`);
      } else if (resultIds.has(result.id)) {
        report(`${rPath}.id`, 'id già usato da un altro risultato');
      } else {
        resultIds.add(result.id);
        ownResultIds.add(result.id);
      }
      requirePlainText(report, `${rPath}.title`, result.title);
      requirePlainText(report, `${rPath}.summary`, result.summary);
      requireText(report, `${rPath}.body`, result.body);

      if (!Array.isArray(result.topics) || result.topics.length === 0) {
        report(`${rPath}.topics`, 'serve almeno un argomento');
      } else {
        const seen = new Set<unknown>();
        for (const slug of result.topics) {
          if (seen.has(slug)) report(`${rPath}.topics`, `argomento ripetuto ${JSON.stringify(slug)}`);
          seen.add(slug);
          if (typeof slug !== 'string' || !topicSlugs.has(slug)) {
            report(`${rPath}.topics`, `argomento ${JSON.stringify(slug)} fuori vocabolario`);
          }
        }
      }

      const status: Record<string, unknown> = isRecord(result.status) ? result.status : {};
      requireOneOf(report, `${rPath}.status.publication`, PUBLICATION_STATUSES, status.publication);
      requireOneOf(report, `${rPath}.status.formalization`, FORMALIZATION_STATUSES, status.formalization);
      requireOneOf(report, `${rPath}.status.verification`, VERIFICATION_STATUSES, status.verification);

      if (!Array.isArray(result.sources) || result.sources.length === 0) {
        report(`${rPath}.sources`, 'serve almeno una fonte');
      }
      for (const [k, source] of (Array.isArray(result.sources) ? result.sources : []).entries()) {
        validateSource(report, `${rPath}.sources[${k}]`, source);
      }
    }

    if (!Array.isArray(briefing.corrections)) report(`${path}.corrections`, 'elenco correzioni mancante');
    let latestCorrection: string | undefined;
    for (const [j, correction] of (Array.isArray(briefing.corrections) ? briefing.corrections : []).entries()) {
      const cPath = `${path}.corrections[${j}]`;
      if (!isRecord(correction)) {
        report(cPath, 'correzione non valida');
        continue;
      }
      requireOneOf(report, `${cPath}.kind`, CORRECTION_KINDS, correction.kind);
      requireText(report, `${cPath}.text`, correction.text);
      if (correction.resultId !== undefined && !ownResultIds.has(correction.resultId as string)) {
        report(`${cPath}.resultId`, `il risultato ${JSON.stringify(correction.resultId)} non è in questo briefing`);
      }
      if (requireDate(report, `${cPath}.date`, correction.date)) {
        const date = correction.date as string;
        // Ammessa anche nello stesso giorno della pubblicazione.
        if (hasDate && date < (briefing.date as string)) {
          report(`${cPath}.date`, 'una correzione non può precedere la pubblicazione');
        }
        if (latestCorrection === undefined || date > latestCorrection) latestCorrection = date;
      }
    }
    if (latestCorrection !== undefined && (updatedOn === undefined || updatedOn < latestCorrection)) {
      report(`${path}.updatedOn`, `deve essere almeno la data dell’ultima correzione (${latestCorrection})`);
    }
  }

  return problems;
}

export function assertValidContent(content: RawContent): void {
  const problems = collectContentProblems(content);
  if (problems.length > 0) throw new ContentValidationError(problems);
}
