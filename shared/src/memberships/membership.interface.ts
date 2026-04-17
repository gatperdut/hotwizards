import { HwMembershipStatus } from './membership-status.enum.js';

export interface HwMembership {
  id: number;
  userId: number;
  campaignId: number;
  status: HwMembershipStatus;
  joinedAt: Date;
}
