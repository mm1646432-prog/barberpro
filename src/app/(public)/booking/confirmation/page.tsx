import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle, CalendarDays, Clock, Scissors, User } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { formatPrice } from "@/lib/utils/format";
import { formatDuration } from "@/lib/utils/dates";
import { CancelBookingButton } from "@/components/public/booking/CancelBookingButton";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ id?: string; token?: string }>;
}

export default async function ConfirmationPage({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const { id, token } = await searchParams;

  if (id === undefined || token === undefined) {
    notFound();
  }

  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select(
      `
      id,
      status,
      start_at,
      end_at,
      price_snapshot,
      customer_note,
      cancel_token,
      customers ( name, email, phone ),
      services ( name, duration_min ),
      employees ( name )
    `,
    )
    .eq("id", id)
    .eq("cancel_token", token)
    .single();

  if (appointment === null) {
    notFound();
  }

  const isCancelled = appointment.status === "cancelled";
  const startAt = new Date(appointment.start_at);
  const endAt = new Date(appointment.end_at);

  const customer = Array.isArray(appointment.customers)
    ? (appointment.customers[0] ?? null)
    : (appointment.customers ?? null);

  const service = Array.isArray(appointment.services)
    ? (appointment.services[0] ?? null)
    : (appointment.services ?? null);

  const employee = Array.isArray(appointment.employees)
    ? (appointment.employees[0] ?? null)
    : (appointment.employees ?? null);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      {/* Status header */}
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: isCancelled
              ? "color-mix(in srgb, var(--color-danger) 10%, transparent)"
              : "color-mix(in srgb, var(--color-success) 10%, transparent)",
          }}
        >
          <CheckCircle
            className="h-8 w-8"
            style={{
              color: isCancelled
                ? "var(--color-danger)"
                : "var(--color-success)",
            }}
          />
        </div>

        <h1
          className="text-2xl font-black"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          {isCancelled ? "Booking Cancelled" : "Booking Confirmed!"}
        </h1>

        {!isCancelled && (
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            We&apos;ll see you soon. A confirmation has been sent to{" "}
            <span style={{ color: "var(--color-text-primary)" }}>
              {customer?.email ?? "your email"}
            </span>
            .
          </p>
        )}
      </div>

      {/* Details card */}
      <div
        className="space-y-4 rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {service !== null && (
          <div className="flex items-start gap-3">
            <Scissors
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
            />
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Service
              </p>
              <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {service.name}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {appointment.price_snapshot !== null
                  ? formatPrice(appointment.price_snapshot)
                  : ""}{" "}
                · {formatDuration(service.duration_min)}
              </p>
            </div>
          </div>
        )}

        <hr style={{ borderColor: "var(--color-border)" }} />

        {employee !== null && (
          <div className="flex items-start gap-3">
            <User
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
            />
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Barber
              </p>
              <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {employee.name}
              </p>
            </div>
          </div>
        )}

        <hr style={{ borderColor: "var(--color-border)" }} />

        <div className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--color-accent)" }}
            aria-hidden="true"
          />
          <div>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Date & Time
            </p>
            <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {formatDate(startAt)}
            </p>
            <p
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatTime(startAt)} – {formatTime(endAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        {!isCancelled && (
          <CancelBookingButton cancelToken={appointment.cancel_token} />
        )}

        <Link
          href="/"
          className="flex w-full items-center justify-center rounded-lg border py-3 text-sm font-semibold transition-colors"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}