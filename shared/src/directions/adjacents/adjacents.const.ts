export const Adjacents = ['n', 'e', 's', 'w'] as const;

export type Adjacent = (typeof Adjacents)[number];
