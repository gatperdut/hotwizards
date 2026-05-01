import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { HwCampaign } from '../../../shared/dist/shared/src/campaigns/campaign.interface.js';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard.js';
import { UnuthenticatedGuard } from './auth/guards/unauthenticated.guard.js';
import { AuthenticatedComponent } from './authenticated/authenticated.component.js';
import { PlayService } from './campaigns/play/play.service.js';
import { CampaignsApiService } from './campaigns/services/campaigns-api.service.js';
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
                providers: [PlayService],
                resolve: {
                  campaign: (
                    activatedRouteSnapshot: ActivatedRouteSnapshot,
                  ): Observable<HwCampaign> => {
                    const playService = inject(PlayService);
                    const campaignsApiService = inject(CampaignsApiService);

                    const id = Number(activatedRouteSnapshot.paramMap.get('campaignId'));

                    return campaignsApiService.get(id).pipe(
                      tap((campaign) => {
                        playService.campaign.set(campaign);
                      }),
                    );
                  },
                },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    loadComponent: () =>
                      import('./campaigns/play/play.component').then((m) => m.PlayComponent),
                    canActivate: [
                      (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
                        const playService = inject(PlayService);
                        const router = inject(Router);
                        const id = activatedRouteSnapshot.parent!.paramMap.get('id');
                        return playService.campaign().adventure
                          ? router.createUrlTree(['campaigns', id, 'board'])
                          : router.createUrlTree(['campaigns', id, 'town']);
                      },
                    ],
                  },
                  {
                    path: 'town',
                    loadComponent: () =>
                      import('./campaigns/play/town/town.component').then((m) => m.TownComponent),
                  },
                  {
                    path: 'board',
                    loadComponent: () =>
                      import('./campaigns/play/board/board.component').then(
                        (m) => m.BoardComponent,
                      ),
                  },
                ],
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
