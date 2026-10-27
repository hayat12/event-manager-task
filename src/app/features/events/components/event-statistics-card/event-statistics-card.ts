import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StatisticTone } from '@features/events/models/event.model';

@Component({
  selector: 'app-event-statistics-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MatIconModule],
  templateUrl: './event-statistics-card.html',
  styleUrl: './event-statistics-card.scss',
  host: { '[class.active]': 'active()' },
})
export class EventStatisticsCard {
  readonly active = input(false);
  readonly value = input.required<number>();
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly tone = input<StatisticTone>('total');
}
