import { format } from "date-fns";

export class DateFormatter {
  static getMonthName(month: number): string {
    return format(new Date(2023, month - 1, 1), "MMM", { locale: undefined });
  }
}
