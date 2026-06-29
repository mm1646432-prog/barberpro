import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { formatDate, formatTime } from "@/lib/utils/dates";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/* ── Stat Card ───────────────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}

function StatCard({
  label,
  value,
  icon,
  sub,
}: StatCardProps): React.JSX.Element {
  return (
    <div
      className="flex items-start justify-between rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="space-y-1">
        <p
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-2xl font-black"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          {value}
        </p>
        {sub !== undefined && (
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {sub}
          </p>
        )}
      </div>

      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-accent) 10%, transparent)",
          color: "var(--color-accent)",
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
  );
}

/* ── Appointment Row ─────────────────────────────────────────────────────── */

interface AppointmentRowProps {
  name: string;
  service: string;
  startAt: Date;
  status: string;
}

function AppointmentRow({
  name,
  service,
  startAt,
  status,
}: AppointmentRowProps): React.JSX.Element {
  const statusColors: Record<string, string> = {
    confirmed: "var(--color-success)",
    pending: "var(--color-warning)",
    cancelled: "var(--color-danger)",
    completed: "var(--color-text-muted)",
    no_show: "var(--color-danger)",
  };

  const color = statusColors[status] ?? "var(--color-text-muted)";

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {name}
        </p>
        <p
          className="truncate text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {service}
        </p>
      </div>

      <div className="text-right">
        <p
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {formatTime(startAt)}
        </p>
        <p
          className="text-xs capitalize"
          style={{ color }}
        >
          {status.replace("_", " ")}
        </p>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  const supabase = await createClient();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0] as string;
  const startOfMonth = `${todayStr.slice(0, 7)}-01`;

  const [
    { data: todayAppointments },
    { data: monthAppointments },
    { data: totalCustomers },
    { data: upcomingAppointments },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .gte("start_at", `${todayStr}T00:00:00`)
      .lte("start_at", `${todayStr}T23:59:59`)
      .in("status", ["confirmed", "pending"]),

    supabase
      .from("appointments")
      .select("price_snapshot")
      .gte("start_at", `${startOfMonth}T00:00:00`)
      .eq("status", "completed"),

    supabase
      .from("customers")
      .select("id", { count: "exact" }),

    supabase
      .from("appointments")
      .select(
        `
        id,
        start_at,
        status,
        customers ( name ),
        services ( name )
      `,
      )
      .gte("start_at", new Date().toISOString())
      .in("status", ["confirmed", "pending"])
      .order("start_at")
      .limit(8),
  ]);

  const todayCount = todayAppointments?.length ?? 0;
  const totalCustomerCount = totalCustomers?.length ?? 0;

  const monthRevenue = (monthAppointments ?? []).reduce(
    (sum, a) => sum + (a.price_snapshot ?? 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--color-accent)" }}
        >
          {formatDate(today)}
        </p>
        <h2
          className="mt-1 text-2xl font-black"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          Good{" "}
          {today.getHours() < 12
            ? "morning"
            : today.getHours() < 17
              ? "afternoon"
              : "evening"}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Today's Appointments"
          value={String(todayCount)}
          icon={<CalendarDays className="h-5 w-5" />}
          sub="confirmed + pending"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatPrice(monthRevenue)}
          icon={<TrendingUp className="h-5 w-5" />}
          sub="completed bookings this month"
        />
        <StatCard
          label="Total Customers"
          value={String(totalCustomerCount)}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Upcoming appointments */}
      <div>
        <h3
          className="mb-4 flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Clock
            className="h-4 w-4"
            style={{ color: "var(--color-accent)" }}
            aria-hidden="true"
          />
          Upcoming Appointments
        </h3>

        {(upcomingAppointments ?? []).length === 0 ? (
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            No upcoming appointments.
          </p>
        ) : (
          <div className="space-y-2">
            {(upcomingAppointments ?? []).map((appt) => {
              const customer = Array.isArray(appt.customers)
                ? (appt.customers[0] ?? null)
                : (appt.customers ?? null);

              const service = Array.isArray(appt.services)
                ? (appt.services[0] ?? null)
                : (appt.services ?? null);

              return (
                <AppointmentRow
                  key={appt.id}
                  name={customer?.name ?? "Unknown"}
                  service={service?.name ?? "Unknown"}
                  startAt={new Date(appt.start_at)}
                  status={appt.status}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}