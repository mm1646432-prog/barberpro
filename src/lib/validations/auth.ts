import { z } from "zod";

/**
 * Auth validation schemas.
 * Compatible with Zod 4.4.3.
 */

export const loginSchema = z.object({
  email: z.string().email({ error: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ error: "Please enter a valid email address." }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." })
      .max(72, { error: "Password must be under 72 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;