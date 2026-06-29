"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";
import { toLocalDateString, parseLocalDate, formatDate } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

interface ApiSlot {
  startAt: string;
  endAt: string;
  label: string;
}

export function StepDateTimeSelect(): React.JSX.Element {
  const {
    selectedService,
    selectedEmployee,
    anyEmployee,
    selectedDate,
    selectedSlot,
    setDateTime,
    nextStep,
  } = useBookingStore();

  const [slots, setSlots] = useState<ApiSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Date picker state ───────────────────────────────────────────────── */
  const today = toLocalDateString();
  const [pickedDate, setPickedDate] = useState<string>(
    selectedDate ?? today,
  );

  /* ── Fetch slots ─────────────────────────────────────────────────────── */
  const fetchSlots = useCallback(
    async (date: string) => {
      if (selectedService === null) return;
      const empId =
        anyEmployee || selectedEmployee === null
          ? "any"
          : selectedEmployee.id;

      setLoading(true);
      setError(null);
      setSlots([]);

      try {
        const params = new URLSearchParams({
          date,
          serviceId: selectedService.id,
          employeeId: empId,
        });
        const res = await fetch(`/api/availability?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch availability.");
        const json = (await res.json()) as { slots: ApiSlot[] };
        setSlots(json.slots);
      } catch {
        setError("Could not load availability. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [selectedService, selectedEmployee, anyEmployee],
  );

  useEffect(() => {
    void fetchSlots(pickedDate);
  }, [pickedDate, fetchSlots]);

  /* ── Date navigation helpers ─────────────────────────────────────────── */
  function changeDate(offsetDays: number): void {
    const d = parseLocalDate(pickedDate);
    d.setDate(d.getDate() + offsetDays);
    const newDate = toLocalDateString(d);
    if (newDate >= today) {
      setPickedDate(newDate);
    }
  }

  function handleSlotSelect(slot: ApiSlot): void {
    setDateTime(pickedDate, {
      startAt: new Date(slot.startAt),
      endAt: new Date(slot.endAt),
      label: slot.label,
    });
    nextStep();
  }

  const displayDate = formatDate(parseLocalDate(pickedDate));

  return (
    <div className="space-y-6">
      {/* Date navigator */}
      <div>
        <p
          className="mb-3 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Select a date
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => changeDate(-1)}
            disabled={pickedDate <= today}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-30"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Previous day"
          >
            ‹
          </button>

          <div className="flex-1 text-center">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {displayDate}
            </p>
          </div>

          <button
            type="button"
            onClick={() => changeDate(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Next day"
          >
            ›
          </button>
        </div>
      </div>

      {/* Slot grid */}
      <div>
        <p
          className="mb-3 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Available times
        </p>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2
              className="h-6 w-6 animate-spin"
              style={{ color: "var(--color-accent)" }}
            />
          </div>
        )}

        {!loading && error !== null && (
          <p
            className="py-6 text-center text-sm"
            style={{ color: "var(--color-danger)" }}
          >
            {error}
          </p>
        )}

        {!loading && error === null && slots.length === 0 && (
          <div className="py-8 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              No availability on this day.
            </p>
            <button
              type="button"
              onClick={() => changeDate(1)}
              className="mt-3 text-sm font-semibold transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              Try next day →
            </button>
          </div>
        )}

        {!loading && slots.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => {
              const isSelected =
                selectedSlot !== null &&
                new Date(slot.startAt).getTime() ===
                  selectedSlot.startAt.getTime();

              return (
                <button
                  key={slot.startAt}
                  type="button"
                  onClick={() => handleSlotSelect(slot)}
                  className={cn(
                    "rounded-lg border py-2.5 text-sm font-medium",
                    "transition-all duration-150",
                  )}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--color-accent)"
                      : "var(--color-surface)",
                    borderColor: isSelected
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                    color: isSelected
                      ? "var(--color-bg)"
                      : "var(--color-text-secondary)",
                  }}
                  aria-pressed={isSelected}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}