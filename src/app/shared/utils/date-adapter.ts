import { Injectable, Provider } from '@angular/core';
import { DateAdapter, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { formatGermanDate, toIsoDate } from './date';

@Injectable()
export class GermanDateAdapter extends NativeDateAdapter {
  // The input fields use DD.MM.YYYY.
  override format(date: Date, displayFormat: object): string {
    return displayFormat === MAT_NATIVE_DATE_FORMATS.display.dateInput
      ? formatGermanDate(toIsoDate(date)!)
      : super.format(date, displayFormat);
  }

  override parse(value: unknown, parseFormat?: unknown): Date | null {
    const match = typeof value === 'string' ? /^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s*$/.exec(value) : null;
    if (!match) {
      return super.parse(value, parseFormat);
    }
    const [, day, month, year] = match.map(Number) as [number, number, number, number];
    const date = new Date(year, month - 1, day);
    // Rejects dates like 31.02.2027 that roll over into the next month.
    return date.getMonth() === month - 1 ? date : this.invalid();
  }
}

export function provideGermanDateAdapter(): Provider[] {
  return [provideNativeDateAdapter(), { provide: DateAdapter, useClass: GermanDateAdapter }];
}
