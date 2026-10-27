import { Routes } from '@angular/router';
import { Layout } from '@shared/components/layout/layout';

// The language is part of each build's base path (/de/, /en/), not of these routes.
export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'events' },
      {
        path: 'events',
        loadChildren: () => import('@features/events/events.routes').then((m) => m.eventsRoutes),
      },
    ],
  },
  { path: '**', redirectTo: 'events' },
];
