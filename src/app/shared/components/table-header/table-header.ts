import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TableView } from '../table-box/table-box.models';

@Component({
  selector: 'app-table-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MatButtonModule, MatButtonToggleModule, MatIconModule],
  templateUrl: './table-header.html',
  styleUrl: './table-header.scss',
})
export class TableHeader {
  readonly count = input.required<number>();
  readonly label = input.required<string>();
  readonly view = input<TableView>('list');
  readonly viewToggle = input(true);
  readonly createLabel = input('');
  readonly resettable = input(false);
  readonly viewChange = output<TableView>();
  readonly exportCsv = output<void>();
  readonly create = output<void>();
  readonly resetFilter = output<void>();

  downloadLabel = $localize`:@@shared.table.form.download:Download`
}
