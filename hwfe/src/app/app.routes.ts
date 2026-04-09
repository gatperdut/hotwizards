import { Routes } from '@angular/router';
import { HealthGuard } from './health/health.guard.js';

export const routes: Routes = [
  {
    path: 'offline',
    loadComponent: () =>
      import('./health/offline/offline.component.js').then((m) => m.OfflineComponent),
  },
  {
    path: '',
    canActivate: [HealthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'board',
      },
      {
        path: 'board',
        loadComponent: () => import('./board/board.component.js').then((m) => m.BoardComponent),
      },
    ],
  },
];
