export const SpawnSpritePaths = ['/tiles/spawns/spawn.png'] as const;

export type SpawnSpritePath = (typeof SpawnSpritePaths)[number];
