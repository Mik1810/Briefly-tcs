// Date editoriali come stringhe di calendario: nessun oggetto Date locale, nessun fuso orario.

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Vero solo per date `YYYY-MM-DD` esistenti nel calendario (rifiuta per esempio 2026-02-30). */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const utc = new Date(Date.UTC(y, m - 1, d));
  return utc.getUTCFullYear() === y && utc.getUTCMonth() === m - 1 && utc.getUTCDate() === d;
}

/** "2026-10-31" → "October 31, 2026" (inglese). Presuppone una data già validata. */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function yearOf(date: string): string {
  return date.slice(0, 4);
}
