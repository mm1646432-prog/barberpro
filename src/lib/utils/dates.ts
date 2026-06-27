/**
 * Date and time utility functions.
 *
 * Design principles:
 * - Never implicitly convert local time to UTC.
 * - All formatting functions accept an optional locale (defaults to
 *   the runtime locale) for Arabic/English localization compatibility.
 * - Calendar date strings (YYYY-MM-DD) are always derived from local
 *   time components — never from toISOString() which uses UTC.
 * - Functions that accept a timezone parameter are explicit about it.
 */

/* ── Types ───────────────────────────────────────────────────────────────── */

export type AppLocale = "en-US" | "ar-EG" | (string & {});

/* ── Formatting ──────────────────────────────────────────────────────────── */

/**
 * Formats a Date to a full human-readable date in the given locale.
 * @example formatDate(date, "en-US") → "Friday, June 27, 2026"
 * @example formatDate(date, "ar-EG") → "الجمعة، ٢٧ يونيو ٢٠٢٦"
 */
export function formatDate(date: Date, locale?: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formats a Date to a short date in the given locale.
 * @example formatDateShort(date, "en-US") → "Jun 27, 2026"
 * @example formatDateShort(date, "ar-EG") → "٢٧ يونيو ٢٠٢٦"
 */
export function formatDateShort(date: Date, locale?: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Formats a Date to a time string in the given locale.
 * Uses the local time of the Date object — no UTC conversion.
 * @example formatTime(date, "en-US") → "2:30 PM"
 * @example formatTime(date, "ar-EG") → "٢:٣٠ م"
 */
export function formatTime(date: Date, locale?: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Formats a Date to a combined date and time string in the given locale.
 * @example formatDateTime(date, "en-US") → "Jun 27, 2026 at 2:30 PM"
 */
export function formatDateTime(date: Date, locale?: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Formats a Date to a time string using an explicit IANA timezone.
 * Use this when displaying booking times across different timezones.
 * @example formatTimeInZone(date, "Africa/Cairo", "en-US") → "4:30 PM"
 */
export function formatTimeInZone(
  date: Date,
  timeZone: string,
  locale?: AppLocale,
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(date);
}

/* ── Local Calendar Date Helpers ─────────────────────────────────────────── */

/**
 * Returns the local calendar date components of a Date object.
 * Safe for booking systems — never uses UTC.
 */
function getLocalDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/**
 * Returns a local calendar date string (YYYY-MM-DD) from a Date object.
 * Does NOT use toISOString() — safe for local booking dates.
 * @example toLocalDateString(new Date(2026, 5, 27)) → "2026-06-27"
 */
export function toLocalDateString(date: Date = new Date()): string {
  const { year, month, day } = getLocalDateParts(date);
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

/**
 * Parses a local calendar date string (YYYY-MM-DD) into a Date object
 * at midnight local time — not UTC midnight.
 * Safe for use in booking calendars.
 * @example parseLocalDate("2026-06-27") → Date at local midnight
 */
export function parseLocalDate(dateString: string): Date {
  const [yearStr, monthStr, dayStr] = dateString.split("-");

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (
    !yearStr ||
    !monthStr ||
    !dayStr ||
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day)
  ) {
    throw new RangeError(`Invalid date string: "${dateString}"`);
  }

  return new Date(year, month - 1, day);
}

/**
 * Combines a local date string (YYYY-MM-DD) and a time string (HH:MM)
 * into a Date object in local time — never converted to UTC implicitly.
 * Use this for booking slot construction.
 * @example buildLocalDateTime("2026-06-27", "14:30") → Date at 2:30 PM local
 */
export function buildLocalDateTime(dateString: string, timeString: string): Date {
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const [hourStr, minuteStr] = timeString.split(":");

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hour) ||
    isNaN(minute)
  ) {
    throw new RangeError(
      `Invalid date/time: "${dateString}" / "${timeString}"`,
    );
  }

  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

/* ── Date Arithmetic ─────────────────────────────────────────────────────── */

/**
 * Adds a number of minutes to a Date and returns a new Date.
 * Preserves local time arithmetic — safe across DST boundaries.
 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/**
 * Returns true if two Date objects fall on the same local calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Returns true if the given Date is in the past.
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Returns true if the given Date falls on today's local calendar date.
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Returns a new Date set to the start of the local day (00:00:00.000).
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns a new Date set to the end of the local day (23:59:59.999).
 */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/* ── Duration ────────────────────────────────────────────────────────────── */

/**
 * Formats a duration in minutes to a human-readable string.
 * @example formatDuration(90) → "1h 30m"
 * @example formatDuration(30) → "30m"
 * @example formatDuration(60) → "1h"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/* ── Day Names ───────────────────────────────────────────────────────────── */

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DayName = (typeof DAY_NAMES)[number];

/**
 * Returns the English day name for a given day index (0 = Sunday).
 * For display, prefer formatting a Date with Intl.DateTimeFormat
 * and the user's locale instead.
 */
export function getDayName(dayOfWeek: number): DayName {
  const day = DAY_NAMES[dayOfWeek];
  if (day === undefined) {
    throw new RangeError(`dayOfWeek must be 0–6, got ${dayOfWeek}`);
  }
  return day;
}