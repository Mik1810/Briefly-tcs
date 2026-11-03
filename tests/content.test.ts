// Controlli sulle regole editoriali: date, metadati ed esclusione delle bozze.
// Eseguiti con il test runner di Node (nessuna dipendenza): `npm run check`.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { formatDate, isIsoDate } from '../src/lib/dates.ts';
import { getSite } from '../src/lib/content/repository.ts';
import { briefings as fixtureBriefings } from '../src/lib/content/fixtures/briefings.ts';
import type { Briefing, RawContent } from '../src/lib/content/types.ts';
import { collectContentProblems } from '../src/lib/content/validate.ts';

function validBriefing(overrides: Partial<Briefing> = {}): Briefing {
  return {
    date: '2026-03-10',
    status: 'pubblicato',
    demo: true,
    title: 'Titolo',
    summary: 'Sommario.',
    coverage: { from: '2026-03-09', to: '2026-03-09' },
    results: [
      {
        id: 'risultato-a',
        title: 'Risultato',
        summary: 'Sintesi.',
        status: { publication: 'preprint', formalization: 'non-indicata', verification: 'non-verificato' },
        body: 'Testo con $n^2$.',
        sources: [{ title: 'Fonte', authors: ['A. Autore'], kind: 'preprint', url: 'https://example.org/x' }],
      },
    ],
    corrections: [],
    aiDisclosure: 'Dichiarazione.',
    ...overrides,
  };
}

function content(...briefings: Briefing[]): RawContent {
  return { briefings };
}

/** Problemi segnalati per un contenuto: verifica che ce ne sia uno sul campo atteso. */
function expectProblem(raw: RawContent, fieldPattern: RegExp) {
  const problems = collectContentProblems(raw);
  assert.ok(
    problems.some((problem) => fieldPattern.test(problem)),
    `atteso un problema che corrisponda a ${fieldPattern}, ottenuti:\n${problems.join('\n') || '(nessuno)'}`,
  );
}

describe('date editoriali', () => {
  test('accetta solo date YYYY-MM-DD esistenti', () => {
    assert.equal(isIsoDate('2028-02-29'), true);
    assert.equal(isIsoDate('2026-02-29'), false);
    assert.equal(isIsoDate('2026-04-31'), false);
    assert.equal(isIsoDate('2026-4-01'), false);
    assert.equal(isIsoDate('2026-10-31T00:00:00Z'), false);
    assert.equal(isIsoDate(20261031), false);
  });

  test('la formattazione non dipende dal fuso orario', () => {
    // Una data a mezzanotte convertita con un fuso negativo slitterebbe al giorno prima.
    assert.equal(formatDate('2026-01-01'), 'January 1, 2026');
    assert.equal(formatDate('2026-12-31'), 'December 31, 2026');
  });
});

