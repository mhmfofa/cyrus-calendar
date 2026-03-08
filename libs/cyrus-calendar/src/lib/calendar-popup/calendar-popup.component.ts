import { ChangeDetectionStrategy, Component, OnInit, ElementRef, forwardRef, input, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CyrusCalendarConfigService } from '../cyrus-calendar-config.service';
import { CyrusCalendarDirective } from '../cyrus-calendar.directive';
import { DateTime } from '../date-time';
import { DatePickerOptions, DatePickerType } from '../models';

@Component({
  selector: 'calendar-popup',
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarPopupComponent),
      multi: true
    }
  ]
})
export class CalendarPopupComponent implements OnInit, ControlValueAccessor {
  readonly inputElement   = input<HTMLInputElement | null>(null, { alias: 'input' });
  readonly directive      = input<CyrusCalendarDirective | null>(null);
  readonly calendarType   = input<DatePickerType>(DatePickerType.Shamsi, { alias: 'calendar-type' });
  readonly format         = input<string>('yyyy/MM/dd');
  readonly min            = input<string | null>(null);
  readonly max            = input<string | null>(null);
  readonly disables       = input<any[]>([]);
  readonly multiple       = input<boolean>(false);
  readonly range          = input<boolean>(false);
  readonly disableWeekends  = input<boolean>(false, { alias: 'disable-weekends' });
  readonly fromTomorow    = input<boolean>(false, { alias: 'from-tomorow' });
  readonly disablePastDays  = input<boolean>(false, { alias: 'disable-past-days' });
  readonly date           = input<boolean>(true);
  readonly time           = input<boolean>(false);
  readonly timeFormat     = input<string>('hh:mm:ss', { alias: 'time-format' });
  readonly valueFormat    = input<string>('yyyy-MM-dd', { alias: 'value-format' });
  readonly optionsInput   = input<DatePickerOptions | null>(null, { alias: 'options' });

  /** Machine format — used for emitting / parsing (T separator for time) */
  readonly fullValueFormat = computed(() =>
    this.time() ? `${this.valueFormat()}T${this.timeFormat()}` : this.valueFormat()
  );
  /**
   * Effective date display format: if the user did not override `format` from
   * its default ('yyyy/MM/dd'), use hyphens for Gregorian calendar automatically.
   */
  private readonly effectiveDateDisplayFormat = computed(() => {
    const fmt = this.format();
    if (fmt === 'yyyy/MM/dd' && this.effectiveCalendarType() === DatePickerType.Gregorian) {
      return 'yyyy-MM-dd';
    }
    return fmt;
  });

  /** Display format — shown inside the <input> (slash/hyphen separator, ' - ' for time) */
  readonly fullDisplayFormat = computed(() =>
    this.time()
      ? `${this.effectiveDateDisplayFormat()} - ${this.timeFormat()}`
      : this.effectiveDateDisplayFormat()
  );

  readonly effectiveCalendarType   = computed(() => this.directive()?.calendarType()   ?? this.calendarType());
  readonly effectiveDisablePastDays = computed(() => this.directive()?.disablePastDays() ?? this.disablePastDays());
  readonly effectiveDisableWeekends = computed(() => this.directive()?.disableWeekends() ?? this.disableWeekends());

  isdisabled: boolean = false;
  onchange: (value: any) => any = value => { };
  ontouched: () => any = () => { };

  show = signal(false);
  yearDialog = signal(false);
  monthDialog = signal(false);
  yearRangeStart = signal(0);
  allowMultiple = false;
  allowRange = false;
  minLimit: string | null = null;
  maxLimit: string | null = null;
  activeOptions = new DatePickerOptions();
  private lastCalendarType: DatePickerType | null = null;

  item: DateTime;
  items: DateTime[];

  get monthesName(): string[] { return this.activeOptions.getMonthesName(); }
  get weekDaysName(): string[] { return this.activeOptions.getWeekDaysName(); }
  get monthDaysCount(): number[] { return this.activeOptions.getMonthDaysCount(); }

  constructor(
    private readonly element: ElementRef,
    private readonly config: CyrusCalendarConfigService,
  ) {
    effect(() => {
      this.handleCalendarTypeChange(this.effectiveCalendarType());
    });
  }

