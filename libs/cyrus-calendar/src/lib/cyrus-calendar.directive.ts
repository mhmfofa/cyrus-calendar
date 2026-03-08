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
      const isRtl = this.calendarType() !== DatePickerType.Gregorian;
      const defaultText = isRtl ? '\u0627\u0646\u062a\u062e\u0627\u0628 \u062a\u0627\u0631\u06cc\u062e' : 'Select a date';
      this.renderer.setAttribute(this.el.nativeElement, 'placeholder', defaultText);
    });
  }
}
