import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarPopupComponent, CyrusCalendarDirective } from '../../../libs/cyrus-calendar/src/public-api';
import { DatePickerType } from '../../../libs/cyrus-calendar/src/public-api';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CalendarPopupComponent, CyrusCalendarDirective]
})
export class DocsComponent {
  readonly DatePickerType = DatePickerType;

  // Example values
  example1Value = signal('');
  example2Value = signal('');
  example3Value = signal('');
  example4Value = signal('');
  example5CalType = signal<DatePickerType>(DatePickerType.Imperial);
  example5Value = signal('');

  // Example 6 – Hijri calendar
  example6Value = signal('');
  example6CalType = signal<DatePickerType>(DatePickerType.Hijri);

  setEx5CalType(type: DatePickerType) { this.example5CalType.set(type); }
  setEx6CalType(type: DatePickerType) { this.example6CalType.set(type); }
}
