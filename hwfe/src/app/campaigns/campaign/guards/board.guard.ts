import { inject } from '@angular/core';
import { CanActivateFn, MaybeAsync, Router, UrlTree } from '@angular/router';
import { CampaignService } from '../campaign.service';

export const boardGuard: CanActivateFn = (): MaybeAsync<boolean | UrlTree> => {
  const campaignService = inject(CampaignService);
  const router = inject(Router);

  return campaignService.campaign().adventure
    ? true
    : router.createUrlTree(['home', 'campaigns', campaignService.campaign().id, 'town']);
};
