import { HwAdventure } from '../adventures/adventure.interface.js';
import { HwBackpack } from '../inventory/backpack.interface.js';
import { HwMembership } from '../memberships/membership.interface.js';
import { HwRuleset } from '../rulesets/ruleset.interface.js';
import { HwUser } from '../users/user.interface.js';

export interface HwCampaign {
  id: number;
  name: string;
  createdAt: Date;
  master: HwUser;
  memberships: HwMembership[];
  ruleset: HwRuleset;
  adventure?: HwAdventure;
  stash: HwBackpack;
}
