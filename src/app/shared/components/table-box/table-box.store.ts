import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TableView } from './table-box.models';

type TableBoxState = {
  view: TableView;
  /** Key of the row whose details are open; one at a time. */
  expandedKey: string | null;
};

/** One per TableBox (provided by the component): the table's own UI state. */
export const TableBoxStore = signalStore(
  withState<TableBoxState>({ view: 'list', expandedKey: null }),
  withMethods((store) => ({
    setView(view: TableView): void {
      patchState(store, { view });
    },
    toggleExpanded(key: string): void {
      patchState(store, { expandedKey: store.expandedKey() === key ? null : key });
    },
  })),
);
