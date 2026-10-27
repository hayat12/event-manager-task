import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { BaseControl } from '../base-control';

export type DropdownOption<T> = { value: T; label: string };

/** { planned: 'Geplant', … } → [{ value: 'planned', label: 'Geplant' }, …] */
export function toOptions<T extends string>(labels: Record<T, string>): DropdownOption<T>[] {
  return (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));
}

/**
 * Select field: `<app-dropdown label="Ort" [options]="…" formControlName="location" />`.
 * `emptyLabel` adds a first option with the value null, e.g. "Alle".
 */
@Component({
  selector: 'app-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown<T> extends BaseControl<T> {
  readonly label = input('');
  readonly options = input.required<DropdownOption<T>[]>();
  readonly emptyLabel = input<string | null>(null);

  protected override readonly errorField = viewChild(MatSelect);
}
