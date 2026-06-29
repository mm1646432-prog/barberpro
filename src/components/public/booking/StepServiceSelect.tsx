"use client";

import { Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { formatDuration } from "@/lib/utils/dates";
import { useBookingStore } from "@/stores/bookingStore";
import { cn } from "@/lib/utils/cn";
import type { Service } from "@/types/booking";

interface Props {
  services: Service[];
}

export function StepServiceSelect({ services }: Props): React.JSX.Element {
  const { selectedService, setService, nextStep } = useBookingStore();

  function handleSelect(service: Service): void {
    setService(service);
    nextStep();
  }

  return (
    <div className="space-y-4">
      <p
        className="text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Choose the service you&apos;d like to book.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => handleSelect(service)}
              className={cn(
                "group relative flex flex-col gap-3 rounded-xl border p-5 text-left",
                "transition-all duration-200 hover:border-[var(--color-accent)]",
              )}
              style={{
                backgroundColor: isSelected
                  ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
                  : "var(--color-surface)",
                borderColor: isSelected
                  ? "var(--color-accent)"
                  : "var(--color-border)",
              }}
              aria-pressed={isSelected}
            >
              {/* Selected indicator */}
              {isSelected && (
                <span
                  className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-bg)",
                  }}
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}

              {service.category !== null && service.category.length > 0 && (
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-accent)" }}
                >
                  {service.category}
                </span>
              )}

              <span
                className="font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {service.name}
              </span>

              {service.description !== null &&
                service.description.length > 0 && (
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {service.description}
                  </span>
                )}

              <div className="flex items-center gap-4">
                <span
                  className="font-black"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {formatPrice(service.price)}
                </span>
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {formatDuration(service.durationMin)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}