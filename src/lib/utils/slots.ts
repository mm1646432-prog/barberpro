/**
 * Availability slot calculation utilities.
 *
 * Computes bookable time slots for a given employee, date, and service
 * duration by subtracting existing appointments and holidays from the
 * employee's working hours.
 *
 * Design principles:
 * - All logic is pure — no database calls, no side effects.
 * - Works entirely in local time — never converts to UTC implicitly.
 * - The API route and Server Actions feed data into these functions;
 *   the functions themselves are fully testable in isolation.
 */

import { addMinutes, buildLocalDateTime, isSameDay } from "@/lib/utils/dates";

/* ── Input Types ─────────────────────────────────────────────────────────── */

export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  isDayOff: boolean;
}

export interface ExistingAppointment {
  startAt: Date;
  endAt: Date;
}

export interface Holiday {
  date: string; // "YYYY-MM-DD" local date
}

export interface ShopHours {
  dayOfWeek: number;
  openTime: string;  // "HH:MM"
  closeTime: string; // "HH:MM"
  isClosed: boolean;
}

/* ── Output Types ────────────────────────────────────────────────────────── */

export interface TimeSlot {
  startAt: Date;
  endAt: Date;
  /** ISO-like local datetime string for display — not UTC */
  label: string;
}

/* ── Core Logic ──────────────────────────────────────────────────────────── */

/**
 * Returns whether a proposed slot overlaps with any existing appointment.
 */
function overlapsExisting(
  slotStart: Date,
  slotEnd: Date,
  appointments: ExistingAppointment[],
): boolean {
  return appointments.some(
    (appt) =>
      slotStart < appt.endAt && slotEnd > appt.startAt,
  );
}

/**
 * Returns whether a given local date string falls on a holiday.
 */
function isHoliday(dateString: string, holidays: Holiday[]): boolean {
  return holidays.some((h) => h.date === dateString);
}

/**
 * Generates all available time slots for a given employee on a given date.
 *
 * @param dateString      - Local calendar date "YYYY-MM-DD"
 * @param serviceDuration - Duration of the service in minutes
 * @param workingHours    - The employee's weekly schedule (all 7 days)
 * @param appointments    - Existing confirmed/pending appointments for this employee on this date
 * @param holidays        - Shop-wide and employee-specific holidays
 * @param shopHours       - Shop-wide opening hours for bounds checking
 * @param slotInterval    - Slot grid interval in minutes (e.g. 15, 30)
 * @param bufferMinutes   - Optional buffer time between appointments
 *
 * @returns Array of available TimeSlot objects in local time order
 */
export function generateAvailableSlots({
  dateString,
  serviceDuration,
  workingHours,
  appointments,
  holidays,
  shopHours,
  slotInterval,
  bufferMinutes = 0,
}: {
  dateString: string;
  serviceDuration: number;
  workingHours: WorkingHours[];
  appointments: ExistingAppointment[];
  holidays: Holiday[];
  shopHours: ShopHours[];
  slotInterval: number;
  bufferMinutes?: number;
}): TimeSlot[] {
  const date = buildLocalDateTime(dateString, "00:00");
  const dayOfWeek = date.getDay();

  // ── 1. Check shop-wide holiday ──────────────────────────────────────────
  if (isHoliday(dateString, holidays)) return [];

  // ── 2. Check shop hours ─────────────────────────────────────────────────
  const shopDay = shopHours.find((s) => s.dayOfWeek === dayOfWeek);
  if (!shopDay || shopDay.isClosed) return [];

  // ── 3. Check employee working hours ─────────────────────────────────────
  const employeeDay = workingHours.find((w) => w.dayOfWeek === dayOfWeek);
  if (!employeeDay || employeeDay.isDayOff) return [];

  // ── 4. Determine effective window (intersection of shop + employee hours)
  const effectiveStart = laterTime(shopDay.openTime, employeeDay.startTime);
  const effectiveEnd = earlierTime(shopDay.closeTime, employeeDay.endTime);

  if (effectiveStart >= effectiveEnd) return [];

  // ── 5. Build slot grid ───────────────────────────────────────────────────
  const windowStart = buildLocalDateTime(dateString, effectiveStart);
  const windowEnd = buildLocalDateTime(dateString, effectiveEnd);
  const slots: TimeSlot[] = [];
  let cursor = windowStart;

  while (cursor < windowEnd) {
    const slotEnd = addMinutes(cursor, serviceDuration);

    // Slot must finish within the working window
    if (slotEnd > windowEnd) break;

    // Apply buffer: treat the slot as occupying duration + buffer
    const slotEndWithBuffer = addMinutes(cursor, serviceDuration + bufferMinutes);

    // Check overlap with existing appointments (including buffer)
    const hasOverlap = overlapsExisting(
      cursor,
      slotEndWithBuffer,
      appointments,
    );

    // Slot must be on the correct date (sanity check)
    const isCorrectDay = isSameDay(cursor, date);

    if (!hasOverlap && isCorrectDay) {
      slots.push({
        startAt: new Date(cursor),
        endAt: slotEnd,
        label: formatSlotLabel(cursor, slotEnd),
      });
    }

    cursor = addMinutes(cursor, slotInterval);
  }

  return slots;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Returns the later of two "HH:MM" time strings.
 */
function laterTime(a: string, b: string): string {
  return a >= b ? a : b;
}

/**
 * Returns the earlier of two "HH:MM" time strings.
 */
function earlierTime(a: string, b: string): string {
  return a <= b ? a : b;
}

/**
 * Formats a slot start and end Date into a human-readable label.
 * Uses local time — no UTC conversion.
 * @example "9:00 AM – 9:30 AM"
 */
function formatSlotLabel(start: Date, end: Date): string {
  const fmt = (d: Date): string =>
    d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

/**
 * Filters out slots that start in the past.
 * Useful when generating slots for today's date.
 */
export function filterPastSlots(slots: TimeSlot[]): TimeSlot[] {
  const now = new Date();
  return slots.filter((slot) => slot.startAt > now);
}

/**
 * Groups an array of TimeSlots by their local date string (YYYY-MM-DD).
 * Useful for multi-day calendar views.
 */
export function groupSlotsByDate(
  slots: TimeSlot[],
): Record<string, TimeSlot[]> {
  return slots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    const key = [
      String(slot.startAt.getFullYear()).padStart(4, "0"),
      String(slot.startAt.getMonth() + 1).padStart(2, "0"),
      String(slot.startAt.getDate()).padStart(2, "0"),
    ].join("-");

    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});
}