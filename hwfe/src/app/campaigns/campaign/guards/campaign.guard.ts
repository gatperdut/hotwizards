import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { CampaignsApiService } from '../../services/campaigns-api.service';
import { CampaignService } from '../campaign.service';

export const campaignGuard: CanActivateFn = (activatedRouteSnapshot) => {
  const campaignService = inject(CampaignService);
  const campaignsApiService = inject(CampaignsApiService);
  const router = inject(Router);
  const campaignId = Number(activatedRouteSnapshot.paramMap.get('campaignId'));

  const campaign$ = campaignService.campaign()
    ? of(campaignService.campaign())
    : campaignsApiService.get(campaignId);

  return campaign$.pipe(
    tap((campaign) => {
      campaignService.campaign.set(campaign);
    }),
    map((campaign) => {
      if (activatedRouteSnapshot.firstChild) {
        return true;
      }

      return router.createUrlTree([
        'home',
        'campaigns',
        activatedRouteSnapshot.paramMap.get('campaignId'),
        campaign.adventure ? 'board' : 'town',
      ]);
    }),
    catchError(() => {
      return of(router.createUrlTree(['home']));
    }),
  );
};
