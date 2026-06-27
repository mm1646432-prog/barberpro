import { z } from "zod";

/**
 * Booking wizard validation schemas.
 * Shared between client-side forms and server-side actions.
 * Compatible with Zod 4.4.3.
 */

/* ── Step 1 — Service Selection ─────────────────────────────────────────── */

export const serviceSelectSchema = z.object({
  serviceId: z.string().uuid({ message: "Please select a valid service." }),
});

/* ── Step 2 — Barber Selection ──────────────────────────────────────────── */

export const barberSelectSchema = z.object({
  employeeId: z
    .string()
    .uuid({ message: "Please select a valid barber." })
    .or(z.literal("any")),
});

/* ── Step 3 — Date & Time Selection ─────────────────────────────────────── */

export const dateTimeSelectSchema = z.object({
  date: z.iso.date({ error: "Please select a valid date." }),
  startAt: z.iso.datetime({ error: "Please select a valid time slot." }),
});

/* ── Step 4 — Customer Details ───────────────────────────────────────────── */

export const customerDetailsSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(100, { error: "Name must be under 100 characters." }),
  email: z
    .string()
    .email({ error: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(7, { error: "Please enter a valid phone number." })
    .max(20, { error: "Phone number must be under 20 characters." }),
  note: z
    .string()
    .max(500, { error: "Note must be under 500 characters." })
    .optional(),
});

/* ── Full Booking Schema (all steps combined) ────────────────────────────── */

export const bookingSchema = serviceSelectSchema
  .merge(barberSelectSchema)
  .merge(dateTimeSelectSchema)
  .merge(customerDetailsSchema);

/* ── Inferred Types ──────────────────────────────────────────────────────── */

export type ServiceSelectData = z.infer<typeof serviceSelectSchema>;
export type BarberSelectData = z.infer<typeof barberSelectSchema>;
export type DateTimeSelectData = z.infer<typeof dateTimeSelectSchema>;
export type CustomerDetailsData = z.infer<typeof customerDetailsSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;