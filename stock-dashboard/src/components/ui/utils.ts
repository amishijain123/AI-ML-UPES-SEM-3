// utils.ts
"use client";

// Import clsx for conditional classNames
import { clsx } from "clsx";

// cn function to merge class names (used in buttons, cards, accordions, etc.)
export function cn(...inputs: Parameters<typeof clsx>) {
  return clsx(...inputs);
}
