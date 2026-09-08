// Day-string helpers for streak math. Days are represented as "YYYY-MM-DD"
// strings. "Today" is derived from the server's LOCAL calendar day; arithmetic
// is done at UTC-noon to stay DST-safe.

const pad = (n: number): string => String(n).padStart(2, "0");

/** Local calendar day for a Date, as "YYYY-MM-DD". */
export const toDayString = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The server-local calendar day, as "YYYY-MM-DD". */
export const todayString = (): string => toDayString(new Date());

const parseDay = (s: string): Date => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1, 12, 0, 0));
};

const toUtcDayString = (d: Date): string =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** Add (or subtract, with a negative n) whole days to a day-string. */
export const addDays = (day: string, n: number): string => {
  const d = parseDay(day);
  d.setUTCDate(d.getUTCDate() + n);
  return toUtcDayString(d);
};

export const previousDay = (day: string): string => addDays(day, -1);

/** Whole calendar days between two day-strings (a - b). */
export const diffInDays = (a: string, b: string): number =>
  Math.round((parseDay(a).getTime() - parseDay(b).getTime()) / 86_400_000);
