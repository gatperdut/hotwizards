export const HwAlignments = ['MONSTER', 'HERO'] as const;

export type HwAlignment = (typeof HwAlignments)[number];
