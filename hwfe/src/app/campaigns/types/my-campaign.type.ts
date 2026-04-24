import { HwCampaign, HwCharacter, HwMembership, HwRuleset, HwUser } from '@hw/shared';

export type HwfeMe = {
  me: boolean;
};

export type HwfeCharacter = Omit<HwCharacter, 'membershipId'> & HwfeMe;

export type HwfeUser = HwUser & HwfeMe;

export type HwfeMembership = Omit<HwMembership, 'userId' | 'campaignId' | 'characterId'> &
  HwfeMe & {
    user: HwfeUser;
    character?: HwfeCharacter;
  };

export type HwfeRuleset = Omit<HwRuleset, 'campaignId'>;

export type HwfeCampaign = Omit<
  HwCampaign,
  'masterId' | 'memberIds' | 'rulesetId' | 'membershipIds'
> & {
  master: HwfeUser;
  memberships: HwfeMembership[];
  ruleset: HwfeRuleset;
};
