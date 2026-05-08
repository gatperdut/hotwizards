import { Movement } from '@hw/prismagen/browser';

export interface HwRuleset {
  id: number;
  campaignId: number;
  aoo: boolean;
  movement: Movement;
}
