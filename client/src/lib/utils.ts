import { clsx, type ClassValue } from "clsx";
import { addDays, addHours } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertExpiryToDate(expiry?: string) {
  let date = new Date();

  if (!expiry) return;

  switch (expiry) {
    case "1 hour":
      date = addHours(new Date(), 1);
      break;
    case "1 day":
      date = addHours(new Date(), 24);
      break;
    case "7 days":
      date = addDays(new Date(), 7);
  }

  return date.toISOString();
}
