import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GermanDatePipe } from '@shared/pipes/german-date.pipe';
import { EventChanges, EventSummary } from '../../models/event.model';
import { EventLocationSelect } from '../event-location-select/event-location-select';
import { EventStatusSelect } from '../event-status-select/event-status-select';

/** One event as a table row; Ort and Status are edited in place. */
@Component({
  selector: 'tr[app-event-list-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GermanDatePipe, EventLocationSelect, EventStatusSelect, MatButtonModule, MatIconModule],
  templateUrl: './event-list-item.html',
  styleUrl: './event-list-item.scss',
  host: { '(click)': 'onRowClick($event)', '[class.expanded]': 'expanded()' },
})
export class EventListItem {
  readonly event = input.required<EventSummary>();
  readonly expanded = input(false);
  readonly locations = input<string[]>([]);

  readonly view = output<void>();
  readonly edit = output<EventChanges>();
  readonly remove = output<void>();

  protected onRowClick(event: MouseEvent): void {
    if (!(event.target as Element).closest('button, mat-select')) {
      this.view.emit();
    }
  }
}
