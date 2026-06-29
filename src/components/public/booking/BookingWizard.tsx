"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";
import { WizardProgressBar } from "@/components/public/booking/WizardProgressBar";
import { StepServiceSelect } from "@/components/public/booking/StepServiceSelect";
import { StepBarberSelect } from "@/components/public/booking/StepBarberSelect";
import { StepDateTimeSelect } from "@/components/public/booking/StepDateTimeSelect";
import { StepCustomerDetails } from "@/components/public/booking/StepCustomerDetails";
import { StepConfirmation } from "@/components/public/booking/StepConfirmation";
import type { Service, Employee } from "@/types/booking";

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const STEP_TITLES: Record<number, string> = {
  1: "Choose a Service",
  2: "Choose a Barber",
  3: "Choose a Date & Time",
  4: "Your Details",
  5: "Review & Confirm",
};

interface Props {
  services: Service[];
  employees: Employee[];
}

export function BookingWizard({
  services,
  employees,
}: Props): React.JSX.Element {
  const router = useRouter();
  const { currentStep, prevStep } = useBookingStore();
  const [serverError, setServerError] = useState<string | null>(null);

  function handleSuccess(bookingId: string, cancelToken: string): void {
    router.push(
      `/booking/confirmation?id=${bookingId}&token=${cancelToken}`,
    );
  }

  function handleError(message: string): void {
    setServerError(message);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress */}
      <WizardProgressBar currentStep={currentStep} />

      {/* Step title */}
      <div className="mb-6 flex items-center gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Go to previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <h2
          className="text-xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          {STEP_TITLES[currentStep]}
        </h2>
      </div>

      {/* Server error */}
      {serverError !== null && (
        <div
          role="alert"
          className="mb-6 rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--color-danger)",
            backgroundColor:
              "color-mix(in srgb, var(--color-danger) 8%, transparent)",
            color: "var(--color-danger)",
          }}
        >
          {serverError}
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentStep === 1 && (
            <StepServiceSelect services={services} />
          )}
          {currentStep === 2 && (
            <StepBarberSelect employees={employees} />
          )}
          {currentStep === 3 && <StepDateTimeSelect />}
          {currentStep === 4 && <StepCustomerDetails />}
          {currentStep === 5 && (
            <StepConfirmation
              onSuccess={handleSuccess}
              onError={handleError}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}