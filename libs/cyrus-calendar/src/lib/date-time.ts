import * as moment from 'jalali-moment'

export class DateTime {
  protected year: number;
  protected month: number;
  protected day: number;

  protected hour: number;
  protected minute: number;
  protected second: number;
  protected calendarType: 'shamsi' | 'imperial' | 'gregorian';

  get invalid(): boolean { return this.year == -1 || this.month == -1 || this.day == -1 || this.hour == -1 || this.minute == -1 || this.second == -1; }
  get value(): string { return `${this.year * 10000 + this.month * 100 + this.day}${this.hour < 10 ? '0' : ''}${this.hour * 10000 + this.minute * 100 + this.second}`; }

  public constructor(year: number = -1, month: number = -1, day: number = -1, hour: number = -1, minute: number = -1, second: number = -1, calendarType = 'imperial') {
    this.setYear(year);
    this.setMonth(month);
    this.setDay(day);
    this.setHour(hour);
    this.setMinute(minute);
    this.setSecond(second);
    this.setCalendarType(calendarType);
  }
  public setYear(year: number): DateTime { this.year = (year >= 0 ? year : -1); return this; }
  public setMonth(month: number): DateTime { this.month = (month >= 0 && month <= 12 ? month : -1); return this; }
  public setDay(day: number): DateTime { this.day = (day >= 0 && day <= 31 ? day : -1); return this; }

  public setHour(hour: number): DateTime { this.hour = (hour >= 0 && hour <= 23 ? hour : -1); return this; }
  public setMinute(minute: number): DateTime { this.minute = (minute >= 0 && minute <= 59 ? minute : -1); return this; }
  public setSecond(second: number): DateTime { this.second = (second >= 0 && second <= 59 ? second : -1); return this; }
  public setCalendarType(calendarType): DateTime { this.calendarType = calendarType; return this; }

  public getYear(): number { return this.year; }
  public getMonth(): number { return this.month; }
  public getDay(): number { return this.day; }

  public getHour(): number { return this.hour; }
  public getMinute(): number { return this.minute; }
  public getSecond(): number { return this.second; }
  public getCalendarType(): string { return this.calendarType; }

  public getStartDayOfMonth(): number { let date = this.clone().setDay(1).toDate(); return date.getDay(); }
  public getDayOfWeek(): number { return (this.getStartDayOfMonth() + this.day) % 7; }

