import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a date string to readable format */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });
}

/** Truncate text to N characters */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Capitalise first letter */
export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Badge color map for news categories */
export const CATEGORY_COLORS: Record<string, string> = {
  news:   "bg-sky/20 text-sky-dark",
  event:  "bg-accent/20 text-accent-dark",
  result: "bg-green-100 text-green-700",
  notice: "bg-red-100 text-red-600",
};
