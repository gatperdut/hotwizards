import { MembershipStatus } from '@hw/prismagen/client';

export interface HwMembership {
  id: number;
  userId: number;
  campaignId: number;
  characterId?: number;
  status: MembershipStatus;
  joinedAt: Date;
}
