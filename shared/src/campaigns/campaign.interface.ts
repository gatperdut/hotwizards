import { HwMembership, HwRuleset, HwUser } from '@hw/shared';

export interface HwCampaign {
  id: number;
  name: string;
  createdAt: Date;
  master: HwUser;
  memberships: HwMembership[];
  ruleset: HwRuleset;
}
