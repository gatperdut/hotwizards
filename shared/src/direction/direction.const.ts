export const Directions = ['n', 'e', 's', 'w'] as const;

export type Direction = (typeof Directions)[number];
