import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-event-location-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelectModule],
  template: `
    <mat-select
      [panelWidth]="null"
      [value]="location()"
      (valueChange)="select($event)"
    >
      @for (option of locations(); track option) {
        <mat-option [value]="option">{{ option }}</mat-option>
      }
    </mat-select>
  `,
  styleUrl: './event-location-select.scss',
})
export class EventLocationSelect {
  readonly location = input.required<string>();
  readonly locations = input<string[]>([]);
  readonly locationChange = output<string>();

  protected select(location: string): void {
    if (location !== this.location()) {
      this.locationChange.emit(location);
    }
  }
}
