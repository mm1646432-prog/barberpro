"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { loginSchema, type LoginData } from "@/lib/validations/auth";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export function LoginForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginData): void {
    setServerError(null);
    startTransition(async () => {
      const result = await loginAction(data);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Server error */}
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

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs transition-colors"
            style={{ color: "var(--color-accent)" }}
            tabIndex={-1}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
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

      {/* Submit */}
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
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </>
        )}
      </Button>
    </form>
  );
}