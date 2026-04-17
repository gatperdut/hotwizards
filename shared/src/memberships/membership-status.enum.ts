export const HwMembershipStatuses = ['PENDING', 'ACCEPTED'] as const;

export type HwMembershipStatus = (typeof HwMembershipStatuses)[number];
