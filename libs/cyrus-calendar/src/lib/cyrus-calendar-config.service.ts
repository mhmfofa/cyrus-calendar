import { Injectable, signal } from '@angular/core';
import { DatePickerType } from './models';

@Injectable({ providedIn: 'root' })
export class CyrusCalendarConfigService {
  readonly defaultCalendarType = signal<DatePickerType>(DatePickerType.Imperial);
  readonly defaultFormat = signal<string>('yyyy/MM/dd');
}
