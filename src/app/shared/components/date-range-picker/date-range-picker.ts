import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { fromIsoDate, toIsoDate } from '../../utils/date';
import { provideGermanDateAdapter } from '../../utils/date-adapter';
import { BaseControl } from '../base-control';

/** Both ends are ISO dates; either can be empty. */
export type DateRange = { start: string | null; end: string | null };

/** Date range field with calendar and a button to clear it. */
@Component({
  selector: 'app-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatIconModule],
  providers: [provideGermanDateAdapter()],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss',
})
export class DateRangePicker extends BaseControl<DateRange> {
  readonly label = input('');
  readonly startPlaceholder = input('');
  readonly endPlaceholder = input('');

  protected readonly start = computed(() => fromIsoDate(this.value()?.start ?? null));
  protected readonly end = computed(() => fromIsoDate(this.value()?.end ?? null));
  protected readonly isEmpty = computed(() => !this.value()?.start && !this.value()?.end);

  protected setStart(date: Date | null): void {
    this.update({ start: toIsoDate(date), end: this.value()?.end ?? null });
  }

  protected setEnd(date: Date | null): void {
    this.update({ start: this.value()?.start ?? null, end: toIsoDate(date) });
  }

  protected clear(): void {
    this.update({ start: null, end: null });
  }
}
