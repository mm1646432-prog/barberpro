"use client";

import { useTransition } from "react";
import { Loader2, CalendarDays, Clock, User, Scissors } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { formatPrice } from "@/lib/utils/format";
import { formatDuration } from "@/lib/utils/dates";
import { createBookingAction } from "@/actions/bookings";
import { Button } from "@/components/ui/button";

interface Props {
  onSuccess: (bookingId: string, cancelToken: string) => void;
  onError: (message: string) => void;
}

export function StepConfirmation({ onSuccess, onError }: Props): React.JSX.Element {
  const [isPending, startTransition] = useTransition();
  const store = useBookingStore();

  const {
    selectedService,
    selectedEmployee,
    anyEmployee,
    selectedDate,
    selectedSlot,
    customerName,
    customerEmail,
    customerPhone,
    customerNote,
  } = store;

  function handleConfirm(): void {
    if (
      selectedService === null ||
      selectedSlot === null ||
      selectedDate === null
    ) {
      onError("Missing booking details. Please start again.");
      return;
    }

    startTransition(async () => {
      const result = await createBookingAction({
        serviceId: selectedService.id,
        employeeId:
          anyEmployee || selectedEmployee === null
            ? "any"
            : selectedEmployee.id,
        startAt: selectedSlot.startAt.toISOString(),
        endAt: selectedSlot.endAt.toISOString(),
        customerName,
        customerEmail,
        customerPhone,
        customerNote,
        priceSnapshot: selectedService.price,
      });

      if (result.error !== null) {
        onError(result.error);
      } else if (result.data !== null) {
        store.reset();
        onSuccess(result.data.id, result.data.cancelToken);
      }
    });
  }

  if (
    selectedService === null ||
    selectedSlot === null ||
    selectedDate === null
  ) {
    return (
      <p className="text-sm" style={{ color: "var(--color-danger)" }}>
        Incomplete booking data. Please go back and try again.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p
        className="text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Please review your booking before confirming.
      </p>

      {/* Summary card */}
      <div
        className="space-y-4 rounded-xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Service */}
        <div className="flex items-start gap-3">
          <Scissors
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--color-accent)" }}
            aria-hidden="true"
          />
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Service
            </p>
            <p
              className="font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {selectedService.name}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {formatPrice(selectedService.price)} ·{" "}
              {formatDuration(selectedService.durationMin)}
            </p>
          </div>
        </div>

        <hr style={{ borderColor: "var(--color-border)" }} />

        {/* Barber */}
        <div className="flex items-start gap-3">
          <User
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--color-accent)" }}
            aria-hidden="true"
          />
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Barber
            </p>
            <p
              className="font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {anyEmployee || selectedEmployee === null
                ? "Any Available"
                : selectedEmployee.name}
            </p>
          </div>
        </div>

        <hr style={{ borderColor: "var(--color-border)" }} />

        {/* Date & time */}
        <div className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--color-accent)" }}
            aria-hidden="true"
          />
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Date & Time
            </p>
            <p
              className="font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {formatDate(selectedSlot.startAt)}
            </p>
            <p
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatTime(selectedSlot.startAt)} –{" "}
              {formatTime(selectedSlot.endAt)}
            </p>
          </div>
        </div>

        <hr style={{ borderColor: "var(--color-border)" }} />

        {/* Customer */}
        <div className="flex items-start gap-3">
          <User
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--color-accent)" }}
            aria-hidden="true"
          />
          <div>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Your Details
            </p>
            <p
              className="font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {customerName}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {customerEmail} · {customerPhone}
            </p>
            {customerNote.length > 0 && (
              <p
                className="mt-1 text-xs italic"
                style={{ color: "var(--color-text-muted)" }}
              >
                &ldquo;{customerNote}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleConfirm}
        disabled={isPending}
        className="w-full font-semibold"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-bg)",
        }}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Confirming…
          </>
        ) : (
          "Confirm Booking"
        )}
      </Button>
    </div>
  );
}