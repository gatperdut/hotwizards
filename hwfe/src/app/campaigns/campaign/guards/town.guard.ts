import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { CampaignService } from '../campaign.service.js';

export const townGuard: CanActivateFn = (activatedRouteSnapshot): boolean | UrlTree => {
  const campaignService = inject(CampaignService);
  const router = inject(Router);
  const campaignId = activatedRouteSnapshot.paramMap.get('campaignId');

  return campaignService.campaign().adventure
    ? router.createUrlTree(['home', 'campaigns', campaignId, 'board'])
    : true;
};
