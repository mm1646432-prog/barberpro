"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBookingStore } from "@/stores/bookingStore";
import { customerDetailsSchema } from "@/lib/validations/booking";
import type { CustomerDetailsData } from "@/lib/validations/booking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function StepCustomerDetails(): React.JSX.Element {
  const { customerName, customerEmail, customerPhone, customerNote,
    setCustomerDetails, nextStep } = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerDetailsData>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      note: customerNote,
    },
  });

  function onSubmit(data: CustomerDetailsData): void {
    setCustomerDetails({
      name: data.name,
      email: data.email,
      phone: data.phone,
      note: data.note ?? "",
    });
    nextStep();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <p
        className="text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Your details so we can confirm your booking.
      </p>

      {/* Name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="name"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Full name
        </Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Alex Johnson"
          aria-invalid={errors.name !== undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(
            "border-border bg-surface-raised text-text-primary placeholder:text-text-muted",
            errors.name !== undefined && "border-danger",
          )}
          {...register("name")}
        />
        {errors.name !== undefined && (
          <p
            id="name-error"
            role="alert"
            className="text-xs"
            style={{ color: "var(--color-danger)" }}
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          aria-invalid={errors.email !== undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(
            "border-border bg-surface-raised text-text-primary placeholder:text-text-muted",
            errors.email !== undefined && "border-danger",
          )}
          {...register("email")}
        />
        {errors.email !== undefined && (
          <p
            id="email-error"
            role="alert"
            className="text-xs"
            style={{ color: "var(--color-danger)" }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label
          htmlFor="phone"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Phone number
        </Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          aria-invalid={errors.phone !== undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={cn(
            "border-border bg-surface-raised text-text-primary placeholder:text-text-muted",
            errors.phone !== undefined && "border-danger",
          )}
          {...register("phone")}
        />
        {errors.phone !== undefined && (
          <p
            id="phone-error"
            role="alert"
            className="text-xs"
            style={{ color: "var(--color-danger)" }}
          >
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <Label
          htmlFor="note"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Note{" "}
          <span style={{ color: "var(--color-text-muted)" }}>
            (optional)
          </span>
        </Label>
        <Textarea
          id="note"
          placeholder="Any preferences or special requests…"
          rows={3}
          className="border-border bg-surface-raised text-text-primary placeholder:text-text-muted resize-none"
          {...register("note")}
        />
        {errors.note !== undefined && (
          <p
            role="alert"
            className="text-xs"
            style={{ color: "var(--color-danger)" }}
          >
            {errors.note.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full font-semibold"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-bg)",
        }}
      >
        Review Booking
      </Button>
    </form>
  );
}