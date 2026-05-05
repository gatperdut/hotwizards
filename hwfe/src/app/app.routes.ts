import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard.js';
import { UnuthenticatedGuard } from './auth/guards/unauthenticated.guard.js';
import { AuthenticatedComponent } from './authenticated/authenticated.component.js';
import { CampaignService } from './campaigns/campaign/campaign.service.js';
import { boardGuard } from './campaigns/campaign/guards/board.guard.js';
import { campaignGuard } from './campaigns/campaign/guards/campaign.guard.js';
import { townGuard } from './campaigns/campaign/guards/town.guard.js';
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
            path: 'home',
            loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'campaigns' },
              {
                path: 'campaigns',
                loadComponent: () =>
                  import('./campaigns/campaigns-list/campaigns-list.component').then(
                    (m) => m.CampaignsListComponent,
                  ),
              },
              {
                path: 'campaigns/:campaignId',
                loadComponent: () =>
                  import('./campaigns/campaign/campaign.component').then(
                    (m) => m.CampaignComponent,
                  ),
                providers: [CampaignService],
                canActivate: [campaignGuard],
                children: [
                  {
                    path: 'town',
                    loadComponent: () =>
                      import('./campaigns/campaign/town/town.component').then(
                        (m) => m.TownComponent,
                      ),
                    canActivate: [townGuard],
                  },
                  {
                    path: 'board',
                    loadComponent: () =>
                      import('./campaigns/campaign/board/board.component').then(
                        (m) => m.BoardComponent,
                      ),
                    canActivate: [boardGuard],
                  },
                ],
              },
              {
                path: 'editor',
                loadComponent: () =>
                  import('./editor/editor.component').then((m) => m.EditorComponent),
                // canActivate: [AdminGuard],
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
