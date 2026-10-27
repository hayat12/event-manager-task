import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const SearchStore = signalStore(
  { providedIn: 'root' },
  withState({ search: '' }),
  withMethods((store) => ({
    setSearch(search: string): void {
      patchState(store, { search });
    },
  })),
  withDevtools('search'),
);
