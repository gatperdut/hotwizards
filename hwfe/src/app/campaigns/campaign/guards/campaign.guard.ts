import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { catchError, map, of, tap } from 'rxjs';
import { CampaignsApiService } from '../../services/campaigns-api.service';
import { CampaignService } from '../campaign.service';

export const campaignGuard: CanActivateFn = (activatedRouteSnapshot): MaybeAsync<GuardResult> => {
  const campaignService = inject(CampaignService);
  const campaignsApiService = inject(CampaignsApiService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const campaignId = Number(activatedRouteSnapshot.paramMap.get('campaignId'));

  if (Number.isNaN(campaignId)) {
    errorToast(toastService);
    return router.createUrlTree(['home', 'campaigns']);
  }

  return campaignsApiService.get(campaignId).pipe(
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
      errorToast(toastService);
      return of(router.createUrlTree(['home', 'campaigns']));
    }),
  );
};

const errorToast = (toastService: ToastService): void => {
  toastService.show({ message: 'Campaign not found', color: 'warning' });
};
