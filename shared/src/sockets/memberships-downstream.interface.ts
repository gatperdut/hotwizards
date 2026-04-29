export interface MembershipsDownstream {
  downCreateMembership: (id: number) => void;
  downDeleteMembership: (id: number) => void;
}
