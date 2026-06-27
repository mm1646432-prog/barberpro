import { z } from "zod";

/**
 * Employee validation schemas.
 * Shared between client-side forms and server-side actions.
 * Compatible with Zod 4.4.3.
 */

/* ── Working Hours (per day) ─────────────────────────────────────────────── */

export const workingHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      error: "Start time must be in HH:MM format.",
    }),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      error: "End time must be in HH:MM format.",
    }),
  isDayOff: z.boolean().default(false),
});

/* ── Create Employee ─────────────────────────────────────────────────────── */

export const createEmployeeSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(100, { error: "Name must be under 100 characters." }),
  slug: z
    .string()
    .min(2, { error: "Slug must be at least 2 characters." })
    .max(100, { error: "Slug must be under 100 characters." })
    .regex(/^[a-z0-9-]+$/, {
      error: "Slug may only contain lowercase letters, numbers, and hyphens.",
    }),
  bio: z
    .string()
    .max(1000, { error: "Bio must be under 1000 characters." })
    .optional(),
  phone: z
    .string()
    .min(7, { error: "Please enter a valid phone number." })
    .max(20, { error: "Phone number must be under 20 characters." })
    .optional(),
  email: z
    .string()
    .email({ error: "Please enter a valid email address." })
    .optional(),
  colorTag: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, {
      error: "Color must be a valid hex value (e.g. #C9A84C).",
    })
    .default("#6366f1"),
  specialties: z
    .array(z.string().max(100))
    .max(20, { error: "You may add up to 20 specialties." })
    .default([]),
  serviceIds: z
    .array(z.string().uuid())
    .min(1, { error: "Assign at least one service to this employee." }),
  workingHours: z
    .array(workingHoursSchema)
    .length(7, { error: "Working hours must cover all 7 days." }),
});

/* ── Update Employee ─────────────────────────────────────────────────────── */

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  id: z.string().uuid({ error: "Invalid employee ID." }),
});

/* ── Inferred Types ──────────────────────────────────────────────────────── */

export type WorkingHoursData = z.infer<typeof workingHoursSchema>;
export type CreateEmployeeData = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeData = z.infer<typeof updateEmployeeSchema>;