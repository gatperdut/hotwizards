import { inject } from '@angular/core';
import { CanActivateFn, MaybeAsync, Router, UrlTree } from '@angular/router';
import { CampaignService } from '../campaign.service.js';

export const townGuard: CanActivateFn = (): MaybeAsync<boolean | UrlTree> => {
  const campaignService = inject(CampaignService);
  const router = inject(Router);

  return campaignService.campaign().adventure
    ? router.createUrlTree(['home', 'campaigns', campaignService.campaign().id, 'board'])
    : true;
};
