import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, effect, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort as MatSortChange } from '@angular/material/sort';
import { Sort } from '@core/models/sort';
import { CardSkeleton } from '../skeleton/card-skeleton/card-skeleton';
import { TableSkeleton } from '../skeleton/table-skeleton/table-skeleton';
import { TableHeader } from '../table-header/table-header';
import { TableColumn, TableGroup, TableView } from './table-box.models';
import { TableBoxStore } from './table-box.store';
import { TableCard, TableDetail, TableRow, TableRowContext } from './table-templates';

/**
 * Table panel with header, sortable columns, grouping rows and pagination.
 * Sort and page are controlled: shown from inputs, changes emitted for the owner to apply.
 */
@Component({
  selector: 'app-table-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, NgTemplateOutlet, TableHeader, TableSkeleton, CardSkeleton, MatButtonModule, MatIconModule, MatProgressBarModule, MatSortModule],
  providers: [TableBoxStore],
  templateUrl: './table-box.html',
  styleUrl: './table-box.scss',
})
export class TableBox<T> {
  protected readonly store = inject(TableBoxStore);

  readonly label = input.required<string>();
  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<T[]>();
  readonly total = input.required<number>();
  readonly pageIndex = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly sort = input<Sort<string> | null>(null);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly groups = input<TableGroup[]>([]);
  readonly groupKey = input<((row: T) => string) | null>(null);
  /** Stable id of a row, so open details survive reloads. */
  readonly rowKey = input.required<(row: T) => string>();
  /** Layout to show: a table or a grid of cards. Needs a `tableCard` template for cards. */
  readonly view = input<TableView>('list');

  readonly sortChange = output<Sort<string>>();
  readonly pageChange = output<number>();
  readonly retry = output<void>();
  readonly createLabel = input('');
  /** Shows the reset button, e.g. while filters are set. */
  readonly resettable = input(false);

  readonly viewChange = output<TableView>();
  readonly exportCsv = output<void>();
  readonly create = output<void>();
  readonly resetFilter = output<void>();

  protected readonly skeletonCards = Array.from({length: 12});

  protected readonly rowTemplate = contentChild.required(TableRow);
  protected readonly detailTemplate = contentChild(TableDetail);
  protected readonly cardTemplate = contentChild(TableCard);

  private readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));
  protected readonly rangeStart = computed(() => (this.total() ? this.pageIndex() * this.pageSize() + 1 : 0));
  protected readonly rangeEnd = computed(() => Math.min((this.pageIndex() + 1) * this.pageSize(), this.total()));
  protected readonly canPrev = computed(() => this.pageIndex() > 0);
  protected readonly canNext = computed(() => this.pageIndex() < this.totalPages() - 1);

  /** Rows to render: a group header wherever a new group starts, then the rows with their template context. */
  protected readonly items = computed(() => {
    const groupKey = this.groupKey();
    const groupsByKey = new Map(this.groups().map((group) => [group.key, group]));
    const items: ({ kind: 'group'; key: string; group: TableGroup } | { kind: 'row'; key: string; context: TableRowContext })[] = [];
    let currentGroup: string | undefined;
    for (const row of this.rows()) {
      const group = groupKey ? groupsByKey.get(groupKey(row)) : undefined;
      if (group && group.key !== currentGroup) {
        currentGroup = group.key;
        items.push({ kind: 'group', key: `group-${group.key}`, group });
      }
      const key = `row-${this.rowKey()(row)}`;
      items.push({
        kind: 'row',
        key,
        context: {
          $implicit: row,
          expanded: this.store.expandedKey() === key,
          toggle: () => this.store.toggleExpanded(key),
        },
      });
    }
    return items;
  });

  constructor() {
    // The owner decides the layout; the switch in the header reports changes back through viewChange.
    effect(() => this.store.setView(this.view()));
  }

  protected onSort({ active, direction }: MatSortChange): void {
    this.sortChange.emit({ active, direction: direction === 'desc' ? 'desc' : 'asc' });
  }

  protected onView(view: TableView): void {
    this.store.setView(view);
    this.viewChange.emit(view);
  }
}
