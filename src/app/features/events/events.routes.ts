import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { EventsPage } from './events-page/events-page';
import { EventService } from './services/event.service';
import { EventsStore } from './state/events.store';

/** Loads the Ort filter options before the page opens; the page receives them as its `locations` input. */
const locationsResolver: ResolveFn<string[]> = () => inject(EventService).getLocations();

export const eventsRoutes: Routes = [
  {
    path: '',
    component: EventsPage,
    title: $localize`:@@events.list.pageTitle:Events`,
    providers: [EventsStore],
    resolve: { locations: locationsResolver },
  },
];
