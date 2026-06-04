export interface MembershipsSingleDownstream {
  downCreateMemberships: (membershipIds: number[]) => void;
  downAbandonMembership: (memberHandle: string) => void;
  downKickoutMembership: (campaignNname: string, masterHandle: string) => void;
  downUpdateMembership: (membershipId: number) => void;
}
