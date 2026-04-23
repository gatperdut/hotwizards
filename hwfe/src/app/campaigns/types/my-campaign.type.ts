import { HwCampaign, HwCharacter, HwMembership, HwUserAny } from '@hw/shared';

export type HwfeCharacter = Omit<HwCharacter, 'membershipId'>;

export type HwfeMembership = Omit<HwMembership, 'userId' | 'campaignId' | 'characterId'> & {
  user: HwUserAny;
  character?: HwfeCharacter;
};

export type HwfeCampaign = Omit<HwCampaign, 'masterId' | 'memberIds' | 'membershipIds'> & {
  master: HwUserAny;
  memberships: HwfeMembership[];
};
