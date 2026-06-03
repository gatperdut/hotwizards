export const ItemSources = ['gear', 'backpack'] as const;

export type ItemSource = (typeof ItemSources)[number];
