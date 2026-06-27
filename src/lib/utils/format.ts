/**
 * General formatting utility functions.
 *
 * Design principles:
 * - Locale-aware — no hardcoded "en-US".
 * - Compatible with Arabic/English localization.
 * - Pure functions — no side effects, no external dependencies.
 */

/* ── Types ───────────────────────────────────────────────────────────────── */

export type AppLocale = "en-US" | "ar-EG" | (string & {});

/* ── Currency & Price ────────────────────────────────────────────────────── */

/**
 * Formats a numeric price as a currency string.
 * @example formatPrice(25, "USD", "en-US") → "$25.00"
 * @example formatPrice(25, "EGP", "ar-EG") → "٢٥٫٠٠ ج.م."
 */
export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale?: AppLocale,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a price as a plain decimal string without currency symbol.
 * Useful for input field display.
 * @example formatPricePlain(25.5, "en-US") → "25.50"
 */
export function formatPricePlain(
  amount: number,
  locale?: AppLocale,
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/* ── Phone ───────────────────────────────────────────────────────────────── */

/**
 * Formats a raw phone number string for display.
 * Strips non-numeric characters before formatting.
 * Falls back to the raw string if length is unrecognised.
 * @example formatPhone("12025550123") → "+1 (202) 555-0123"
 * @example formatPhone("01012345678") → "010 1234 5678"
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  // US/CA: 11 digits starting with 1
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // US/CA: 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Egypt: 11 digits starting with 0
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // Fallback — return as-is
  return raw;
}

/* ── Text ────────────────────────────────────────────────────────────────── */

/**
 * Truncates a string to a maximum length and appends an ellipsis.
 * @example truncate("Hello world", 8) → "Hello wo…"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

/**
 * Converts a string to a URL-safe slug.
 * @example toSlug("Fade & Taper") → "fade-taper"
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Capitalises the first letter of a string.
 * @example capitalise("barber") → "Barber"
 */
export function capitalise(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Returns a person's initials from their full name (max 2 letters).
 * @example getInitials("Marcus James") → "MJ"
 * @example getInitials("Jordan") → "J"
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/* ── Numbers ─────────────────────────────────────────────────────────────── */

/**
 * Formats a number with locale-aware grouping separators.
 * @example formatNumber(1000, "en-US") → "1,000"
 * @example formatNumber(1000, "ar-EG") → "١٬٠٠٠"
 */
export function formatNumber(value: number, locale?: AppLocale): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats a number as a percentage string.
 * @example formatPercent(0.856, "en-US") → "85.6%"
 */
export function formatPercent(
  value: number,
  locale?: AppLocale,
  fractionDigits: number = 1,
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/* ── Appointment Status ──────────────────────────────────────────────────── */

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

/**
 * Returns a human-readable label for an appointment status.
 */
export function formatStatus(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No Show",
  };
  return labels[status];
}