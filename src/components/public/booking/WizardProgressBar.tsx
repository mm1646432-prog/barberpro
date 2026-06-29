"use client";

import { cn } from "@/lib/utils/cn";
import type { BookingStep } from "@/types/booking";

interface Step {
  number: BookingStep;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: "Service" },
  { number: 2, label: "Barber" },
  { number: 3, label: "Time" },
  { number: 4, label: "Details" },
  { number: 5, label: "Confirm" },
];

interface Props {
  currentStep: BookingStep;
}

export function WizardProgressBar({ currentStep }: Props): React.JSX.Element {
  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol
        className="flex items-center justify-between gap-1"
        role="list"
      >
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li
              key={step.number}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center gap-1.5">
                {/* Circle */}
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                  )}
                  style={{
                    backgroundColor: isCompleted || isCurrent
                      ? "var(--color-accent)"
                      : "var(--color-surface)",
                    borderColor: isCompleted || isCurrent
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                    color: isCompleted || isCurrent
                      ? "var(--color-bg)"
                      : "var(--color-text-muted)",
                  }}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? "✓" : step.number}
                </div>

                {/* Label */}
                <span
                  className="hidden text-xs sm:block"
                  style={{
                    color: isCurrent
                      ? "var(--color-accent)"
                      : isCompleted
                        ? "var(--color-text-secondary)"
                        : "var(--color-text-muted)",
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className="mx-1 h-px flex-1 transition-colors duration-300"
                  style={{
                    backgroundColor: isCompleted
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                  }}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}