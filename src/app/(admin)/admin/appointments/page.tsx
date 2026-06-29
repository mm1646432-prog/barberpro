"use client";

import { useState, useEffect } from "react";
import { CalendarDays, List } from "lucide-react";
import { AppointmentCalendar } from "@/components/admin/appointments/AppointmentCalendar";
import { AppointmentList } from "@/components/admin/appointments/AppointmentList";
import { AppointmentModal } from "@/components/admin/appointments/AppointmentModal";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import type { AdminAppointment } from "@/types/appointment";
import type { AppointmentStatus } from "@/lib/utils/format";

type ViewMode = "calendar" | "list";

function mapAppointment(row: Record<string, unknown>): AdminAppointment {
  const customer = Array.isArray(row.customers)
    ? (row.customers[0] ?? null)
    : (row.customers ?? null);

  const service = Array.isArray(row.services)
    ? (row.services[0] ?? null)
    : (row.services ?? null);

  const employee = Array.isArray(row.employees)
    ? (row.employees[0] ?? null)
    : (row.employees ?? null);

  return {
    id: row.id as string,
    status: row.status as AppointmentStatus,
    startAt: new Date(row.start_at as string),
    endAt: new Date(row.end_at as string),
    priceSnapshot: row.price_snapshot as number | null,
    customerNote: row.customer_note as string | null,
    adminNote: row.admin_note as string | null,
    cancelToken: row.cancel_token as string,
    cancelledAt:
      row.cancelled_at !== null
        ? new Date(row.cancelled_at as string)
        : null,
    cancelledBy: row.cancelled_by as "customer" | "admin" | null,
    createdAt: new Date(row.created_at as string),
    customer:
      customer !== null
        ? {
            id: (customer as Record<string, unknown>).id as string,
            name: (customer as Record<string, unknown>).name as string,
            email: (customer as Record<string, unknown>).email as string,
            phone: (customer as Record<string, unknown>).phone as string | null,
          }
        : null,
    service:
      service !== null
        ? {
            id: (service as Record<string, unknown>).id as string,
            name: (service as Record<string, unknown>).name as string,
            durationMin: (service as Record<string, unknown>)
              .duration_min as number,
            price: (service as Record<string, unknown>).price as number,
          }
        : null,
    employee:
      employee !== null
        ? {
            id: (employee as Record<string, unknown>).id as string,
            name: (employee as Record<string, unknown>).name as string,
            avatarUrl: (employee as Record<string, unknown>)
              .avatar_url as string | null,
            colorTag: (employee as Record<string, unknown>)
              .color_tag as string,
          }
        : null,
  };
}

export default function AppointmentsPage(): React.JSX.Element {
  const [view, setView] = useState<ViewMode>("calendar");
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AdminAppointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAppointments(): Promise<void> {
      const { data } = await supabase
        .from("appointments")
        .select(
          `
          id, status, start_at, end_at, price_snapshot,
          customer_note, admin_note, cancel_token,
          cancelled_at, cancelled_by, created_at,
          customers ( id, name, email, phone ),
          services ( id, name, duration_min, price ),
          employees ( id, name, avatar_url, color_tag )
        `,
        )
        .order("start_at", { ascending: false })
        .limit(200);

      setAppointments(
        (data ?? []).map((row) =>
          mapAppointment(row as unknown as Record<string, unknown>),
        ),
      );
      setLoading(false);
    }

    void fetchAppointments();

    /* Realtime subscription */
    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => { void fetchAppointments(); },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <div className="flex items-center gap-2">
        {(["calendar", "list"] as ViewMode[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-150",
            )}
            style={{
              backgroundColor:
                view === v ? "var(--color-accent)" : "transparent",
              borderColor:
                view === v ? "var(--color-accent)" : "var(--color-border)",
              color:
                view === v
                  ? "var(--color-bg)"
                  : "var(--color-text-secondary)",
            }}
          >
            {v === "calendar" ? (
              <CalendarDays className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          className="flex h-64 items-center justify-center rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Loading appointments…
          </p>
        </div>
      ) : view === "calendar" ? (
        <AppointmentCalendar
          appointments={appointments}
          onEventClick={setSelectedAppointment}
        />
      ) : (
        <AppointmentList
          appointments={appointments}
          onSelect={setSelectedAppointment}
        />
      )}

      <AppointmentModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}