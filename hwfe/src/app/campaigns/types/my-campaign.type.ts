import { MembershipStatus } from '@hw/prismagen/browser';
import { HwCampaign, HwUserAny } from '@hw/shared';

export type MyMember = HwUserAny & {
  status: MembershipStatus;
  joinedAt: Date;
};

export type MyCampaign = Omit<HwCampaign, 'masterId' | 'memberIds' | 'membershipIds'> & {
  master: HwUserAny;
  members: MyMember[];
};
