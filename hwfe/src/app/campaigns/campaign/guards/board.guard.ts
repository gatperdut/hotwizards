import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { CampaignService } from '../campaign.service';

export const boardGuard: CanActivateFn = (activatedRouteSnapshot): boolean | UrlTree => {
  const campaignService = inject(CampaignService);
  const router = inject(Router);
  const campaignId = activatedRouteSnapshot.paramMap.get('campaignId');

  return campaignService.campaign().adventure
    ? true
    : router.createUrlTree(['home', 'campaigns', campaignId, 'town']);
};