  public isLeapYear(calendarType: string): boolean { 
    let year = this.getYear();
    if (calendarType == 'imperial') year -= 1180;
    return calendarType == 'gregorian' ? ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) : moment.jIsLeapYear(year); 
  }

  public equalsDate(date: DateTime): boolean { return this.value.substr(0, 8) == date.value.substr(0, 8); }
  public equalsTime(date: DateTime): boolean { return this.value.substr(8, 6) == date.value.substr(8, 6); }
  public equals(date: DateTime): boolean { return this.value == date.value; }
  public smallerDate(date: DateTime): boolean { return this.value.substr(0, 8) < date.value.substr(0, 8); }
  public smallerTime(date: DateTime): boolean { return this.value.substr(8, 6) < date.value.substr(8, 6); }
  public smaller(date: DateTime): boolean { return this.value < date.value; }
  public greaterDate(date: DateTime): boolean { return this.value.substr(0, 8) > date.value.substr(0, 8); }
  public greaterTime(date: DateTime): boolean { return this.value.substr(8, 6) > date.value.substr(8, 6); }
  public greater(date: DateTime): boolean { return this.value > date.value; }

  public addSeconds(value: number): DateTime {
    let dif = this.second + value;
    let remain = Math.floor(dif % 60);
    let added = Math.floor(dif / 60);
    if (dif < 0) { this.second = remain + 60; }
    else this.second = remain;
    if (added != 0) this.addMinutes(added);
    return this;
  }
  public addMinutes(value: number): DateTime {
    let dif = this.minute + value;
    let remain = Math.floor(dif % 60);
    let added = Math.floor(dif / 60);
    if (dif < 0) { this.minute = remain + 60; }
    else this.minute = remain;
    if (added != 0) this.addHours(added);
    return this;
  }
  public addHours(value: number): DateTime {
    let dif = this.hour + value;
    let remain = Math.floor(dif % 24);
    let added = Math.floor(dif / 24);
    if (dif < 0) { this.hour = remain + 24; }
    else this.hour = remain;
    if (added != 0) this.addDays(added);
    return this;
  }
  public addDays(value: number): DateTime {
    let dif = this.day + value;
    let remain = Math.floor(dif % 31);
    let added = Math.floor(dif / 31);
    if (dif < 1) { this.day = remain + 31; if (dif >= 0) added--; }
    else this.day = remain;
    if (added != 0) this.addMonth(added);
    return this;
  }
  public addMonth(value: number): DateTime {
    let dif = this.month + value;
    let remain = Math.floor(dif % 12);
    let added = Math.floor(dif / 12);
    if (dif < 1) { this.month = remain + 12; if (dif >= 0) added--; }
    else this.month = remain;
    if (added != 0) this.addYear(added);
    return this;
  }
  public addYear(value: number): DateTime {
    this.year += value;
    return this;
  }

  public format(format: string = 'yyyy/MM/dd hh:mm:ss'): string { return DateTime.format(this, format); }
  public toDate(): Date { return DateTime.toDate(this); }
  public toJDate(): JDate { return DateTime.toJDate(this); }
  public toADate(): ADate { return DateTime.toADate(this); }
  public clone(): DateTime { return new DateTime(this.year, this.month, this.day, this.hour, this.minute, this.second); }

  protected static parseOnce(value: string, format: string, find: string): number {
    let index = format.indexOf(find);
    if (index > -1) {
      let sub = value.substring(index, index + find.length);
      if (sub) {
        let result = parseInt(sub);
        if (result + '' != 'NaN') return result;
        return -1;
      }
    }
    return 0;
  }
  public static parse(value: string, format: string = 'yyyy/MM/dd hh:mm:ss'): DateTime {
    if (value) {
      return new DateTime(
        DateTime.parseOnce(value, format, 'yyyy'),
        DateTime.parseOnce(value, format, 'MM'),
        DateTime.parseOnce(value, format, 'dd'),
        DateTime.parseOnce(value, format, 'hh'),
        DateTime.parseOnce(value, format, 'mm'),
        DateTime.parseOnce(value, format, 'ss'),
      );
    }
    return new DateTime;
  }
  public static format(value: Date | DateTime | JDate | ADate, format: string = 'yyyy/MM/dd hh:mm:ss'): string {
    let year, month, day, hour, minute, second;
    if (value instanceof Date) {
      year = value.getFullYear();
      month = value.getMonth() + 1;
      day = value.getDate();
      hour = value.getHours();
      minute = value.getMinutes();
      second = value.getSeconds();
    } else {
      year = value.getYear();
      month = value.getMonth();
      day = value.getDay();
      hour = value.getHour();
      minute = value.getMinute();
      second = value.getSecond();
    }
    format = format.replace(/yyyy/g, year.toString());
    format = format.replace(/MM/g, (month < 10 ? '0' + month : month).toString());
    format = format.replace(/dd/g, (day < 10 ? '0' + day : day).toString());
    format = format.replace(/hh/g, (hour < 10 ? '0' + hour : hour).toString());
    format = format.replace(/mm/g, (minute < 10 ? '0' + minute : minute).toString());
    format = format.replace(/ss/g, (second < 10 ? '0' + second : second).toString());
    return format;
  }
  public static toDateTime(date: Date | JDate | ADate): DateTime {
    if (date instanceof Date) return new DateTime(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    else return new DateTime(date.getYear(), date.getMonth(), date.getDay(), date.getHour(), date.getMinute(), date.getSecond());
  }
  public static toDate(date: DateTime): Date {
    // console.log(date);
    return new Date (moment.from(date.format("yyyy/MM/dd"), 'fa').format('YYYY-MM-DD'));
  }

  public static toJDate(date: Date| DateTime): JDate {
    let year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;
    var myDate = null;
    if (date instanceof Date) {
      myDate = moment(date.toISOString().split('T')[0]).locale('fa');
      hour = date.getHours();
      minute = date.getMinutes();
      second = date.getSeconds();
    } else {
      myDate = moment(new Date(date.format("yyyy-MM-dd"))).locale('fa');
      hour = date.getHour();
      minute = date.getMinute();
      second = date.getSecond();
    }
    year = parseInt(myDate.format("YYYY"));
    month = parseInt(myDate.format("MM"));
    day = parseInt(myDate.format("DD"));

    return new JDate(year, month, day, hour, minute, second);
  }

  public static toADate(date: Date | DateTime | string): ADate {
    if(typeof date === "string") {
      date = new Date(date);
    }
    let year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;
    var myDate = null;
    if (date instanceof Date) {
      myDate = moment(moment(new Date(date)).locale('fa').format('YYYY/MM/DD'));
      hour = date.getHours();
      minute = date.getMinutes();
      second = date.getSeconds();
    } else {
      myDate = moment(new Date(date.format("yyyy-MM-dd"))).locale('fa');
      hour = date.getHour();
      minute = date.getMinute();
      second = date.getSecond();
    }
    year = parseInt(myDate.format("YYYY")) + 1180;
    month = parseInt(myDate.format("MM"));
    day = parseInt(myDate.format("DD"));

    return new ADate(year, month, day, hour, minute, second);
  }

  public static parseJDate(value: string, format: string = 'yyyy/MM/dd hh:mm:ss'): JDate {
    let date = this.parse(value, format);
    return new JDate(date.getYear(), date.getMonth(), date.getDay(), date.getHour(), date.getMinute(), date.getSecond());
  }

  public static parseADate(value: string, format: string = 'yyyy/MM/dd hh:mm:ss'): ADate {
    let date = this.parse(value, format);
    return new ADate(date.getYear(), date.getMonth(), date.getDay(), date.getHour(), date.getMinute(), date.getSecond());
  }

  public static parseDate(value: string, format: string = 'yyyy/MM/dd hh:mm:ss'): Date {
    let date = this.parse(value, format);
    return new Date(date.getYear(), date.getMonth() - 1, date.getDay(), date.getHour(), date.getMinute(), date.getSecond());
  }

  public static parseDateTime(value: string, format: string = 'yyyy/MM/dd hh:mm:ss'): DateTime {
    return DateTime.toDateTime(DateTime.parseDate(value, format));
  }

  public static convertJDateToADate(value: string, format: string = 'yyyy/MM/dd hh:mm:ss'): ADate {
    let jDate = this.parseJDate(value, format);
    let year = jDate.getYear();
    jDate.setYear(year + 1180);
    return new ADate(jDate.year, jDate.month, jDate.day, jDate.hour, jDate.minute, jDate.second)
  }

  public static convertADateToJDate(value: string, format: string = 'yyyy/MM/dd hh:mm:ss'): JDate {
    let aDate = this.parseADate(value, format);
    let year = aDate.getYear();
    aDate.setYear(year - 1180);
    return new JDate(aDate.year, aDate.month, aDate.day, aDate.hour, aDate.minute, aDate.second)
  }

  

  public static get now(): DateTime { return DateTime.toDateTime(new Date()); }
}

