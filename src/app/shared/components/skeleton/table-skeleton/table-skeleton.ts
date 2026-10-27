import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'tbody[app-table-skeleton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-skeleton.html',
  styleUrl: './table-skeleton.scss',
})
export class TableSkeleton {
  readonly columns = input.required<number>();
  readonly rows = input(5);

  protected readonly rowList = computed(() => Array.from({ length: this.rows() }, (_, index) => index));
  protected readonly columnList = computed(() => Array.from({ length: this.columns() }, (_, index) => index));

  protected width(row: number, column: number): string {
    return `${50 + ((row * 7 + column * 13) % 4) * 12}%`;
  }
}
