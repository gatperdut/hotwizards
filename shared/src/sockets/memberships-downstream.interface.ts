export interface MembershipsDownstream {
  downCreateMembership: (campaignId: number, userIds: number[]) => void;
  downDeleteMembership: (campaignId: number, membershipId: number) => void;
  downUpdateMembership: (campaignId: number, membershipId: number) => void;
}
