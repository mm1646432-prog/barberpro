"use client";

import Image from "next/image";
import { useBookingStore } from "@/stores/bookingStore";
import { cn } from "@/lib/utils/cn";
import type { Employee } from "@/types/booking";

interface Props {
  employees: Employee[];
}

export function StepBarberSelect({ employees }: Props): React.JSX.Element {
  const {
    selectedEmployee,
    anyEmployee,
    selectedService,
    setEmployee,
    nextStep,
  } = useBookingStore();

  function handleSelect(employee: Employee | null, isAny: boolean): void {
    setEmployee(employee, isAny);
    nextStep();
  }

  return (
    <div className="space-y-4">
      <p
        className="text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {selectedService !== null
          ? `Who would you like for your ${selectedService.name}?`
          : "Choose your preferred barber."}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Any available option */}
        <button
          type="button"
          onClick={() => handleSelect(null, true)}
          className={cn(
            "flex items-center gap-4 rounded-xl border p-5 text-left",
            "transition-all duration-200 hover:border-[var(--color-accent)]",
          )}
          style={{
            backgroundColor: anyEmployee
              ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
              : "var(--color-surface)",
            borderColor: anyEmployee
              ? "var(--color-accent)"
              : "var(--color-border)",
          }}
          aria-pressed={anyEmployee}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed"
            style={{ borderColor: "var(--color-accent)" }}
            aria-hidden="true"
          >
            <span
              className="text-lg font-black"
              style={{ color: "var(--color-accent)" }}
            >
              ?
            </span>
          </div>
          <div>
            <p
              className="font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Any Available
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Show all available slots
            </p>
          </div>
        </button>

        {/* Individual barbers */}
        {employees.map((employee) => {
          const isSelected =
            !anyEmployee && selectedEmployee?.id === employee.id;

          return (
            <button
              key={employee.id}
              type="button"
              onClick={() => handleSelect(employee, false)}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-5 text-left",
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
              {/* Avatar */}
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                {employee.avatarUrl !== null ? (
                  <Image
                    src={employee.avatarUrl}
                    alt={employee.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full"
                    style={{ backgroundColor: employee.colorTag }}
                    aria-hidden="true"
                  >
                    <span className="text-sm font-bold text-white">
                      {employee.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p
                  className="font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {employee.name}
                </p>
                {employee.specialties.length > 0 && (
                  <p
                    className="truncate text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {employee.specialties.slice(0, 2).join(" · ")}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}