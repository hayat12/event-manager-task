import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@core/models/sort';
import { ConfirmDialog, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog';
import { TableBox } from '@shared/components/table-box/table-box';
import { TableGroup } from '@shared/components/table-box/table-box.models';
import { TableCard, TableDetail, TableRow } from '@shared/components/table-box/table-templates';
import { formatGermanDate } from '@shared/utils/date';
import { EventCard } from '../components/event-card/event-card';
import { EventFilterBar } from '../components/event-filter-bar/event-filter-bar';
import { EventDetails } from '../components/event-details/event-details';
import { EventListItem } from '../components/event-list-item/event-list-item';
import { EVENT_COLUMNS, EVENT_STATISTICS, STATUS_LABELS } from '../constants/constants';
import { EventSortField, EventStatus, EventSummary, Statistic } from '../models/event.model';
import { EventsStore } from '../state/events.store';
import { EventStatisticsCard } from '../components/event-statistics-card/event-statistics-card';

@Component({
  selector: 'app-events-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EventCard,
    EventDetails,
    EventFilterBar,
    EventListItem,
    TableBox,
    TableCard,
    TableDetail,
    TableRow,
    EventStatisticsCard,
  ],
  templateUrl: './events-page.html',
  styleUrl: './events-page.scss',
})
export class EventsPage {
  protected readonly store = inject(EventsStore);
  /** Ort options, loaded by the route's resolver before the page opens. */
  readonly locations = input<string[]>([]);
  private readonly dialog = inject(MatDialog);

  protected readonly columns = EVENT_COLUMNS;
  protected readonly statistics = EVENT_STATISTICS;

  /** Number shown on each statistics tile, for the current search and filters. */
  protected readonly counts = computed(() => ({
    total: this.store.totalCount(),
    ...this.store.statusCounts(),
  }));

  protected readonly groups = computed<TableGroup[]>(() =>
    this.store.groups().map(({ key, eventCount, participantCount }) => ({
      key,
      label: this.store.groupBy() === 'status' ? STATUS_LABELS[key as EventStatus] : key,
      summary: $localize`:@@events.list.group.summary:${eventCount}:eventCount: Events, ${participantCount}:participantCount: Teilnehmer`,
    })),
  );

  protected readonly eventId = (event: EventSummary) => event.id;

  protected readonly groupKey = computed(() => {
    const groupBy = this.store.groupBy();
    return groupBy ? (event: EventSummary) => event[groupBy] : null;
  });

  protected async openCreateDialog(): Promise<void> {
    const { EventCreateDialog } =
      await import('../components/event-create-dialog/event-create-dialog');
    this.dialog
      .open(EventCreateDialog, { data: { locations: this.locations() } })
      .afterClosed()
      .subscribe((event) => event && this.store.createEvent(event));
  }

  protected confirmDelete({ id, date, location }: EventSummary): void {
    const displayDate = formatGermanDate(date);
    const data: ConfirmDialogData = {
      title: $localize`:@@events.list.delete.title:Veranstaltung löschen`,
      message: $localize`:@@events.list.delete.message:Die Veranstaltung am ${displayDate}:date: in ${location}:location: wird mit allen Teilnehmern gelöscht.`,
      confirmLabel: $localize`:@@events.list.delete.confirm:Löschen`,
    };
    this.dialog
      .open(ConfirmDialog, { data })
      .afterClosed()
      .subscribe((confirmed) => confirmed && this.store.deleteEvent(id));
  }

  protected onSort(sort: Sort<string>): void {
    this.store.setSort(sort as Sort<EventSortField>);
  }

  protected isActiveStatistic(statistic: Statistic): boolean {
    return statistic.key === this.store.filters().status;
  }
}
