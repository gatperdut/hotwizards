export interface MembershipsDownstream {
  downCreateMembership: (campaignId: number, membershipIds: number[]) => void;
  downAbandonMembership: (campaignId: number, memberHandle: string) => void;
  downKickoutMembership: (campaignId: number, campaignNname: string, masterHandle: string) => void;
  downUpdateMembership: (campaignId: number, membershipId: number) => void;
}