describe('validazione dei metadati', () => {
  test('un contenuto minimo corretto non ha problemi', () => {
    assert.deepEqual(collectContentProblems(content(validBriefing())), []);
  });

  test('le fixture del prototipo sono valide', () => {
    assert.deepEqual(collectContentProblems({ briefings: fixtureBriefings }), []);
  });

  test('data inesistente o malformata', () => {
    expectProblem(content(validBriefing({ date: '2026-02-30' })), /\.date: data non valida/);
    expectProblem(content(validBriefing({ date: '10/03/2026' })), /\.date: data non valida/);
  });

  test('due briefing nello stesso giorno', () => {
    const second = validBriefing();
    second.results = [{ ...second.results[0]!, id: 'risultato-b' }];
    expectProblem(content(validBriefing(), second), /2026-03-10\.date: esiste già/);
  });

  test('id di risultato non valido o ripetuto tra briefing diversi', () => {
    const bad = validBriefing();
    bad.results = [{ ...bad.results[0]!, id: 'Risultato_A' }];
    expectProblem(content(bad), /\.id: id non valido/);
    expectProblem(content(validBriefing(), validBriefing({ date: '2026-03-11' })), /\.id: id già usato/);
  });

  test('periodo coperto incoerente', () => {
    expectProblem(
      content(validBriefing({ coverage: { from: '2026-03-09', to: '2026-03-11' } })),
      /coverage\.to: il periodo coperto termina dopo/,
    );
    expectProblem(
      content(validBriefing({ coverage: { from: '2026-03-09', to: '2026-03-08' } })),
      /coverage: il periodo coperto inizia dopo/,
    );
  });

  test('correzioni e data di aggiornamento', () => {
    const correction = { date: '2026-03-12', kind: 'minore', text: 'Refuso.' } as const;
    expectProblem(content(validBriefing({ corrections: [correction] })), /updatedOn: deve essere almeno/);
    expectProblem(
      content(validBriefing({ corrections: [correction], updatedOn: '2026-03-11' })),
      /updatedOn: deve essere almeno/,
    );
    expectProblem(
      content(validBriefing({ corrections: [{ ...correction, date: '2026-03-09' }], updatedOn: '2026-03-12' })),
      /corrections\[0\]\.date: una correzione non può precedere/,
    );
    expectProblem(content(validBriefing({ updatedOn: '2026-03-09' })), /updatedOn: l’aggiornamento non può precedere/);
    expectProblem(
      content(validBriefing({ corrections: [{ ...correction, resultId: 'altro' }], updatedOn: '2026-03-12' })),
      /resultId: il risultato "altro" non è in questo briefing/,
    );
    assert.deepEqual(
      collectContentProblems(content(validBriefing({ corrections: [correction], updatedOn: '2026-03-12' }))),
      [],
    );
  });

  test('una correzione nel giorno stesso della pubblicazione è ammessa', () => {
    const sameDay = { date: '2026-03-10', kind: 'minore', text: 'Refuso.' } as const;
    assert.deepEqual(collectContentProblems(content(validBriefing({ corrections: [sameDay], updatedOn: '2026-03-10' }))), []);
  });

  test('vocabolari chiusi per gli stati', () => {
    const bad = validBriefing();
    const base = bad.results[0]!;
    bad.results = [{ ...base, status: { ...base.status, publication: 'quasi-pubblicato' as never } }];
    expectProblem(content(bad), /status\.publication: valore "quasi-pubblicato" non ammesso/);
  });

  test('titoli e sommari restano testo semplice', () => {
    expectProblem(content(validBriefing({ title: 'Un bound $n^2$' })), /\.title: deve essere testo semplice/);
  });

  test('fonti obbligatorie e solo https', () => {
    const noSources = validBriefing();
    noSources.results = [{ ...noSources.results[0]!, sources: [] }];
    expectProblem(content(noSources), /sources: serve almeno una fonte/);

    const insecure = validBriefing();
    insecure.results = [
      { ...insecure.results[0]!, sources: [{ title: 'F', authors: [], kind: 'preprint', url: 'http://example.org' }] },
    ];
    expectProblem(content(insecure), /sources\[0\]\.url: URL assente o non https/);
  });

  test('i dati arrivati senza tipi vengono controllati a runtime', () => {
    const raw = { briefings: [{ date: '2026-03-10' }] } as unknown as RawContent;
    expectProblem(raw, /\.status: valore undefined non ammesso/);
    expectProblem(raw, /\.results: serve almeno un risultato/);
  });
});

describe('esclusione delle bozze', () => {
  test('le fixture contengono davvero una bozza di controllo', () => {
    assert.ok(fixtureBriefings.some((briefing) => briefing.status === 'bozza'));
  });

  test('il sito vede solo briefing pubblicati, in ordine dal più recente', async () => {
    const site = await getSite();
    assert.ok(site.briefings.length >= 3);
    assert.ok(site.briefings.every((briefing) => briefing.status === 'pubblicato'));
    const dates = site.briefings.map((briefing) => briefing.date);
    assert.deepEqual(dates, dates.toSorted().toReversed());
  });
});
