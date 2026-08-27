/**
 * Lightweight className combiner (Shadcn convention).
 * Merges conditional classes with Tailwind conflict resolution.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Sri Lankan Rupees without decimals. */
export function formatLKR(amount: number): string {
  return "₨" + Math.round(amount).toLocaleString("en-LK");
}
