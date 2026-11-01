// Unico punto da cui le pagine leggono i contenuti. Qui si sceglie la sorgente, si validano
// tutti i dati (bozze comprese) e si escludono le bozze prima che qualunque pagina le veda.

import { yearOf } from '../dates.ts';
import { contentSourceKind } from './config.ts';
import { fixtureSource } from './fixtures/source.ts';
import type { ContentSource, ContentSourceKind } from './source.ts';
import { readSupabaseConfig } from './supabase/config.ts';
import { createSupabaseSource } from './supabase/source.ts';
import type { Briefing, RawContent, Result, Topic } from './types.ts';
import { assertValidContent } from './validate.ts';

export interface SiteContent {
  sourceKind: ContentSourceKind;
  sourceDescription: string;
  topics: Topic[];
  topicsBySlug: Map<string, Topic>;
  /** Solo briefing pubblicati, dal più recente. */
  briefings: Briefing[];
}

export interface TopicEntry {
  briefing: Briefing;
  result: Result;
}

function selectSource(kind: ContentSourceKind): ContentSource {
  switch (kind) {
    case 'fixture':
      return fixtureSource;
    case 'supabase':
      // Un errore del database interrompe la build: nessun ripiego sulle fixture.
      return createSupabaseSource(readSupabaseConfig());
  }
}

/**
 * Tutti i contenuti validati restituiti dalla sorgente. Con le fixture include le bozze;
 * con Supabase le bozze non arrivano mai (RLS). Usato da scripts/build.ts e scripts/check-dist.ts:
 * le pagine usano getSite().
 */
export async function loadValidatedContent(): Promise<{ source: ContentSource; raw: RawContent }> {
  const source = selectSource(contentSourceKind());
  const raw = await source.load();
  assertValidContent(raw);
  return { source, raw };
}

async function loadSite(): Promise<SiteContent> {
  const { source, raw } = await loadValidatedContent();

  const briefings = raw.briefings
    .filter((briefing) => briefing.status === 'pubblicato')
    .toSorted((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return {
    sourceKind: source.kind,
    sourceDescription: source.description,
    topics: raw.topics,
    topicsBySlug: new Map(raw.topics.map((topic) => [topic.slug, topic])),
    briefings,
  };
}

// Cache per l'intera build statica: i dati sono immutabili durante la generazione.
let sitePromise: Promise<SiteContent> | undefined;

export function getSite(): Promise<SiteContent> {
  sitePromise ??= loadSite();
  return sitePromise;
}

export function resultAnchor(result: Pick<Result, 'id'>): string {
  return `risultato-${result.id}`;
}

export function briefingPath(briefing: Pick<Briefing, 'date'>): string {
  return `/briefing/${briefing.date}/`;
}

export function resultPath(briefing: Pick<Briefing, 'date'>, result: Pick<Result, 'id'>): string {
  return `${briefingPath(briefing)}#${resultAnchor(result)}`;
}

export function topicPath(topic: Pick<Topic, 'slug'>): string {
  return `/argomenti/${topic.slug}/`;
}

/** Argomenti dei risultati di un briefing, senza ripetizioni, nell'ordine in cui compaiono. */
export function briefingTopics(site: SiteContent, briefing: Briefing): Topic[] {
  const slugs = new Set(briefing.results.flatMap((result) => result.topics));
  return [...slugs].flatMap((slug) => {
    const topic = site.topicsBySlug.get(slug);
    return topic ? [topic] : [];
  });
}

export function resultTopics(site: SiteContent, result: Result): Topic[] {
  return result.topics.flatMap((slug) => {
    const topic = site.topicsBySlug.get(slug);
    return topic ? [topic] : [];
  });
}

/** Risultati pubblicati per argomento. Gli argomenti senza risultati pubblicati non compaiono. */
export function entriesByTopic(site: SiteContent): Map<string, TopicEntry[]> {
  const map = new Map<string, TopicEntry[]>();
  for (const briefing of site.briefings) {
    for (const result of briefing.results) {
      for (const slug of result.topics) {
        const list = map.get(slug);
        if (list) list.push({ briefing, result });
        else map.set(slug, [{ briefing, result }]);
      }
    }
  }
  return map;
}

export function adjacentBriefings(site: SiteContent, date: string): { newer?: Briefing; older?: Briefing } {
  const index = site.briefings.findIndex((briefing) => briefing.date === date);
  if (index === -1) return {};
  return { newer: site.briefings[index - 1], older: site.briefings[index + 1] };
}

export function briefingsByYear(site: SiteContent): [string, Briefing[]][] {
  const map = new Map<string, Briefing[]>();
  for (const briefing of site.briefings) {
    const year = yearOf(briefing.date);
    const list = map.get(year);
    if (list) list.push(briefing);
    else map.set(year, [briefing]);
  }
  return [...map];
}
