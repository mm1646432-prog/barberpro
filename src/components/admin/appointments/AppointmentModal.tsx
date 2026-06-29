"use client";

import { useState, useTransition } from "react";
import {
  Loader2,
  Phone,
  Mail,
  Scissors,
  User,
  CalendarDays,
  Clock,
  FileText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { AppointmentStatusBadge } from "@/components/admin/appointments/AppointmentStatusBadge";

import {
  updateAppointmentStatusAction,
  updateAppointmentNoteAction,
} from "@/actions/appointments";

import { formatDate, formatTime } from "@/lib/utils/dates";

import {
  formatPrice,
  formatDuration,
  formatStatus,
} from "@/lib/utils/format";

import type { AdminAppointment } from "@/types/appointment";
import type { AppointmentStatus } from "@/lib/utils/format";

const STATUSES: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

interface Props {
  appointment: AdminAppointment | null;
  onClose: () => void;
}
export function AppointmentModal({
  appointment,
  onClose,
}: Props): React.JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState(appointment?.adminNote ?? "");
  const [error, setError] = useState<string | null>(null);

  const isOpen = appointment !== null;

  function handleStatusChange(status: string): void {
    if (appointment === null) return;
    setError(null);
    startTransition(async () => {
      const result = await updateAppointmentStatusAction(
        appointment.id,
        status as AppointmentStatus,
      );
      if (result.error !== null) setError(result.error);
    });
  }

  function handleNoteSave(): void {
    if (appointment === null) return;
    setError(null);
    startTransition(async () => {
      const result = await updateAppointmentNoteAction(
        appointment.id,
        note,
      );
      if (result.error !== null) setError(result.error);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {appointment !== null && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-3">
                <DialogTitle
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Appointment Details
                </DialogTitle>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
            </DialogHeader>

            <div className="mt-4 space-y-5">
              {/* Error */}
              {error !== null && (
                <p
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={{
                    borderColor: "var(--color-danger)",
                    color: "var(--color-danger)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-danger) 6%, transparent)",
                  }}
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Customer */}
              {appointment.customer !== null && (
                <section aria-label="Customer details">
                  <p
                    className="mb-2 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Customer
                  </p>
                  <div
                    className="space-y-2 rounded-lg border p-4"
                    style={{
                      backgroundColor: "var(--color-surface-raised)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <User
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: "var(--color-accent)" }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {appointment.customer.name}
                      </span>
                    </div>
                   <div className="flex items-center gap-2">
  <Mail
    className="h-3.5 w-3.5 shrink-0"
    style={{ color: "var(--color-text-muted)" }}
    aria-hidden="true"
  />

  <a
    href={`mailto:${appointment.customer.email}`}
    className="text-xs transition-colors"
    style={{ color: "var(--color-text-secondary)" }}
  >
    {appointment.customer.email}
  </a>
</div>
                    {appointment.customer.phone !== null && (
                     <div className="flex items-center gap-2">
  <Phone
    className="h-3.5 w-3.5 shrink-0"
    style={{ color: "var(--color-text-muted)" }}
    aria-hidden="true"
  />

  <a
    href={`tel:${appointment.customer.phone}`}
    className="text-xs"
    style={{ color: "var(--color-text-secondary)" }}
  >
    {appointment.customer.phone}
  </a>
</div>
                    )}
                  </div>
                </section>
              )}

              {/* Service + Employee */}
              <div className="grid grid-cols-2 gap-3">
                {appointment.service !== null && (
                  <section aria-label="Service">
                    <p
                      className="mb-2 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Service
                    </p>
                    <div
                      className="flex items-start gap-2 rounded-lg border p-3"
                      style={{
                        backgroundColor: "var(--color-surface-raised)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <Scissors
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        style={{ color: "var(--color-accent)" }}
                        aria-hidden="true"
                      />
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {appointment.service.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {formatDuration(appointment.service.durationMin)}
                        </p>
                        <p
                          className="text-xs font-bold"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {appointment.priceSnapshot !== null
                            ? formatPrice(appointment.priceSnapshot)
                            : formatPrice(appointment.service.price)}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {appointment.employee !== null && (
                  <section aria-label="Barber">
                    <p
                      className="mb-2 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Barber
                    </p>
                    <div
                      className="flex items-start gap-2 rounded-lg border p-3"
                      style={{
                        backgroundColor: "var(--color-surface-raised)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <div
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: appointment.employee.colorTag,
                        }}
                        aria-hidden="true"
                      />
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {appointment.employee.name}
                      </p>
                    </div>
                  </section>
                )}
              </div>

              {/* Date & Time */}
              <section aria-label="Date and time">
                <p
                  className="mb-2 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Date & Time
                </p>
                <div
                  className="flex items-center gap-4 rounded-lg border p-3"
                  style={{
                    backgroundColor: "var(--color-surface-raised)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--color-accent)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {formatDate(appointment.startAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--color-text-muted)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {formatTime(appointment.startAt)} –{" "}
                      {formatTime(appointment.endAt)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Customer note */}
              {appointment.customerNote !== null && (
                <section aria-label="Customer note">
                  <p
                    className="mb-2 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Customer Note
                  </p>
                  <p
                    className="rounded-lg border px-4 py-3 text-sm italic"
                    style={{
                      backgroundColor: "var(--color-surface-raised)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    &ldquo;{appointment.customerNote}&rdquo;
                  </p>
                </section>
              )}

              {/* Status change */}
              <section aria-label="Change status">
                <p
                  className="mb-2 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Change Status
                </p>
                <Select
                  defaultValue={appointment.status}
                  onValueChange={handleStatusChange}
                  disabled={isPending}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{
                      backgroundColor: "var(--color-surface-raised)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {formatStatus(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              {/* Admin note */}
              <section aria-label="Admin note">
                <p
                  className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  Admin Note
                </p>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Internal note (not visible to customer)…"
                  rows={3}
                  className="resize-none"
                  style={{
                    backgroundColor: "var(--color-surface-raised)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNoteSave}
                  disabled={isPending}
                  className="mt-2"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-bg)",
                  }}
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Save Note"
                  )}
                </Button>
              </section>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}