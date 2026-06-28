import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage(): React.JSX.Element {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        }}
      />

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--color-accent)" }}
          >
            {process.env.NEXT_PUBLIC_APP_NAME ?? "BarberPro"}
          </p>
          <h1
            className="mt-2 text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reset your password
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <hr className="section-divider" />

        <ForgotPasswordForm />

        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Remembered it?{" "}
          <Link
            href="/auth/login"
            className="font-medium transition-colors"
            style={{ color: "var(--color-accent)" }}
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}