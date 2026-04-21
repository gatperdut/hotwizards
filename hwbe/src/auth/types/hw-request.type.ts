import { Campaign, Membership, User } from '@hw/prismagen/client';
import { Request } from 'express';

export type HwRequest = Request & {
  user: User;
  campaign: Campaign;
  membership: Membership;
};
