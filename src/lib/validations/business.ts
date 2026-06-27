import { z } from "zod";

/**
 * Business profile validation schema.
 * Shared between client-side forms and server-side actions.
 * Compatible with Zod 4.4.3.
 */

/* ── Business Profile ────────────────────────────────────────────────────── */

export const businessProfileSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Business name must be at least 2 characters." })
    .max(100, { error: "Business name must be under 100 characters." }),
  tagline: z
    .string()
    .max(200, { error: "Tagline must be under 200 characters." })
    .optional(),
  description: z
    .string()
    .max(2000, { error: "Description must be under 2000 characters." })
    .optional(),
  address: z
    .string()
    .max(300, { error: "Address must be under 300 characters." })
    .optional(),
  city: z
    .string()
    .max(100, { error: "City must be under 100 characters." })
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
  website: z
    .string()
    .url({ error: "Please enter a valid URL." })
    .optional(),
  mapsEmbed: z
    .string()
    .max(2000, { error: "Maps embed URL must be under 2000 characters." })
    .optional(),
  instagram: z
    .string()
    .url({ error: "Please enter a valid Instagram URL." })
    .optional(),
  facebook: z
    .string()
    .url({ error: "Please enter a valid Facebook URL." })
    .optional(),
  tiktok: z
    .string()
    .url({ error: "Please enter a valid TikTok URL." })
    .optional(),
  twitter: z
    .string()
    .url({ error: "Please enter a valid X/Twitter URL." })
    .optional(),
});

/* ── Booking Settings ────────────────────────────────────────────────────── */

export const bookingSettingsSchema = z.object({
  slotDurationMinutes: z
    .number()
    .int()
    .refine((val) => [15, 20, 30, 45, 60].includes(val), {
      error: "Slot duration must be 15, 20, 30, 45, or 60 minutes.",
    }),
  cancellationHours: z
    .number()
    .int()
    .min(1, { error: "Cancellation window must be at least 1 hour." })
    .max(168, { error: "Cancellation window must be under 168 hours (7 days)." }),
  reminderHours: z
    .array(z.number().int().min(1).max(168))
    .min(1, { error: "At least one reminder time is required." })
    .max(5, { error: "You may set up to 5 reminder times." }),
});

/* ── Inferred Types ──────────────────────────────────────────────────────── */

export type BusinessProfileData = z.infer<typeof businessProfileSchema>;
export type BookingSettingsData = z.infer<typeof bookingSettingsSchema>;