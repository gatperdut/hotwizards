export const HwMembershipStatuses = ['PENDING', 'ACTIVE'] as const;

export type HwMembershipStatus = (typeof HwMembershipStatuses)[number];
