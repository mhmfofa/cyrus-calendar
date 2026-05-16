import { ADate, DateTime, HDate, JDate } from "./date-time";
import { IGlobalization } from "./interfaces";

export enum DatePickerType { Gregorian = 'gregorian', Shamsi = 'shamsi', Imperial = 'imperial', Hijri = 'hijri' }

export class DatePickerOptions {
  private _type: DatePickerType;
  private _globalization: IGlobalization;

  language: string;

  get type(): DatePickerType { return this._type; }
  set type(value: DatePickerType) {
    this._type = value;
    if (value == DatePickerType.Gregorian) {
      this._globalization = new GregorianGlobalization();
      this.language = "en";
    } else if (value == DatePickerType.Shamsi) {
      this._globalization = new ShamsiGlobalization();
      this.language = "fa";
    } else if (value == DatePickerType.Hijri) {
      this._globalization = new HijriGlobalization();
      this.language = "ar";
    } else {
      this._globalization = new ImperialGlobalization();
      this.language = "fa";
    }
  }
  get globalization(): IGlobalization { return this._globalization; }

  constructor(type: DatePickerType = DatePickerType.Gregorian) { this.type = type; }

  getMonthesName(): string[] { return this.globalization.getMonthesName(this.language); }
  getWeekDaysName(): string[] { return this.globalization.getWeekDaysName(this.language); }
  getMonthDaysCount(): number[] { return this.globalization.getMonthDaysCount(); }
}

class ImperialGlobalization implements IGlobalization {
  private _montheNames: any = {
    fa: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
  }
  private _weekDayNames: any = {
    fa: ["ش", "ی", "د", "س", "چ", "پ", "ج"]
  }
  private _monthDaysCount: number[] = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  getMonthesName(language: string): string[] { return this._montheNames[language]; }
  getWeekDaysName(language: string): string[] { return this._weekDayNames[language]; }
  getMonthDaysCount(): number[] { return this._monthDaysCount; }
  getStartDayOfWeek(year: number, month: number): number {
    let utcDate = new ADate(year, month, 1).addYear(-1180).toDate();
    return (utcDate.getDay() + 1) % 7;
  }
  getDayOfWeek(date: DateTime) {
    let res = date.getDayOfWeek();
    return res;
  }
  yesterday() { return ADate.now.addDays(-1); }
  today() {
    return ADate.now; }
  tomorow() { return ADate.now.addDays(1); }
}

class ShamsiGlobalization implements IGlobalization {
  private _montheNames: any = {
    fa: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
  }
  private _weekDayNames: any = {
    fa: ["ش", "ی", "د", "س", "چ", "پ", "ج"]
  }
  private _monthDaysCount: number[] = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  getMonthesName(language: string): string[] { return this._montheNames[language]; }
  getWeekDaysName(language: string): string[] { return this._weekDayNames[language]; }
  getMonthDaysCount(): number[] { return this._monthDaysCount; }
  getStartDayOfWeek(year: number, month: number): number {
    let jDate = new JDate(year, month, 1).toDate();
    return (jDate.getDay() + 1) % 7;
  }
  getDayOfWeek(date: DateTime) {
    let res = date.getDayOfWeek();
    return res;
  }
  yesterday() { return JDate.now.addDays(-1); }
  today() { return JDate.now; }
  tomorow() { return JDate.now.addDays(1); }
}

class GregorianGlobalization implements IGlobalization {
  private _montheNames: any = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }
  private _weekDayNames: any = {
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  }
  private _monthDaysCount: number[] = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  getMonthesName(language: string): string[] { return this._montheNames[language]; }
  getWeekDaysName(language: string): string[] { return this._weekDayNames[language]; }
  getMonthDaysCount(): number[] { return this._monthDaysCount; }
  getStartDayOfWeek(year: number, month: number): number { return (new Date(year, month - 1, 1).getDay() + 6) % 7; }
  getDayOfWeek(date: DateTime) { return date.getDayOfWeek(); }
  yesterday() { return JDate.now.addDays(-1); }
  today() { return DateTime.now; }
  tomorow() { return JDate.now.addDays(1); }
}

/**
 * HijriGlobalization — Islamic Hijri (Umm al-Qura) calendar globalization.
 * Week starts on Sunday; weekends are Friday and Saturday.
 * All date arithmetic and month-length calculations are delegated to HDate / moment-hijri.
 */
class HijriGlobalization implements IGlobalization {
  private _monthNames: any = {
    ar: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    en: ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhul Qa'da", 'Dhul Hijja'],
  };
  // Sunday-first: الأحد، الإثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت
  private _weekDayNames: any = {
    ar: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمس', 'جمع', 'سبت'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  };
  // Approximate static fallback (used only when getDaysInMonth is unavailable)
  private _monthDaysCount: number[] = [0, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

  getMonthesName(language: string): string[] { return this._monthNames[language] ?? this._monthNames['ar']; }
  getWeekDaysName(language: string): string[] { return this._weekDayNames[language] ?? this._weekDayNames['ar']; }
  getMonthDaysCount(): number[] { return this._monthDaysCount; }

  /** Exact days in month via moment-hijri (handles leap years automatically). */
  getDaysInMonth(year: number, month: number): number {
    return new HDate(year, month, 1).getDaysInMonth();
  }

  /** Leading empty cells = day-of-week (0=Sun) of the 1st of this Hijri month. */
  getStartDayOfWeek(year: number, month: number): number {
    return new HDate(year, month, 1).getStartDayOfMonth();
  }

  getDayOfWeek(date: DateTime): number { return date.getDayOfWeek(); }
  yesterday(): HDate { return HDate.now.addDays(-1); }
  today(): HDate { return HDate.now; }
  tomorow(): HDate { return HDate.now.addDays(1); }
}