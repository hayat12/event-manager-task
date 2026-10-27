import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { fromIsoDate, toIsoDate } from '../../utils/date';
import { provideGermanDateAdapter } from '../../utils/date-adapter';
import { BaseControl } from '../base-control';

@Component({
  selector: 'app-datepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule],
  providers: [provideGermanDateAdapter()],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.scss',
})
export class Datepicker extends BaseControl<string> {
  readonly label = input('');
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  readonly clearable = input(false);
  protected override readonly errorField = viewChild(MatInput);
  protected readonly date = computed(() => fromIsoDate(this.value()));
  protected readonly minDate = computed(() => fromIsoDate(this.min()));
  protected readonly toIsoDate = toIsoDate;
}
