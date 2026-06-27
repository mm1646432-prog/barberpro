import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names without conflicts.
 *
 * Combines `clsx` (conditional classes) with `tailwind-merge`
 * (resolves duplicate or conflicting Tailwind utilities).
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-accent", className)
 * cn("text-sm text-lg") // → "text-lg" (conflict resolved)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}