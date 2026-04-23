import { HwCampaign, HwCharacter, HwMembership, HwUser } from '@hw/shared';

export type HwfeCharacter = Omit<HwCharacter, 'membershipId'>;

export type HwfeUser = HwUser & {
  me: boolean;
};

export type HwfeMembership = Omit<HwMembership, 'userId' | 'campaignId' | 'characterId'> & {
  user: HwfeUser;
  character?: HwfeCharacter;
};

export type HwfeCampaign = Omit<HwCampaign, 'masterId' | 'memberIds' | 'membershipIds'> & {
  master: HwfeUser;
  memberships: HwfeMembership[];
};
