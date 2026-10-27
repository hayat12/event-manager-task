import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { STATUS_LABELS } from '../../constants/constants';
import { EventStatus } from '../../models/event.model';

@Component({
  selector: 'app-event-status-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelectModule],
  template: `
    <mat-select
      [panelWidth]="null"
      [value]="status()"
      (valueChange)="select($event)"
    >
      <mat-select-trigger>
        <span class="status" [class]="'status--' + status()">{{ label() }}</span>
      </mat-select-trigger>
      @for (option of options; track option[0]) {
        <mat-option [value]="option[0]">{{ option[1] }}</mat-option>
      }
    </mat-select>
  `,
  styleUrl: './event-status-select.scss',
})
export class EventStatusSelect {
  readonly status = input.required<EventStatus>();
  readonly statusChange = output<EventStatus>();

  protected readonly options = Object.entries(STATUS_LABELS) as [EventStatus, string][];
  protected readonly label = computed(() => STATUS_LABELS[this.status()]);

  protected select(status: EventStatus): void {
    if (status !== this.status()) {
      this.statusChange.emit(status);
    }
  }
}
