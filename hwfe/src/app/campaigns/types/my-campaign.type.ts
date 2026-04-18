import { HwCampaign, HwMembershipStatus, HwUserAny } from '@hw/shared';

export type MyMember = HwUserAny & {
  status: HwMembershipStatus;
  joinedAt: Date;
};

export type MyCampaign = Omit<HwCampaign, 'masterId' | 'memberIds' | 'membershipIds'> & {
  master: HwUserAny;
  members: MyMember[];
};
