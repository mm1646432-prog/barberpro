import { z } from "zod";

/**
 * Service validation schemas.
 * Shared between client-side forms and server-side actions.
 * Compatible with Zod 4.4.3.
 */

/* ── Create Service ──────────────────────────────────────────────────────── */

export const createServiceSchema = z.object({
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
  category: z
    .string()
    .max(100, { error: "Category must be under 100 characters." })
    .optional(),
  description: z
    .string()
    .max(1000, { error: "Description must be under 1000 characters." })
    .optional(),
  durationMin: z
    .number()
    .int({ error: "Duration must be a whole number." })
    .min(5, { error: "Duration must be at least 5 minutes." })
    .max(480, { error: "Duration must be under 480 minutes." }),
  price: z
    .number()
    .nonnegative({ error: "Price must be zero or greater." })
    .multipleOf(0.01, { error: "Price may have at most 2 decimal places." }),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().int().nonnegative().default(0),
});

/* ── Update Service ──────────────────────────────────────────────────────── */

export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().uuid({ error: "Invalid service ID." }),
});

/* ── Reorder Services ────────────────────────────────────────────────────── */

export const reorderServicesSchema = z.object({
  orderedIds: z
    .array(z.string().uuid())
    .min(1, { error: "At least one service ID is required." }),
});

/* ── Inferred Types ──────────────────────────────────────────────────────── */

export type CreateServiceData = z.infer<typeof createServiceSchema>;
export type UpdateServiceData = z.infer<typeof updateServiceSchema>;
export type ReorderServicesData = z.infer<typeof reorderServicesSchema>;