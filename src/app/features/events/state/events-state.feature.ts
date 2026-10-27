import { inject, Signal } from '@angular/core';
import { setError, setLoaded, setLoading, withCallState } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStoreFeature, type, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { downloadFile, toCsv } from '@shared/utils/csv';
import { formatGermanDate, toIsoDate } from '@shared/utils/date';
import { catchError, concatMap, EMPTY, exhaustMap, Observable, pipe, switchMap, tap } from 'rxjs';
import { EventChanges, EventGroup, EventsQuery, EventStatus, EventSummary, NewEvent } from '../models/event.model';
import { STATUS_LABELS } from '../constants/constants';
import { EventService } from '../services/event.service';

type EventsResultState = {
  events: EventSummary[];
  totalCount: number;
  groups: EventGroup[];
  statusCounts: Record<EventStatus, number>;
};

const initialState: EventsResultState = {
  events: [],
  totalCount: 0,
  groups: [],
  statusCounts: { planned: 0, cancelled: 0, done: 0 },
};

export function withEventsState() {
  return signalStoreFeature(
    { props: type<{ query: Signal<EventsQuery> }>() },
    withState(initialState),
    withCallState(),
    withMethods((store, api = inject(EventService)) => ({
      // switchMap drops the answer of an older query when a newer one starts.
      load: rxMethod<EventsQuery>(
        pipe(
          tap(() => patchState(store, setLoading())),
          switchMap((query) =>
            api.getEvents(query).pipe(
              tap(({ items, total, groups, statusCounts }) =>
                patchState(store, { events: items, totalCount: total, groups, statusCounts }, setLoaded()),
              ),
              catchError((error: unknown) => {
                console.error(error);
                patchState(store, setError($localize`:@@events.list.errors.load:Events konnten nicht geladen werden.`));
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
      /** Downloads all events matching the current search and filters; clicks during an export are ignored. */
      exportCsv: rxMethod<void>(
        pipe(
          exhaustMap(() =>
            api.exportEvents(store.query()).pipe(
              tap((events) => {
                const header = [
                  $localize`:@@events.list.columns.date:Datum`,
                  $localize`:@@events.list.columns.location:Ort`,
                  $localize`:@@events.list.columns.status:Status`,
                  $localize`:@@events.list.columns.participants:Teilnehmer`,
                ];
                const rows = events.map((event) => [
                  formatGermanDate(event.date),
                  event.location,
                  STATUS_LABELS[event.status],
                  event.participantCount,
                ]);
                downloadFile(`events-${toIsoDate(new Date())}.csv`, toCsv([header, ...rows]));
              }),
              catchError((error: unknown) => {
                console.error(error);
                patchState(store, setError($localize`:@@events.list.errors.export:Export fehlgeschlagen.`));
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
    })),
    withMethods((store, api = inject(EventService)) => {
      /**
       * Runs changes one after another (concatMap), then reloads the page: a change can affect
       * filter matches, group totals and sort order. Shows `errorMessage` if it fails.
       */
      const change = <T>(request: (value: T) => Observable<void>, errorMessage: string) =>
        rxMethod<T>(
          pipe(
            concatMap((value) =>
              request(value).pipe(
                tap(() => store.load(store.query())),
                catchError((error: unknown) => {
                  console.error(error);
                  patchState(store, setError(errorMessage));
                  return EMPTY;
                }),
              ),
            ),
          ),
        );
      return {
        createEvent: change<NewEvent>(
          (event) => api.createEvent(event),
          $localize`:@@events.list.errors.create:Veranstaltung konnte nicht erstellt werden.`,
        ),
        deleteEvent: change<string>(
          (id) => api.deleteEvent(id),
          $localize`:@@events.list.errors.delete:Veranstaltung konnte nicht gelöscht werden.`,
        ),
        updateEvent: change<{ id: string; changes: EventChanges }>(
          ({ id, changes }) => api.updateEvent(id, changes),
          $localize`:@@shared.errors.saveFailed:Änderung konnte nicht gespeichert werden.`,
        ),
      };
    }),
  );
}
