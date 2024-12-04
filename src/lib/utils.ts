import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateTimeToLocal({
  dateTime,
  formatStr = "yyyy-MM-dd hh:mm a",
}: {
  dateTime: Date;
  formatStr?: string;
}) {
  if (dateTime === null || dateTime === undefined) {
    return "";
  }

  var dateString = dateTime.toString();
  var dateObject = new Date(`${dateString}Z`);
  return format(dateObject, formatStr);
}
