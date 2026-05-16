import { Directive, effect, ElementRef, input, Renderer2 } from '@angular/core';
import { DatePickerType } from './models';

@Directive({
  selector: 'input[cyrus-calendar]',
  standalone: true,
  exportAs: 'cyrusCalendar'
})
export class CyrusCalendarDirective {
  readonly calendarType   = input<DatePickerType>(DatePickerType.Imperial, { alias: 'calendar-type' });
  readonly disableWeekends  = input<boolean>(false, { alias: 'disable-weekends' });
  readonly disablePastDays  = input<boolean>(false, { alias: 'disable-past-days' });
  readonly placeholder = input<string | null>(null);

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2,
  ) {
    effect(() => {
      const custom = this.placeholder();
      if (custom !== null) {
        this.renderer.setAttribute(this.el.nativeElement, 'placeholder', custom);
        return;
      }
      const type = this.calendarType();
      let defaultText: string;
      if (type === DatePickerType.Gregorian) {
        defaultText = 'Select a date';
      } else if (type === DatePickerType.Hijri) {
        defaultText = '\u0627\u062e\u062a\u0631 \u062a\u0627\u0631\u064a\u062e\u0627\u064b'; // اختر تاريخاً
      } else {
        defaultText = '\u0627\u0646\u062a\u062e\u0627\u0628 \u062a\u0627\u0631\u06cc\u062e'; // انتخاب تاریخ
      }
      this.renderer.setAttribute(this.el.nativeElement, 'placeholder', defaultText);
    });
  }
}
