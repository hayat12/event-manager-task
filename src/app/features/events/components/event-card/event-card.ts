import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GermanDatePipe } from '@shared/pipes/german-date.pipe';
import { EventChanges, EventSummary } from '../../models/event.model';
import { EventLocationSelect } from '../event-location-select/event-location-select';
import { EventStatusSelect } from '../event-status-select/event-status-select';

@Component({
  selector: 'app-event-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GermanDatePipe, EventLocationSelect, EventStatusSelect, MatButtonModule, MatIconModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
  host: { '[class.expanded]': 'expanded()' },
})
export class EventCard {
  readonly event = input.required<EventSummary>();
  readonly expanded = input(false);
  /** Choices for the Ort dropdown. */
  readonly locations = input<string[]>([]);

  readonly view = output<void>();
  readonly edit = output<EventChanges>();
  readonly remove = output<void>();

}
