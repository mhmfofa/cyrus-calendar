import { DateTime } from "./date-time";

export interface IGlobalization {
    getMonthesName(language: string): string[];
    getWeekDaysName(language: string): string[];
    getMonthDaysCount(): number[];
    getStartDayOfWeek(year: number,month: number): number;
    getDayOfWeek(date: DateTime): number;
    yesterday(): DateTime;
    today(): DateTime;
    tomorow(): DateTime;
}