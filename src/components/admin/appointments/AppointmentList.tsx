"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AppointmentStatusBadge } from "@/components/admin/appointments/AppointmentStatusBadge";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { AdminAppointment } from "@/types/appointment";
import type { AppointmentStatus } from "@/lib/utils/format";

const STATUS_FILTERS: { label: string; value: AppointmentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No Show", value: "no_show" },
];

interface Props {
  appointments: AdminAppointment[];
  onSelect: (appointment: AdminAppointment) => void;
}

export function AppointmentList({
  appointments,
  onSelect,
}: Props): React.JSX.Element {
  const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");

  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesStatus =
        statusFilter === "all" || appt.status === statusFilter;

      const query = search.toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        appt.customer?.name.toLowerCase().includes(query) === true ||
        appt.customer?.email.toLowerCase().includes(query) === true ||
        appt.service?.name.toLowerCase().includes(query) === true ||
        appt.employee?.name.toLowerCase().includes(query) === true;

      return matchesStatus && matchesSearch;
    });
  }, [appointments, search, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name, email, service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
              )}
              style={{
                backgroundColor:
                  statusFilter === f.value
                    ? "var(--color-accent)"
                    : "transparent",
                borderColor:
                  statusFilter === f.value
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                color:
                  statusFilter === f.value
                    ? "var(--color-bg)"
                    : "var(--color-text-secondary)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p
          className="py-10 text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          No appointments match your filters.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--color-surface-raised)",
                    borderBottom: `1px solid var(--color-border)`,
                  }}
                >
                  {["Customer", "Service", "Barber", "Date & Time", "Price", "Status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt, index) => (
                  <tr
                    key={appt.id}
                    onClick={() => onSelect(appt)}
                    className="cursor-pointer transition-colors"
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "var(--color-surface)"
                          : "var(--color-surface-raised)",
                      borderBottom: `1px solid var(--color-border)`,
                    }}
                  >
                    <td className="px-4 py-3">
                      <p
                        className="font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {appt.customer?.name ?? "—"}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {appt.customer?.email ?? ""}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {appt.service?.name ?? "—"}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <div className="flex items-center gap-2">
                        {appt.employee !== null && (
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: appt.employee.colorTag,
                            }}
                            aria-hidden="true"
                          />
                        )}
                        {appt.employee?.name ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p style={{ color: "var(--color-text-secondary)" }}>
                        {formatDate(appt.startAt)}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {formatTime(appt.startAt)} – {formatTime(appt.endAt)}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 font-mono text-xs"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {appt.priceSnapshot !== null
                        ? formatPrice(appt.priceSnapshot)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <AppointmentStatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}