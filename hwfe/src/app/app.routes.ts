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
        redirectTo: 'login',
      },
      {
        path: 'board',
        loadComponent: () => import('./board/board.component.js').then((m) => m.BoardComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component.js').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component.js').then((m) => m.RegisterComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
