import { format } from "date-fns";

export function toDateOnly(date: Date | undefined | null) {
  return date !== undefined && date !== null
    ? format(date, "yyyy-MM-dd")
    : undefined;
}
