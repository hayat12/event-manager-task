import { withDevtools, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { signalStore, withHooks } from '@ngrx/signals';
import { withEventsQuery } from './events-query.feature';
import { withEventsState } from './events-state.feature';

/** Feature-scoped: provided on the events route, so its data goes away with the page. */
export const EventsStore = signalStore(
  withEventsQuery(),
  withEventsState(),
  // Remembers filter, sort, grouping and layout preferences in localStorage.
  withStorageSync({
    key: 'events-preferences',
    select: ({ filters, sort, groupBy, view }) => ({ filters, sort, groupBy, view }),
  }),
  withHooks({
    onInit(store) {
      // Bound to the query signal: every effective query change loads again.
      store.load(store.query);
    },
  }),
  withDevtools('events'),
);