  private handleCalendarTypeChange(nextType: DatePickerType): void {
    if (!nextType) return;

    const previousType = this.lastCalendarType;
    this.lastCalendarType = nextType;

    if (!previousType || previousType === nextType) return;
    if (!this.item || this.item.getYear() < 1) return;

    try {
      const savedH = this.item.getHour()   >= 0 ? this.item.getHour()   : 0;
      const savedM = this.item.getMinute() >= 0 ? this.item.getMinute() : 0;
      const savedS = this.item.getSecond() >= 0 ? this.item.getSecond() : 0;

      // Convert this.item from the previous calendar to a Gregorian JS Date,
      // then re-express it in the new calendar type for display.
      const gDate = this.itemToGregorianDate(this.item, previousType);
      this.item = this.gregorianDateToItem(gDate, nextType);
      this.item.setHour(savedH).setMinute(savedM).setSecond(savedS);

      // Emit the Gregorian value (underlying date is unchanged).
      const gregorianValue = this.itemToGregorianValue(this.item);
      this.onchange(gregorianValue);

      const inputElement = this.inputElement();
      if (inputElement) {
        const display = this.item.format(this.fullDisplayFormat());
        queueMicrotask(() => { inputElement.value = display; });
      }
    } catch {
      // conversion failed — leave value as-is
    }
  }