export class JDate extends DateTime {
  private days: number[] = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30]

  public constructor(year: number = -1, month: number = -1, day: number = -1, hour: number = -1, minute: number = -1, second: number = -1) { super(year, month, day, hour, minute, second); }

  public getStartDayOfMonth(): number {
    let date = this.clone().setDay(2).toDate();
    return date.getDay();
  }
  public getDayOfWeek(): number {
    let getStartDayOfMonth = this.getStartDayOfMonth()
    return (getStartDayOfMonth + this.day) % 7;
  }

  public addDays(value: number): DateTime {
    if (value < 0) {
      value *= -1;
      if (value > 365) { this.year -= Math.floor(value / 365); value = Math.floor(value % 365); }
      while (value > this.days[this.month - 1]) {
        value -= this.days[this.month - 1];
        this.addMonth(-1);
      }
      this.day -= value;
      if (this.day < 1) { this.addMonth(-1); this.day = this.days[this.month - 1] + this.day; }
    }
    else {
      if (value > 365) { this.year += Math.floor(value / 365); value = Math.floor(value % 365); }
      while (value > this.days[this.month - 1]) {
        value -= this.days[this.month - 1];
        this.addMonth(1);
        if (this.month > 12) { this.year++; this.month = 1; }
      }
      this.day += value;
      if (this.day > this.days[this.month - 1]) { this.day -= this.days[this.month - 1]; this.addMonth(1); }
    }
    return this;
  }

  public toDateString(): string { return `${this.year}/${this.month}/${this.day}`; }

  public toDateTimeString(): string { return `${this.year}/${this.month}/${this.day} ${this.hour}/${this.minute}/${this.second}`; }

  public clone(): JDate { return new JDate(this.year, this.month, this.day, this.hour, this.minute, this.second); }

  public static get now(): JDate { return DateTime.toJDate(DateTime.now); }
}

export class ADate extends DateTime {
  private days: number[] = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30]

  public constructor(year: number = -1, month: number = -1, day: number = -1, hour: number = -1, minute: number = -1, second: number = -1) { 
    super(year, month, day, hour, minute, second); }

  public getStartDayOfMonth(): number {
    let date = this.clone().setDay(2).toDate();
    return date.getDay();
  }
  public getDayOfWeek(): number {
    let getStartDayOfMonth = this.getStartDayOfMonth()
    return (getStartDayOfMonth + this.day) % 7;
  }

  public addDays(value: number): DateTime {
    if (value < 0) {
      value *= -1;
      if (value > 365) { this.year -= Math.floor(value / 365); value = Math.floor(value % 365); }
      while (value > this.days[this.month - 1]) {
        value -= this.days[this.month - 1];
        this.addMonth(-1);
      }
      this.day -= value;
      if (this.day < 1) { this.addMonth(-1); this.day = this.days[this.month - 1] + this.day; }
    }
    else {
      if (value > 365) { this.year += Math.floor(value / 365); value = Math.floor(value % 365); }
      while (value > this.days[this.month - 1]) {
        value -= this.days[this.month - 1];
        this.addMonth(1);
        if (this.month > 12) { this.year++; this.month = 1; }
      }
      this.day += value;
      if (this.day > this.days[this.month - 1]) { this.day -= this.days[this.month - 1]; this.addMonth(1); }
    }
    return this;
  }

  public clone(): ADate { return new ADate(this.year, this.month, this.day, this.hour, this.minute, this.second); }

  public toDateString(): string { return `${this.year}/${this.month}/${this.day}`; }

  public toDateTimeString(): string { return `${this.year}/${this.month}/${this.day} ${this.hour}:${this.minute}:${this.second}`; }

  public static get now(): ADate { return DateTime.toADate(new Date()); }
}