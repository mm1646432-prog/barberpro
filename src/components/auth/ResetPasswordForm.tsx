"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordData } from "@/lib/validations/auth";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export function ResetPasswordForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(data: ResetPasswordData): void {
    setServerError(null);
    startTransition(async () => {
      const result = await resetPasswordAction(data);
      if (result?.error) {
        setServerError(result.error);
      }
    });
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

      {/* New password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="password"
          style={{ color: "var(--color-text-secondary)" }}
        >
          New password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isPending}
            aria-invalid={errors.password !== undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={cn(
              "border-border bg-surface-raised text-text-primary placeholder:text-text-muted pr-10",
              "focus-visible:ring-accent focus-visible:border-accent",
              errors.password && "border-danger focus-visible:ring-danger focus-visible:border-danger",
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-xs"
            style={{ color: "var(--color-danger)" }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="confirmPassword"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Confirm new password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isPending}
            aria-invalid={errors.confirmPassword !== undefined}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            className={cn(
              "border-border bg-surface-raised text-text-primary placeholder:text-text-muted pr-10",
              "focus-visible:ring-accent focus-visible:border-accent",
              errors.confirmPassword && "border-danger focus-visible:ring-danger focus-visible:border-danger",
            )}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p
            id="confirm-error"
            role="alert"
            className="text-xs"
            style={{ color: "var(--color-danger)" }}
          >
            {errors.confirmPassword.message}
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
            Updating…
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Set new password
          </>
        )}
      </Button>
    </form>
  );
}