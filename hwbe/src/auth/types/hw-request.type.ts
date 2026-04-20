import { Campaign, User } from '@hw/prismagen/client';
import { Request } from 'express';

export type HwRequest = Request & {
  user: User;
  ownedCampaign: Campaign;
};
