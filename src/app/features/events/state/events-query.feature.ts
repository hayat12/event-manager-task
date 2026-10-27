import { computed, inject, linkedSignal } from '@angular/core';
import { Sort } from '@core/models/sort';
import { patchState, signalStoreFeature, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { TableView } from '@shared/components/table-box/table-box.models';
import { SearchStore } from '@shared/state/search.store';
import { EventFilters, EventGroupField, EventsQuery, EventSortField } from '../models/event.model';

type EventsQueryState = {
  filters: EventFilters;
  sort: Sort<EventSortField>;
  groupBy: EventGroupField | null;
  pageSize: number;
  view: TableView; // table layout
};

const initialState: EventsQueryState = {
  filters: { status: null, location: null, dateFrom: null, dateTo: null },
  sort: { active: 'date', direction: 'asc' },
  groupBy: null,
  pageSize: 25,
  view: 'list',
};

/** What the list shows: search, filters, sort, grouping, page and layout, combined into `query`. */
export function withEventsQuery() {
  return signalStoreFeature(
    withState(initialState),
    // The global search text is stored once, in the root SearchStore.
    withProps(() => ({ _search: inject(SearchStore).search })),
    // Back to the first page whenever search, filters, sort or grouping change.
    withProps(({ _search, filters, sort, groupBy }) => ({
      _pageIndex: linkedSignal(() => {
        _search();
        filters();
        sort();
        groupBy();
        return 0;
      }),
    })),
    withComputed(({ _search, filters, sort, groupBy, _pageIndex, pageSize }) => ({
      pageIndex: _pageIndex.asReadonly(),
      hasFilters: computed(() => Object.values(filters()).some((value) => value !== null)),
      query: computed<EventsQuery>(
        () => ({
          search: _search(),
          filters: filters(),
          sort: sort(),
          groupBy: groupBy(),
          pageIndex: _pageIndex(),
          pageSize: pageSize(),
        }),
        // A new object with the same values is not a new query, so it does not reload.
        { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) },
      ),
    })),
    withMethods((store) => ({
      setFilters(filters: Partial<EventFilters>): void {
        patchState(store, (state) => ({ filters: { ...state.filters, ...filters } }));
      },
      resetFilters(): void {
        patchState(store, { filters: initialState.filters });
      },
      setSort(sort: Sort<EventSortField>): void {
        patchState(store, { sort });
      },
      setGroupBy(groupBy: EventGroupField | null): void {
        patchState(store, { groupBy });
      },
      setView(view: TableView): void {
        patchState(store, { view });
      },
      setPage(pageIndex: number): void {
        store._pageIndex.set(pageIndex);
      },
    })),
  );
}
