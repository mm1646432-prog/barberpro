import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateAvailableSlots,
  filterPastSlots,
} from "@/lib/utils/slots";
import type {
  WorkingHours,
  ExistingAppointment,
  Holiday,
  ShopHours,
} from "@/lib/utils/slots";
import { toLocalDateString } from "@/lib/utils/dates";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const employeeId = searchParams.get("employeeId");

  if (date === null || serviceId === null || employeeId === null) {
    return NextResponse.json(
      { error: "Missing required parameters: date, serviceId, employeeId" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  /* ── 1. Fetch service duration ─────────────────────────────────────── */
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("duration_min")
    .eq("id", serviceId)
    .single();

  if (serviceError !== null || service === null) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  /* ── 2. Fetch business profile for slot config ─────────────────────── */
  const { data: profile } = await supabase
    .from("business_profile")
    .select("slot_duration_minutes, buffer_minutes")
    .single();

  const slotInterval = profile?.slot_duration_minutes ?? 30;
  const bufferMinutes = profile?.buffer_minutes ?? 0;

  /* ── 3. Resolve employee IDs to query ──────────────────────────────── */
  let employeeIds: string[] = [];

  if (employeeId === "any") {
    const { data: employees } = await supabase
      .from("employees")
      .select("id")
      .eq("is_active", true);
    employeeIds = (employees ?? []).map((e) => e.id);
  } else {
    employeeIds = [employeeId];
  }

  /* ── 4. Fetch shop hours ───────────────────────────────────────────── */
  const { data: shopHoursData } = await supabase
    .from("shop_hours")
    .select("day_of_week, open_time, close_time, is_closed");

  const shopHours: ShopHours[] = (shopHoursData ?? []).map((h) => ({
    dayOfWeek: h.day_of_week,
    openTime: h.open_time ?? "",
    closeTime: h.close_time ?? "",
    isClosed: h.is_closed,
  }));

  /* ── 5. Fetch shop-wide holidays ───────────────────────────────────── */
  const { data: shopHolidaysData } = await supabase
    .from("holidays")
    .select("date")
    .is("employee_id", null)
    .eq("date", date);

  const shopHolidays: Holiday[] = (shopHolidaysData ?? []).map((h) => ({
    date: h.date,
  }));

  /* ── 6. Per-employee slot generation ───────────────────────────────── */
  const allSlotSets = await Promise.all(
    employeeIds.map(async (empId) => {
      const [
        { data: workingHoursData },
        { data: empHolidaysData },
        { data: appointmentsData },
      ] = await Promise.all([
        supabase
          .from("working_hours")
          .select("day_of_week, start_time, end_time, is_day_off")
          .eq("employee_id", empId),

        supabase
          .from("holidays")
          .select("date")
          .eq("employee_id", empId)
          .eq("date", date),

        supabase
          .from("appointments")
          .select("start_at, end_at")
          .eq("employee_id", empId)
          .gte("start_at", `${date}T00:00:00`)
          .lte("start_at", `${date}T23:59:59`)
          .in("status", ["pending", "confirmed"]),
      ]);

      const workingHours: WorkingHours[] = (workingHoursData ?? []).map(
        (w) => ({
          dayOfWeek: w.day_of_week,
          startTime: w.start_time ?? "",
          endTime: w.end_time ?? "",
          isDayOff: w.is_day_off,
        }),
      );

      const holidays: Holiday[] = [
        ...shopHolidays,
        ...(empHolidaysData ?? []).map((h) => ({ date: h.date })),
      ];

      const appointments: ExistingAppointment[] = (
        appointmentsData ?? []
      ).map((a) => ({
        startAt: new Date(a.start_at),
        endAt: new Date(a.end_at),
      }));

      const slots = generateAvailableSlots({
        dateString: date,
        serviceDuration: service.duration_min,
        workingHours,
        appointments,
        holidays,
        shopHours,
        slotInterval,
        bufferMinutes,
      });

      const today = toLocalDateString();
      const filtered = date === today ? filterPastSlots(slots) : slots;

      return { employeeId: empId, slots: filtered };
    }),
  );

  /* ── 7. If "any" employee — merge + deduplicate by start time ──────── */
  if (employeeId === "any") {
    const seen = new Set<string>();
    const merged = allSlotSets
      .flatMap((s) => s.slots)
      .filter((slot) => {
        const key = slot.startAt.toISOString();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

    return NextResponse.json({
      employeeId: "any",
      slots: merged.map((s) => ({
        startAt: s.startAt.toISOString(),
        endAt: s.endAt.toISOString(),
        label: s.label,
      })),
    });
  }

  const result = allSlotSets[0];
  if (result === undefined) {
    return NextResponse.json({ employeeId, slots: [] });
  }

  return NextResponse.json({
    employeeId: result.employeeId,
    slots: result.slots.map((s) => ({
      startAt: s.startAt.toISOString(),
      endAt: s.endAt.toISOString(),
      label: s.label,
    })),
  });
}