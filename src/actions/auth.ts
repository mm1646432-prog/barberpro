"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface ActionResult {
  error: string | null;
  success?: string | null;
}

/* ── Login ───────────────────────────────────────────────────────────────── */

export async function loginAction(formData: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { error: firstError };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (
      error.message.toLowerCase().includes("invalid login") ||
      error.message.toLowerCase().includes("invalid credentials")
    ) {
      return { error: "Invalid email or password." };
    }
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Please confirm your email before logging in." };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/admin");
}

/* ── Logout ──────────────────────────────────────────────────────────────── */

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

/* ── Forgot Password ─────────────────────────────────────────────────────── */

export async function forgotPasswordAction(
  formData: unknown,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { error: firstError };
  }

  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo },
  );

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return {
    error: null,
    success:
      "If an account exists for that email, a reset link has been sent.",
  };
}

/* ── Reset Password ──────────────────────────────────────────────────────── */

export async function resetPasswordAction(
  formData: unknown,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { error: firstError };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("same password")) {
      return {
        error: "New password must differ from your current password.",
      };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/admin");
}