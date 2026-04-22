import { MembershipStatus } from '@hw/prismagen/enums.js';

export interface HwMembership {
  id: number;
  userId: number;
  campaignId: number;
  characterId?: number;
  status: MembershipStatus;
  joinedAt: Date;
}
