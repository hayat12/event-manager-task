import { Pipe, PipeTransform } from '@angular/core';
import { formatGermanDate } from '../utils/date';

/** `{{ event.date | germanDate }}` → 05.11.2026 */
@Pipe({ name: 'germanDate' })
export class GermanDatePipe implements PipeTransform {
  transform(isoDate: string | null | undefined): string {
    return isoDate ? formatGermanDate(isoDate) : '';
  }
}
