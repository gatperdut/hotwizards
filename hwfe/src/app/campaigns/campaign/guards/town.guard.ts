import { inject } from '@angular/core';
import { CanActivateFn, MaybeAsync, Router, UrlTree } from '@angular/router';
import { HwMembership } from '@hw/shared';
import { CampaignService } from '../campaign.service.js';

export const townGuard: CanActivateFn = (): MaybeAsync<boolean | UrlTree> => {
  const campaignService = inject(CampaignService);
  const router = inject(Router);

  const membership = campaignService.campaign().memberships.find((m) => m.me) as HwMembership;

  if (membership?.status === 'PENDING') {
    return router.createUrlTree(['home', 'campaigns']);
  }

  return campaignService.campaign().adventure
    ? router.createUrlTree(['home', 'campaigns', campaignService.campaign().id, 'board'])
    : true;
};
