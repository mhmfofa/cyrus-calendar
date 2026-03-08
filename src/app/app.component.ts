import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePickerType } from '../../libs/cyrus-calendar/src/public-api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly datePickerType = DatePickerType;

  readonly selectedCalendarType = signal<DatePickerType>(DatePickerType.Imperial);
  readonly activeTab = signal<'demo' | 'docs'>('demo');

  readonly bookingForm = this.formBuilder.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    dateInput: ['', Validators.required],
  });

  submittedPayload: { customerName: string; dateInput: string } | null = null;

  onDateSelected(value: string): void {
    this.bookingForm.controls.dateInput.setValue(value ?? '');
    this.bookingForm.controls.dateInput.markAsTouched();
    this.bookingForm.controls.dateInput.updateValueAndValidity({ emitEvent: false });
  }

  setCalendarType(type: DatePickerType): void {
    this.selectedCalendarType.set(type);
  }

}
