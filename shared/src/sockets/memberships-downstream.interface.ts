export interface MembershipsDownstream {
  downCreateMembership: (campaignId: number) => void;
  downDeleteMembership: (campaignId: number, membershipId: number) => void;
}
