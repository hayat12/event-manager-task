import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangePicker } from '@shared/components/date-range-picker/date-range-picker';
import { Dropdown, DropdownOption, toOptions } from '@shared/components/dropdown/dropdown';
import { STATUS_LABELS } from '../../constants/constants';
import { EventFilters, EventGroupField } from '../../models/event.model';

@Component({
  selector: 'app-event-filter-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DateRangePicker, Dropdown],
  templateUrl: './event-filter-bar.html',
  styleUrl: './event-filter-bar.scss',
})
export class EventFilterBar {
  readonly filters = input.required<EventFilters>();
  readonly groupBy = input.required<EventGroupField | null>();
  readonly locations = input<string[]>([]);

  readonly filtersChange = output<Partial<EventFilters>>();
  readonly groupByChange = output<EventGroupField | null>();

  protected readonly statusOptions = toOptions(STATUS_LABELS);
  protected readonly locationOptions = computed(() =>
    this.locations().map((location) => ({ value: location, label: location })),
  );
  protected readonly groupOptions: DropdownOption<EventGroupField>[] = [
    { value: 'status', label: $localize`:@@events.list.filters.groupByStatus:Status` },
    { value: 'location', label: $localize`:@@events.list.filters.groupByLocation:Ort` },
  ];
  protected readonly dateRange = computed(() => ({ start: this.filters().dateFrom, end: this.filters().dateTo }));
}
