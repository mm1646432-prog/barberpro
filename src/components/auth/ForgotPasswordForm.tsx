"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordData } from "@/lib/validations/auth";
import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export function ForgotPasswordForm(): React.JSX.Element {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: ForgotPasswordData): void {
    setServerError(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const result = await forgotPasswordAction(data);
      if (result.error) {
        setServerError(result.error);
      } else {
        setSuccessMessage(result.success ?? null);
      }
    });
  }

  if (successMessage !== null) {
    return (
      <div
        className="rounded-md border px-4 py-5 text-center text-sm space-y-2"
        style={{
          borderColor: "var(--color-success)",
          backgroundColor: "color-mix(in srgb, var(--color-success) 8%, transparent)",
        }}
      >
        <CheckCircle
          className="mx-auto h-6 w-6"
          style={{ color: "var(--color-success)" }}
        />
        <p style={{ color: "var(--color-text-primary)" }}>{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError !== null && (
        <div
          role="alert"
          className="rounded-md border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--color-danger)",
            backgroundColor: "color-mix(in srgb, var(--color-danger) 8%, transparent)",
            color: "var(--color-danger)",
          }}
        >
          {serverError}
        </div>
      )}

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
          autoFocus
          placeholder="admin@barberpro.com"
          disabled={isPending}
          aria-invalid={errors.email !== undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(
            "border-border bg-surface-raised text-text-primary placeholder:text-text-muted",
            "focus-visible:ring-accent focus-visible:border-accent",
            errors.email && "border-danger focus-visible:ring-danger focus-visible:border-danger",
          )}
          {...register("email")}
        />
        {errors.email && (
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

      <Button
        type="submit"
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
            Sending…
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send reset link
          </>
        )}
      </Button>
    </form>
  );
}