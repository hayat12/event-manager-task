import { AbstractControl, ValidationErrors } from '@angular/forms';

/** date as string, e.g. 2026-11-05. */
export function toIsoDate(date: Date | null): string | null {
  if (!date) {
    return null;
  }
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** date as 2026-11-05 - 05.11.2026. */
export function formatGermanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}

export function fromIsoDate(isoDate: string | null): Date | null {
  return isoDate ? new Date(`${isoDate}T00:00`) : null;
}

/** tmr as 2026-11-05 */
export function tomorrow(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  return date;
}

/** Validator future date`. */
export function futureDate(control: AbstractControl<string | null>): ValidationErrors | null {
  const value = control.value;
  return value && value < toIsoDate(tomorrow())! ? { futureDate: true } : null;
}
