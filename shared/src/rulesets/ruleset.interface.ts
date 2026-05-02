import { Movement } from '@hw/prismagen/client';

export interface HwRuleset {
  id: number;
  campaignId: number;
  aoo: boolean;
  movement: Movement;
}
