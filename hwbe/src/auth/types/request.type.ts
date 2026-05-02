import { User } from '@hw/prismagen/client';
import { HwCampaign, HwMembership } from '@hw/shared';
import { Request } from 'express';

export type HwRequest = Request & {
  user: User;
  campaign: HwCampaign;
  membership: HwMembership;
};
