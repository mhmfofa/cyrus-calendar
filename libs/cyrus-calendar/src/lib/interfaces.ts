import { DateTime } from "./date-time";

export interface IGlobalization {
    getMonthesName(language: string): string[];
    getWeekDaysName(language: string): string[];
    getMonthDaysCount(): number[];
    /** Returns the exact number of days in a given month/year. When defined,
     *  this takes precedence over getMonthDaysCount() in the day-grid renderer.
     *  Required for calendars with variable month lengths (e.g. Hijri). */
    getDaysInMonth?(year: number, month: number): number;
    getStartDayOfWeek(year: number, month: number): number;
    getDayOfWeek(date: DateTime): number;
    yesterday(): DateTime;
    today(): DateTime;
    tomorow(): DateTime;
}