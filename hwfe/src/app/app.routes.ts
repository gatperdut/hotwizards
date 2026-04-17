import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard.js';
import { UnuthenticatedGuard } from './auth/guards/unauthenticated.guard.js';
import { OfflineGuard } from './health/offline.guard.js';
import { OnlineGuard } from './health/online.guard.js';

export const routes: Routes = [
  {
    path: 'showcase',
    loadComponent: () =>
      import('./showcase/showcase.component.js').then((m) => m.ShowcaseComponent),
  },
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
        path: 'auth',
        canActivate: [UnuthenticatedGuard],
        loadComponent: () => import('./auth/auth.component.js').then((m) => m.AuthComponent),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'login' },
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
        path: '',
        canActivate: [AuthenticatedGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home/my-campaigns' },
          {
            path: 'board',
            loadComponent: () => import('./board/board.component.js').then((m) => m.BoardComponent),
          },
          {
            path: 'home',
            loadComponent: () => import('./home/home.component.js').then((m) => m.HomeComponent),
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'my-campaigns' },
              {
                path: 'my-campaigns',
                loadComponent: () =>
                  import('./campaigns/my-campaigns/my-campaigns.component.js').then(
                    (m) => m.MyCampaignsComponent,
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
