export const Diagonals = ['ne', 'se', 'sw', 'nw'] as const;

export type Diagonal = (typeof Diagonals)[number];
