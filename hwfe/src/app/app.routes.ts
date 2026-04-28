import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard.js';
import { UnuthenticatedGuard } from './auth/guards/unauthenticated.guard.js';
import { AuthenticatedComponent } from './authenticated/authenticated.component.js';
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
        component: AuthenticatedComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'home/campaigns' },
          {
            path: 'board',
            loadComponent: () => import('./board/board.component.js').then((m) => m.BoardComponent),
          },
          {
            path: 'home',
            loadComponent: () => import('./home/home.component.js').then((m) => m.HomeComponent),
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'campaigns' },
              {
                path: 'campaigns',
                loadComponent: () =>
                  import('./campaigns/campaigns/campaigns.component.js').then(
                    (m) => m.CampaignsComponent,
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