  /**
   * Converts a DateTime (in the given calendar type) to a noon Gregorian JS Date.
   * Using noon avoids UTC day-shift for timezones east of UTC (e.g. Iran UTC+3:30).
   */
  private itemToGregorianDate(item: DateTime, calType: DatePickerType): Date {
    const fmt = this.valueFormat();
    if (calType === DatePickerType.Gregorian) {
      return new Date(item.getYear(), item.getMonth() - 1, item.getDay(), 12, 0, 0);
    } else if (calType === DatePickerType.Shamsi) {
      const raw = DateTime.parseJDate(item.format(fmt), fmt).toDate();
      return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate(), 12, 0, 0);
    } else {
      const raw = DateTime.convertADateToJDate(item.format(fmt), fmt).toDate();
      return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate(), 12, 0, 0);
    }
  }

  /** Converts a Gregorian JS Date to a DateTime in the specified calendar type. */
  private gregorianDateToItem(gDate: Date, calType: DatePickerType): DateTime {
    if (calType === DatePickerType.Gregorian) return DateTime.toDateTime(gDate);
    if (calType === DatePickerType.Shamsi)   return DateTime.toJDate(gDate);
    return DateTime.toADate(gDate);
  }

  /**
   * Converts this.item (calendar-specific) to a Gregorian value string.
   * This is what gets emitted to ngModel / formControl — always Gregorian.
   */
  private itemToGregorianValue(item: DateTime): string {
    const gDate = this.itemToGregorianDate(item, this.effectiveCalendarType());
    const dateValue = DateTime.format(gDate, this.valueFormat());
    if (this.time()) {
      const pad = (n: number) => n < 10 ? '0' + n : '' + n;
      return `${dateValue}T${pad(item.getHour())}:${pad(item.getMinute())}:${pad(item.getSecond())}`;
    }
    return dateValue;
  }

  /**
   * Parses an incoming Gregorian value string and returns a DateTime
   * expressed in the current effective calendar type (for display).
   */
  private gregorianValueToItem(gregorianValue: string): DateTime {
    const normalized = (gregorianValue || '').replace(' - ', 'T');
    const calType    = this.effectiveCalendarType();
    const today      = this.activeOptions.globalization.today();

    const hasExplicitTime = this.time() && normalized.includes('T');
    const datePart   = normalized.includes('T') ? normalized.split('T')[0] : normalized;
    const timePart   = hasExplicitTime ? normalized.split('T')[1] : null;

    // Parse the Gregorian date part
    let item: DateTime;
    const gDateRaw  = datePart ? DateTime.parseDate(datePart, this.valueFormat()) : null;
    const validYear = gDateRaw ? gDateRaw.getFullYear() : 0;
    if (gDateRaw && validYear > 100) {
      const gDate = new Date(gDateRaw.getFullYear(), gDateRaw.getMonth(), gDateRaw.getDate(), 12, 0, 0);
      item = this.gregorianDateToItem(gDate, calType);
    } else {
      // Empty / invalid — default to today in the current calendar
      item = today.clone();
    }

    // Apply time
    if (timePart) {
      const timeItem = DateTime.parse(timePart, this.timeFormat());
      if (timeItem.getHour()   >= 0) item.setHour(timeItem.getHour());
      if (timeItem.getMinute() >= 0) item.setMinute(timeItem.getMinute());
      if (timeItem.getSecond() >= 0) item.setSecond(timeItem.getSecond());
    } else if (this.time()) {
      item.setHour(today.getHour()).setMinute(today.getMinute()).setSecond(today.getSecond());
    }
    return item;
  }

  private syncFromInputs(options: DatePickerOptions): void {
    options.type = this.effectiveCalendarType() || this.config.defaultCalendarType();

    this.allowMultiple = this.multiple();
    this.allowRange = this.range();

    this.minLimit = this.min();
    this.maxLimit = this.max();

    const vFmt = this.valueFormat();
    if (this.effectiveDisablePastDays()) this.minLimit = options.globalization.today().format(vFmt);
    if (this.fromTomorow()) this.minLimit = options.globalization.tomorow().format(vFmt);
  }

  ngOnInit(): void {
    const options = this.optionsInput() ?? new DatePickerOptions();
    this.activeOptions = options;
    this.syncFromInputs(options);

    const inputElement = this.inputElement();
    if (!inputElement) {
      this.show.set(true);
      return;
    }

    this.show.set(false);
    inputElement.addEventListener('click', () => this.open());
    inputElement.addEventListener('focus', () => this.open());
    inputElement.addEventListener('blur', () => {
      if (this.element.nativeElement.querySelector('*:hover') == null) this.close();
    });
    inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if ([13, 27].indexOf(e.keyCode) > -1) {
        if (e.keyCode == 13) {
          this.setValue();
          this.close();
        } else {
          this.close();
        }
      } else {
        this.open();
      }
      // Do not re-parse inputElement.value here — it holds the display format,
      // not a Gregorian value. this.item is already authoritative.
    });
  }

  writeValue(value: string | string[]): void {
    // Incoming value is ALWAYS Gregorian (yyyy-MM-dd or yyyy-MM-ddThh:mm:ss).
    // Convert it to the current calendar type so this.item is ready for display.
    if (this.allowMultiple || this.allowRange) this.items = [];
    if (Array.isArray(value)) {
      this.allowMultiple = true;
      this.items = value.map(v => this.gregorianValueToItem(v));
    } else {
      this.item = this.gregorianValueToItem(value as string);
    }
  }

  registerOnChange(fn: any): void { this.onchange = fn; }
  registerOnTouched(fn: any): void { this.ontouched = fn; }
  setDisabledState?(isdisabled: boolean): void { this.isdisabled = isdisabled; }

  open() {
    this.syncFromInputs(this.activeOptions);
    if (this.show()) return; // already open — keep current item state
    // this.item is kept in sync by writeValue() which always receives Gregorian values.
    // Do NOT re-read from inputElement.value — it holds the calendar-specific display
    // string, not a Gregorian value, so writeValue() would misparse it.
    if (!this.item || this.item.getYear() < 1) {
      this.item = this.activeOptions.globalization.today().clone();
    }
    this.show.set(true);
  }
  close() { this.show.set(false); }

  getDays(): number[] {
    const options = this.activeOptions;
    this.syncFromInputs(options);
    const start = options.globalization.getStartDayOfWeek(this.item.getYear(), this.item.getMonth());

    const days: number[] = [];
    for (let i = 0; i < start; i++) days.push(null);
    const month = this.item.getMonth();
    const isLeapYear = this.item.isLeapYear(this.effectiveCalendarType());
    const count = this.monthDaysCount[month] + (isLeapYear && ((options.type !== DatePickerType.Gregorian && month == 12) || (options.type == DatePickerType.Gregorian && month == 2)) ? 1 : 0);
    for (let i = 1; i <= count; i++) days.push(i);
    return days;
  }

  setValue() {
    // Emit Gregorian value regardless of the displayed calendar type.
    let machineValue: string | string[];
    if (this.items && (this.allowMultiple || this.allowRange)) {
      machineValue = this.items.map(i => this.itemToGregorianValue(i));
    } else {
      machineValue = this.itemToGregorianValue(this.item);
    }
    this.onchange(machineValue);

    // Always update the DOM input with the human display format (slashes, ' - ' for time)
    const inputEl = this.inputElement();
    if (inputEl) {
      const displayValue = (this.items && (this.allowMultiple || this.allowRange))
        ? this.items.map(i => i.format(this.fullDisplayFormat())).join(', ')
        : this.item.format(this.fullDisplayFormat());
      queueMicrotask(() => { inputEl.value = displayValue; });
    }

    this.focus();
    this.yearDialog.set(false);
    this.monthDialog.set(false);
  }

  setDay(day: number) {
    const date = this.item.setDay(day).clone();
    let flag = false;
    if (this.allowRange) {
      if (this.items.length >= 2) {
        this.items = [];
        this.items.push(date);
      }
      else if (this.items.length == 1) {
        if (this.items[0].smallerDate(date)) this.items.push(date);
        else if (this.items[0].greaterDate(date)) this.items.unshift(date);
      }
      else this.items.push(date);
    }
    else if (this.allowMultiple) {
      let multipleFlag = true;
      for (let i = 0, length = this.items.length; i < length; i++) if (this.items[i].equalsDate(date)) { this.items.splice(i, 1); multipleFlag = false; break; }
      if (multipleFlag) this.items.push(date);
    } else flag = true;
    this.setValue();
    if (flag && !this.time()) this.close();
  }

  setMonth(month: number) {
    if (month < 1) { this.item.addYear(-1); month = 12; }
    else if (month > 12) { this.item.addYear(1); month = 1; }
    this.item.setMonth(month);
    this.setValue();
    this.monthDialog.set(false);
  }

  setYear(year: number) { this.item.setYear(year); this.setValue(); }
  setHour(value: number | string)   { this.item.setHour(+value); }
  setMinute(value: number | string) { this.item.setMinute(+value); }
  setSecond(value: number | string) { this.item.setSecond(+value); }

  addHours(value: number) { this.item.addHours(value); this.setValue(); }
  addMinutes(value: number) { this.item.addMinutes(value); this.setValue(); }
  addSeconds(value: number) { this.item.addSeconds(value); this.setValue(); }

  prevYear() { if (this.item.getYear() > 0) this.setYear(this.item.getYear() - 1); }
  prevMonth() { this.setMonth(this.item.getMonth() - 1); }
  today() {
    const preValue = this.item;
    this.item = this.activeOptions.globalization.today();
    if (this.isDisabled(this.item.getDay())) this.item = preValue; else this.setValue();
  }
  nextYear() { this.setYear(this.item.getYear() + 1); }
  nextMonth() { this.setMonth(this.item.getMonth() + 1); }

  focus() {
    const inputElement = this.inputElement();
    if (!inputElement) return;
    // Don't steal focus away from inputs inside the popup (e.g. time inputs)
    if (this.element.nativeElement.contains(document.activeElement)) return;
    inputElement.focus();
  }

  isActive(day: number) {
    const date = this.item.clone().setDay(day);
    if (this.allowRange) {
      if (this.items.length > 0 && this.items[0].equalsDate(date)) return true;
      if (this.items.length > 1 && this.items[1].equalsDate(date)) return true;
      else if (this.items.length == 2) {
        return (this.items[0].smallerDate(date) && this.items[1].greaterDate(date));
      }
      return false;
    }
    if (this.allowMultiple) {
      for (let i = 0, length = this.items.length; i < length; i++) if (this.items[i].equalsDate(date)) return true;
      return false;
    }
    return !this.isDisabled(day) && this.item.getDay() == day;
  }

  isDisabled(day: number, index?: number) {
    let flag = false;
    const date = this.item.clone().setDay(day);
    if (index == null) index = this.activeOptions.globalization.getDayOfWeek(date);
    flag = this.disableWeekends() && this.isWeekend(index);

    const min = this.minLimit;
    const max = this.maxLimit;
    if (min || max) {
      if (min && min > date.format(this.valueFormat())) flag = true;
      if (max && max < date.format(this.valueFormat())) flag = true;
    }

    const disables = this.disables();
    if (disables) {
      for (let i = 0, length = disables.length; i < length; i++) {
        if (typeof disables[i] == 'number') {
          if (index % 7 == disables[i]) { flag = true; break; }
        }
        else if (typeof disables[i] == 'string') {
          date.setDay(day);
          if (date.format(this.valueFormat()) == disables[i]) { flag = true; break; }
        }
      }
    }
    return flag;
  }

  isWeekend(index) {
    // Persian: Saturday is the last day of week (index 6)
    // Gregorian Monday-first: Sat=5, Sun=6
    return this.effectiveCalendarType() !== DatePickerType.Gregorian
      ? (index - 6) % 7 == 0
      : index % 7 == 5 || index % 7 == 6;
  }

  isToday(day: number, month: number, year: number){
    const today = this.activeOptions.globalization.today();
    return day == today.getDay() && month == today.getMonth() && year == today.getYear();
  }

  toggleMonth() {
    this.yearDialog.set(false);
    this.monthDialog.update(value => !value);
  }

  toggleYear() {
    this.monthDialog.set(false);
    const nextValue = !this.yearDialog();
    this.yearDialog.set(nextValue);
    if (nextValue) {
      this.yearRangeStart.set(Math.floor(this.item.getYear() / 12) * 12);
    }
  }

  getYearRange(): number[] {
    const years: number[] = [];
    for (let i = 0; i < 12; i++) years.push(this.yearRangeStart() + i);
    return years;
  }

  prevYearRange() { this.yearRangeStart.update(value => value - 12); }
  nextYearRange() { this.yearRangeStart.update(value => value + 12); }

  selectYear(year: number) {
    this.setYear(year);
    this.yearDialog.set(false);
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByValue(_index: number, value: number): number {
    return value;
  }

  clone<T>(instance: T): T {
    const copy = new (instance.constructor as { new(): T })();
    Object.assign(copy, instance);
    return copy;
  }
}