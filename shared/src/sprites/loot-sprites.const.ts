export const LootSpritePaths = ['/tiles/loots/loot.png'] as const;

export type LootSpritePath = (typeof LootSpritePaths)[number];
