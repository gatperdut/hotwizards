import { Routes } from '@angular/router';
import { OfflineGuard } from './health/offline.guard.js';
import { OnlineGuard } from './health/online.guard.js';

export const routes: Routes = [
  {
    path: 'offline',
    canActivate: [OfflineGuard],
    loadComponent: () =>
      import('./health/offline/offline.component.js').then((m) => m.OfflineComponent),
  },
  {
    path: '',
    canActivate: [OnlineGuard],
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
  {
    path: '**',
    redirectTo: '',
  },
];
